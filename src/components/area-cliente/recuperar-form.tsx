"use client";

import { useEffect, useRef, useState } from "react";
import { AuthSection } from "@/components/area-cliente/auth-shell";
import {
  FactoEmail,
  useFormularioAuth,
  type CamposEmail,
} from "@/components/area-cliente/formulario-auth";
import { SEM_ANEL, aoMudar, aoSair } from "@/components/ui/formulario";
import { BlocoDaVez } from "@/components/ui/bloco-da-vez";
import { Button } from "@/components/ui/button";
import { Folha } from "@/components/ui/folha";
import { Field, Input } from "@/components/ui/input";
import { LigacaoBotao } from "@/components/ui/ligacao";
import { Notice } from "@/components/ui/notice";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

// Pedir a ligação para repor a palavra-passe, em /recuperar-palavra-passe (rota própria
// desde 2026-09-24; antes era um estado do Entrar). Frames "repor palavra-passe" (M28ONs /
// X4UZnd) e "ligação enviada" (x0yWhZ / hXaJa) do grupo "v2 · A vez" do design-system.pen.
//
// O título «Esqueceu a palavra-passe?» e a seta para Entrar vivem na barra fixa do
// `AuthShell`; aqui o <h1> é o mesmo texto, só para leitores de ecrã (sem o repetir à vista).
// Sem switch Entrar | Criar conta e sem Voltar dentro da coluna.
//
// O pedido responde sempre 202 com a mesma confirmação neutra, exista ou não conta com esse
// email (o Django garante-o; aqui não se diz mais nada que o denuncie). Nada recebe foco ao
// carregar; ao passar a "enviada" o foco vai para o bloco (anunciado por role="status").

type Erros = Partial<Record<"email" | "geral", string>>;

// Aviso geral (erro do servidor): recebe o foco, que não pode ficar em <body> depois de o
// botão em espera se desactivar.
const ID_ERRO = "recuperar-erro";

export function RecuperarForm({
  lang,
  campos,
  t,
}: {
  lang: Locale;
  campos: CamposEmail;
  t: Dictionary["areaCliente"]["entrar"];
}) {
  const { focarDepois, validarEmail, erroEmail } = useFormularioAuth(lang, campos);
  const [email, setEmail] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [aPedir, setAPedir] = useState(false);
  const [enviada, setEnviada] = useState(false);
  const blocoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (enviada) blocoRef.current?.focus();
  }, [enviada]);

  async function pedirLigacao() {
    if (aPedir) return;
    const erroLocal = validarEmail(email);
    if (erroLocal) {
      setErros({ email: erroLocal });
      focarDepois("recuperar-email");
      return;
    }
    setErros({});
    setAPedir(true);
    try {
      const resposta = await fetch("/api/area-cliente/repor-palavra-passe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lang }),
      });

      if (resposta.status === 400) {
        const dados = await resposta.json();
        const e = dados.errors ?? {};
        if (e.email) {
          // Mensagem do Django (em português) só em pt; nos outros idiomas a chave do campo.
          setErros({ email: erroEmail(e.email[0], email, t.resetErr) });
          focarDepois("recuperar-email");
          return;
        }
        setErros({ geral: t.resetErr });
        focarDepois(ID_ERRO);
        return;
      }

      if (!resposta.ok) {
        // 429 (demasiados pedidos) e 502 (backend indisponível): tentar daqui a nada.
        setErros({ geral: t.resetErr });
        focarDepois(ID_ERRO);
        return;
      }

      setEnviada(true);
    } catch {
      setErros({ geral: t.resetErr });
      focarDepois(ID_ERRO);
    } finally {
      setAPedir(false);
    }
  }

  return (
    <AuthSection>
      <h1 className="sr-only">{t.resetHeading}</h1>
      {enviada ? (
        <div className="flex w-full flex-col gap-sm pt-xs">
          <div ref={blocoRef} tabIndex={-1} role="status" style={SEM_ANEL}>
            <BlocoDaVez fact={<FactoEmail>{email}</FactoEmail>} title={t.resetSentTitle} titleAs="h2">
              <p className="font-body text-body text-text-secondary">{t.resetSentBody}</p>
              <LigacaoBotao onClick={() => void pedirLigacao()} disabled={aPedir}>
                {aPedir ? t.resetSubmitting : t.resetResend}
              </LigacaoBotao>
            </BlocoDaVez>
          </div>
          {erros.geral ? <Notice id={ID_ERRO} focavel tone="error" role="alert" title={erros.geral} /> : null}
        </div>
      ) : (
        <>
          <p className="pt-xs font-body text-body text-text-secondary">{t.resetIntro}</p>
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              void pedirLigacao();
            }}
            className="w-full pt-xl"
          >
            <Folha
              contentGap="xl"
              actions={
                <Button type="submit" size="action" fullWidth busy={aPedir}>
                  {aPedir ? t.resetSubmitting : t.resetSubmit}
                </Button>
              }
            >
              {erros.geral ? <Notice id={ID_ERRO} focavel tone="error" role="alert" title={erros.geral} /> : null}
              <Field htmlFor="recuperar-email" label={t.email} error={erros.email} variant="folha">
                <Input
                  id="recuperar-email"
                  type="email"
                  autoComplete="email"
                  placeholder={t.emailPlaceholder}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    aoMudar(setErros, "email", validarEmail(e.target.value));
                  }}
                  onBlur={(e) => aoSair(setErros, "email", validarEmail(e.target.value))}
                />
              </Field>
            </Folha>
          </form>
        </>
      )}
    </AuthSection>
  );
}
