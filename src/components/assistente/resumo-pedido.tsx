"use client";

import { useState } from "react";
import { BlocoDaVez } from "@/components/ui/bloco-da-vez";
import { Button } from "@/components/ui/button";
import { ErroCampo } from "@/components/ui/erro-campo";
import { Input, Textarea } from "@/components/ui/input";
import { LigacaoBotao } from "@/components/ui/ligacao";
import { LinhaResumo } from "@/components/ui/linha-resumo";
import { Notice } from "@/components/ui/notice";
import type { Dictionary } from "@/i18n/dictionaries";
import { erroDoEmail } from "@/lib/email";
import type { Rascunho } from "./tipos";

// Resumo e confirmação do pedido (ds/overlay/assistente, «Corpo» dos frames 3 a 5 do .pen,
// com o ds/layout/bloco-da-vez--mobile): o único bloco da vez do painel. Linhas de resumo
// com «Alterar»; ao alterar, a linha passa a um campo empilhado (B · Registo em linhas) com
// «Cancelar» e «Guardar», e com um campo aberto o «Enviar pedido» fica desactivado e o
// «Cancelar» do bloco desaparece (nunca dois à vista). Enviado: título e texto neutros, resumo
// só de leitura, sem botões. Os rótulos «A sua vez»/«A nossa vez» do .pen não passam para o
// código (o dono retirou o rótulo de «vez» do React em 2026-09-24). O assistente só propõe: é
// este botão que envia, pelo mesmo /api/contacto do formulário.

type Campo = "name" | "email" | "phone" | "message";

export type ErroEnvio = { titulo: string; texto?: string };

export function ResumoPedido({
  rascunho,
  enviado,
  aEnviar,
  erro,
  t,
  contacto,
  onGuardar,
  onEnviar,
  onCancelar,
}: {
  rascunho: Rascunho;
  enviado: boolean;
  aEnviar: boolean;
  erro: ErroEnvio | null;
  t: Dictionary["assistente"];
  contacto: Dictionary["contacto"];
  onGuardar: (rascunho: Rascunho) => void;
  onEnviar: () => void;
  onCancelar: () => void;
}) {
  const [editar, setEditar] = useState<Campo | null>(null);
  const [valor, setValor] = useState("");
  const [erroCampo, setErroCampo] = useState<string | undefined>();
  const s = contacto.summary;
  const v = contacto.form.validation;

  const linhas: { campo: Campo; rotulo: string; mono?: boolean }[] = [
    { campo: "name", rotulo: s.nameLabel },
    { campo: "email", rotulo: s.emailLabel, mono: true },
    { campo: "phone", rotulo: s.phoneLabel },
    { campo: "message", rotulo: s.needLabel },
  ];

  function validar(campo: Campo, texto: string): string | undefined {
    if (campo === "name") return texto.trim() ? undefined : v.nameRequired;
    if (campo === "email") return erroDoEmail(texto, v);
    if (campo === "message") return texto.trim() ? undefined : v.messageRequired;
    return undefined;
  }

  function abrir(campo: Campo) {
    setEditar(campo);
    setValor(rascunho[campo]);
    setErroCampo(undefined);
  }

  function guardar() {
    if (!editar) return;
    const erroAgora = validar(editar, valor);
    if (erroAgora) return setErroCampo(erroAgora);
    onGuardar({ ...rascunho, [editar]: valor.trim() });
    setEditar(null);
  }

  return (
    <BlocoDaVez compacto title={enviado ? t.summary.sentTitle : s.title} titleAs="p">
      {enviado ? (
        <p className="font-body text-body text-text-secondary" role="status">
          {t.summary.sentText}
        </p>
      ) : null}

      <dl className="mt-xs border-t border-border-default">
        {linhas.map(({ campo, rotulo, mono }) => {
          if (editar === campo) {
            const id = `assistente-editar-${campo}`;
            return (
              <div
                key={campo}
                className="flex flex-col gap-xs border-b border-border-default py-md"
              >
                <dt>
                  <label htmlFor={id} className="font-body text-caption text-text-tertiary">
                    {rotulo}
                  </label>
                </dt>
                <dd className="flex flex-col gap-xs">
                  {campo === "message" ? (
                    <Textarea
                      id={id}
                      rows={3}
                      autoFocus
                      value={valor}
                      invalid={!!erroCampo}
                      onChange={(e) => {
                        setValor(e.target.value);
                        if (erroCampo) setErroCampo(validar(campo, e.target.value));
                      }}
                      onBlur={(e) => setErroCampo(validar(campo, e.target.value))}
                    />
                  ) : (
                    <Input
                      id={id}
                      autoFocus
                      type={campo === "email" ? "email" : campo === "phone" ? "tel" : "text"}
                      autoComplete={
                        campo === "email" ? "email" : campo === "phone" ? "tel" : "name"
                      }
                      value={valor}
                      invalid={!!erroCampo}
                      onChange={(e) => {
                        setValor(e.target.value);
                        if (erroCampo) setErroCampo(validar(campo, e.target.value));
                      }}
                      onBlur={(e) => setErroCampo(validar(campo, e.target.value))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          guardar();
                        }
                      }}
                    />
                  )}
                  {erroCampo ? <ErroCampo id={`${id}-erro`}>{erroCampo}</ErroCampo> : null}
                  <div className="flex justify-end gap-sm">
                    <Button variant="outline" size="compact" onClick={() => setEditar(null)}>
                      {t.summary.cancel}
                    </Button>
                    <Button size="compact" onClick={guardar}>
                      {t.summary.save}
                    </Button>
                  </div>
                </dd>
              </div>
            );
          }

          const vazio = campo === "phone" && !rascunho.phone;
          return (
            <LinhaResumo
              key={campo}
              rotulo={rotulo}
              valor={vazio ? s.notProvided : rascunho[campo]}
              mono={mono}
              vazio={vazio}
              acao={
                enviado ? undefined : (
                  <LigacaoBotao disabled={aEnviar} onClick={() => abrir(campo)}>
                    {t.summary.alter}
                  </LigacaoBotao>
                )
              }
            />
          );
        })}
      </dl>

      {enviado ? null : (
        <>
          {erro ? (
            <Notice tone="error" role="alert" title={erro.titulo} description={erro.texto} />
          ) : null}

          <div className="flex justify-end gap-sm pt-xs">
            {editar ? null : (
              <Button variant="outline" disabled={aEnviar} onClick={onCancelar}>
                {t.summary.cancel}
              </Button>
            )}
            <Button
              busy={aEnviar}
              disabled={editar !== null}
              rotuloEspera={t.summary.sending}
              onClick={onEnviar}
            >
              {t.summary.send}
            </Button>
          </div>
        </>
      )}
    </BlocoDaVez>
  );
}
