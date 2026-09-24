"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/button";
import { CabecalhoPasso } from "@/components/ui/cabecalho-passo";
import { Folha } from "@/components/ui/folha";
import { Field, PasswordInput } from "@/components/ui/input";
import { aoMudar, aoSair, primeiroInvalido, useFocoPendente } from "@/components/ui/formulario";
import { Notice } from "@/components/ui/notice";
import { localizePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

// Frames "Nova palavra-passe" (default W0bUT / Scas6, palavra-passe fraca fCpsK, ligação
// inválida J1KzAL / wpWXC, sucesso WO9W1) do design-system.pen.
//
// POST /api/area-cliente/repor-palavra-passe/confirmar com uid + token + new_password.
// - 200: não abre sessão (o Django termina todas as sessões da conta); segue para Entrar
//   com `?reposta=1`, que mostra "Palavra-passe alterada." na folha de entrar.
// - 400 com error "ligacao_invalida": token usado ou expirado; troca o formulário pelo
//   aviso e por "Pedir nova ligação" (/recuperar-palavra-passe, o pedido de ligação).
// - 400 com errors.new_password: palavra-passe recusada pelos validadores do Django.
// - 400 com errors.geral, 429, 502: aviso genérico na folha.

// - Micro-interacções (design-guardrails.md §6): erro de cada campo em blur ou ao submeter,
//   some quando o valor fica válido; ao submeter com erros o foco vai para o primeiro
//   inválido (ou para o aviso geral, num erro do servidor); botão em espera com aria-busy.

type Erros = Partial<Record<"newPassword" | "confirmPassword" | "geral", string>>;

/** Mínimo de caracteres da palavra-passe nova (validador do Django, `newPasswordHint`). */
const PASSWORD_MIN = 8;

const ORDEM: [string, string][] = [
  ["newPassword", "repor-password-nova"],
  ["confirmPassword", "repor-password-confirmar"],
  ["geral", "repor-erro"],
];

export function NovaPalavraPasseForm({
  ligacao,
  lang,
  t,
  tSeguranca,
}: {
  ligacao: { uid: string; token: string } | null;
  lang: Locale;
  t: Dictionary["areaCliente"]["repor"];
  tSeguranca: Dictionary["areaCliente"]["definicoes"]["seguranca"];
}) {
  const router = useRouter();
  const [invalida, setInvalida] = useState(ligacao === null);
  const [passwordNova, setPasswordNova] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [aMudar, setAMudar] = useState(false);
  const focarDepois = useFocoPendente();

  const validarNova = (valor: string) =>
    valor.length >= PASSWORD_MIN ? undefined : tSeguranca.errNewPassword;
  const validarConfirmacao = (valor: string, original = passwordNova) =>
    valor === original ? undefined : tSeguranca.errPasswordMismatch;

  // Erros com o foco no primeiro inválido (ou no aviso geral).
  function mostrarErros(proximos: Erros) {
    setErros(proximos);
    focarDepois(primeiroInvalido(proximos, ORDEM));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ligacao || aMudar) return;

    const locais: Erros = {
      newPassword: validarNova(passwordNova),
      confirmPassword: validarConfirmacao(confirmar),
    };
    if (locais.newPassword || locais.confirmPassword) {
      mostrarErros(locais);
      return;
    }
    setErros({});

    setAMudar(true);
    try {
      const resposta = await fetch("/api/area-cliente/repor-palavra-passe/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...ligacao, new_password: passwordNova }),
      });

      if (resposta.status === 400) {
        const dados = await resposta.json();
        if (dados.error === "ligacao_invalida") {
          setInvalida(true);
          return;
        }
        const e = dados.errors ?? {};
        const doServidor: Erros = {
          newPassword: e.new_password?.[0] ? tSeguranca.errNewPassword : undefined,
          geral: e.geral ? tSeguranca.errGeneral : undefined,
        };
        // Um 400 sem nenhum erro conhecido não pode ficar sem aviso.
        if (!doServidor.newPassword && !doServidor.geral) doServidor.geral = tSeguranca.errGeneral;
        mostrarErros(doServidor);
        return;
      }

      if (!resposta.ok) {
        mostrarErros({ geral: tSeguranca.errGeneral });
        return;
      }

      router.push(localizePath(lang, "/area-cliente/entrar?reposta=1"));
    } catch {
      mostrarErros({ geral: tSeguranca.errGeneral });
    } finally {
      setAMudar(false);
    }
  }

  if (invalida) {
    return (
      <div className="flex w-full flex-col gap-xl pt-xl">
        <CabecalhoPasso title={t.heading} />
        <div className="flex w-full max-w-[448px] flex-col items-start gap-lg">
          <Notice tone="error" role="alert" title={t.invalidTitle} description={t.invalidBody} />
          <ButtonLink href="/area-cliente/recuperar-palavra-passe" size="action">
            {t.requestNew}
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-xl pt-xl">
      <CabecalhoPasso title={t.heading} subtitle={t.intro} />
      <form noValidate onSubmit={onSubmit} className="w-full max-w-[448px]">
        <Folha
          actions={
            <Button type="submit" size="action" fullWidth busy={aMudar}>
              {aMudar ? tSeguranca.submitting : tSeguranca.submit}
            </Button>
          }
        >
          {erros.geral ? (
            <Notice id="repor-erro" focavel tone="error" role="alert" title={erros.geral} />
          ) : null}
          <Field
            htmlFor="repor-password-nova"
            label={tSeguranca.newPassword}
            hint={tSeguranca.newPasswordHint}
            error={erros.newPassword}
            variant="folha"
          >
            <PasswordInput
              id="repor-password-nova"
              autoComplete="new-password"
              value={passwordNova}
              showLabel={tSeguranca.showPassword}
              hideLabel={tSeguranca.hidePassword}
              onChange={(e) => {
                setPasswordNova(e.target.value);
                aoMudar(setErros, "newPassword", validarNova(e.target.value));
                // A confirmação depende desta: se já mostra erro, reavalia-se.
                aoMudar(setErros, "confirmPassword", validarConfirmacao(confirmar, e.target.value));
              }}
              onBlur={(e) => aoSair(setErros, "newPassword", validarNova(e.target.value))}
            />
          </Field>
          <Field
            htmlFor="repor-password-confirmar"
            label={tSeguranca.confirmPassword}
            error={erros.confirmPassword}
            variant="folha"
          >
            <PasswordInput
              id="repor-password-confirmar"
              autoComplete="new-password"
              value={confirmar}
              showLabel={tSeguranca.showPassword}
              hideLabel={tSeguranca.hidePassword}
              onChange={(e) => {
                setConfirmar(e.target.value);
                aoMudar(setErros, "confirmPassword", validarConfirmacao(e.target.value));
              }}
              onBlur={(e) =>
                aoSair(setErros, "confirmPassword", validarConfirmacao(e.target.value))
              }
            />
          </Field>
        </Folha>
      </form>
    </div>
  );
}
