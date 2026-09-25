"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Folha } from "@/components/ui/folha";
import { Field, PasswordInput } from "@/components/ui/input";
import { aoMudar, aoSair, primeiroInvalido, useFocoPendente } from "@/components/ui/formulario";
import { Notice } from "@/components/ui/notice";
import { useHrefAreaCliente } from "@/i18n/area-cliente-host";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

// Frames "Definições · Segurança" do grupo "v2 · A vez" do design-system.pen.
//
// Dois modos, pelo `has_usable_password` de /api/me/:
// - com palavra-passe (IEsRI e estados): introdução + folha com a atual, a nova e a
//   confirmação; "Mudar palavra-passe".
// - conta Google (PXWK3 / b7dSwt e estados): aviso "A sua conta está ligada ao Google." e
//   folha só com a nova e a confirmação; "Definir palavra-passe". Sucesso e erro com as
//   frases próprias. O handler (/api/area-cliente/password) não envia `old_password`
//   vazia e o Django aceita-a em falta para contas sem palavra-passe utilizável.
//
// Depois de definir, a página continua no modo Google até ser recarregada (como no frame
// de sucesso N39iN); ao recarregar, /api/me/ já diz `has_usable_password: true`.

//
// Micro-interacções (design-guardrails.md §6): erro de cada campo em blur ou ao submeter,
// some quando o valor fica válido; ao submeter com erros o foco vai para o primeiro inválido
// (ou para o aviso geral, num erro do servidor); botão em espera com aria-busy e a largura.

type Erros = Partial<Record<"oldPassword" | "newPassword" | "confirmPassword" | "geral", string>>;

/** Mínimo de caracteres da palavra-passe nova (validador do Django, `newPasswordHint`). */
const PASSWORD_MIN = 8;

const ORDEM: [string, string][] = [
  ["oldPassword", "password-antiga"],
  ["newPassword", "password-nova"],
  ["confirmPassword", "password-confirmar"],
  ["geral", "password-erro"],
];

export function PasswordForm({
  temPassword,
  lang,
  t,
}: {
  temPassword: boolean;
  lang: Locale;
  t: Dictionary["areaCliente"]["definicoes"]["seguranca"];
}) {
  const router = useRouter();
  const hrefAreaCliente = useHrefAreaCliente();
  const google = !temPassword;
  const [passwordAntiga, setPasswordAntiga] = useState("");
  const [passwordNova, setPasswordNova] = useState("");
  const [confirmarPasswordNova, setConfirmarPasswordNova] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [aMudar, setAMudar] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const errGeral = google ? t.googleErr : t.errGeneral;
  const focarDepois = useFocoPendente();

  const validarAtual = (valor: string) => (google || valor ? undefined : t.errOldPasswordRequired);
  const validarNova = (valor: string) =>
    valor.length >= PASSWORD_MIN ? undefined : t.errNewPassword;
  const validarConfirmacao = (valor: string, original = passwordNova) =>
    valor === original ? undefined : t.errPasswordMismatch;

  // Erros com o foco no primeiro inválido (ou no aviso geral).
  function mostrarErros(proximos: Erros) {
    setErros(proximos);
    focarDepois(primeiroInvalido(proximos, ORDEM));
  }

  // Atual vazia: o Django responde "Escreva a sua palavra-passe atual." (frase dele, em
  // português: só se usa em pt; en/pl usam `errOldPasswordRequired`).
  // Preenchida e errada: "A palavra-passe atual não está certa." (chave do dicionário).
  function erroAtual(doBackend: string): string {
    if (passwordAntiga) return t.errOldPassword;
    return lang === "pt" ? doBackend : t.errOldPasswordRequired;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (aMudar) return;
    setSucesso(false);

    const locais: Erros = {
      oldPassword: validarAtual(passwordAntiga),
      newPassword: validarNova(passwordNova),
      confirmPassword: validarConfirmacao(confirmarPasswordNova),
    };
    if (locais.oldPassword || locais.newPassword || locais.confirmPassword) {
      mostrarErros(locais);
      return;
    }
    setErros({});

    setAMudar(true);
    try {
      const resposta = await fetch("/api/area-cliente/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(google ? {} : { old_password: passwordAntiga }),
          new_password: passwordNova,
        }),
      });

      if (resposta.status === 401) {
        router.push(hrefAreaCliente(lang, "/area-cliente/entrar"));
        return;
      }

      if (resposta.status === 400) {
        const dados = await resposta.json();
        const e = dados.errors ?? {};
        const doServidor: Erros = {
          oldPassword: !google && e.old_password?.[0] ? erroAtual(e.old_password[0]) : undefined,
          newPassword: e.new_password?.[0] ? t.errNewPassword : undefined,
          // Numa conta Google um erro na atual não tem campo onde aparecer: vai para o aviso.
          geral: e.geral || (google && e.old_password) ? errGeral : undefined,
        };
        // Um 400 sem nenhum erro conhecido não pode ficar sem aviso.
        if (!doServidor.oldPassword && !doServidor.newPassword && !doServidor.geral) {
          doServidor.geral = errGeral;
        }
        mostrarErros(doServidor);
        return;
      }

      if (!resposta.ok) {
        mostrarErros({ geral: errGeral });
        return;
      }

      setSucesso(true);
      // O botão esteve desactivado (em espera): o foco vai para a confirmação em vez de
      // ficar em <body>.
      focarDepois("password-ok");
      setPasswordAntiga("");
      setPasswordNova("");
      setConfirmarPasswordNova("");
    } catch {
      mostrarErros({ geral: errGeral });
    } finally {
      setAMudar(false);
    }
  }

  const aGuardar = google ? t.googleSubmitting : t.submitting;
  const submeter = google ? t.googleSubmit : t.submit;

  return (
    <div className="flex w-full flex-col gap-lg md:gap-xl">
      {google ? (
        <Notice tone="info" title={t.googleTitle} description={t.googleBody} />
      ) : (
        <p className="font-body text-body text-text-secondary">{t.intro}</p>
      )}

      <form noValidate onSubmit={onSubmit} className="w-full">
        <Folha
          actions={
            <Button type="submit" size="action" busy={aMudar} className="w-full sm:w-fit">
              {aMudar ? aGuardar : submeter}
            </Button>
          }
        >
          {erros.geral ? (
            <Notice id="password-erro" focavel tone="error" role="alert" title={erros.geral} />
          ) : null}
          {sucesso ? (
            google ? (
              <Notice
                id="password-ok"
                focavel
                tone="ok"
                role="status"
                title={t.googleSuccessTitle}
                description={t.googleSuccessBody}
              />
            ) : (
              <Notice id="password-ok" focavel tone="ok" role="status" title={t.success} />
            )
          ) : null}

          {google ? null : (
            <Field
              htmlFor="password-antiga"
              label={t.oldPassword}
              error={erros.oldPassword}
            >
              <PasswordInput
                id="password-antiga"
                autoComplete="current-password"
                value={passwordAntiga}
                showLabel={t.showPassword}
                hideLabel={t.hidePassword}
                onChange={(e) => {
                  setPasswordAntiga(e.target.value);
                  aoMudar(setErros, "oldPassword", validarAtual(e.target.value));
                }}
                onBlur={(e) => aoSair(setErros, "oldPassword", validarAtual(e.target.value))}
              />
            </Field>
          )}

          <Field
            htmlFor="password-nova"
            label={t.newPassword}
            hint={t.newPasswordHint}
            error={erros.newPassword}
          >
            <PasswordInput
              id="password-nova"
              autoComplete="new-password"
              value={passwordNova}
              showLabel={t.showPassword}
              hideLabel={t.hidePassword}
              onChange={(e) => {
                setPasswordNova(e.target.value);
                aoMudar(setErros, "newPassword", validarNova(e.target.value));
                // A confirmação depende desta: se já mostra erro, reavalia-se.
                aoMudar(
                  setErros,
                  "confirmPassword",
                  validarConfirmacao(confirmarPasswordNova, e.target.value),
                );
              }}
              onBlur={(e) => aoSair(setErros, "newPassword", validarNova(e.target.value))}
            />
          </Field>

          <Field
            htmlFor="password-confirmar"
            label={t.confirmPassword}
            error={erros.confirmPassword}
          >
            <PasswordInput
              id="password-confirmar"
              autoComplete="new-password"
              value={confirmarPasswordNova}
              showLabel={t.showPassword}
              hideLabel={t.hidePassword}
              onChange={(e) => {
                setConfirmarPasswordNova(e.target.value);
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
