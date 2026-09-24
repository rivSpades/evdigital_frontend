"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Folha } from "@/components/ui/folha";
import { aoMudar, aoSair, primeiroInvalido, useFocoPendente } from "@/components/ui/formulario";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { Select, type SelectOption } from "@/components/ui/select";
import { localizePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

// Frames "Novo projeto" do grupo "v2 · A vez" do design-system.pen (x850Vs/YNsGT, erros
// nWvba/xMGTy, a enviar jT5NN/m9oYiT, erro do servidor iNAQS/ijRBy): a mesma folha do
// "Novo pedido" sem a pergunta do tipo nem o projeto (é sempre um projeto novo): Título,
// Descrição, Urgência, aviso dos anexos, erro do servidor no fim e só "Enviar pedido" no
// fundo. Dois grupos (campos; avisos) a $space-xl, campos a $space-lg dentro do grupo. O
// "Cancelar" do React não está no .pen e saiu (o Voltar vive no topo da página).

const URGENCIAS = ["quando_possivel", "esta_semana", "urgente"] as const;

type Erros = Partial<Record<"title" | "description" | "geral", string>>;

// Micro-interacções (design-guardrails.md §6): título e descrição validam-se no cliente
// antes do POST; o erro de cada um aparece ao sair dele (blur) ou ao submeter, e some quando
// fica válido. Ao submeter com erros o foco vai para o primeiro inválido; num erro do
// servidor sem campo, para o aviso geral. Botão em espera com aria-busy e a mesma largura.
const ORDEM: [string, string][] = [
  ["title", "projeto-titulo"],
  ["description", "projeto-descricao"],
  ["geral", "projeto-erro"],
];

export function NovoProjetoForm({
  lang,
  t,
}: {
  lang: Locale;
  t: Dictionary["areaCliente"]["novoProjeto"]["form"];
}) {
  const urgencias: SelectOption[] = URGENCIAS.map((value) => ({
    value,
    label: t.urgencias[value],
  }));
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [urgencia, setUrgencia] = useState("quando_possivel");
  const [erros, setErros] = useState<Erros>({});
  const [aEnviar, setAEnviar] = useState(false);
  const focarDepois = useFocoPendente();

  const validarTitulo = (valor: string) => (valor.trim() ? undefined : t.errTitleRequired);
  const validarDescricao = (valor: string) =>
    valor.trim() ? undefined : t.errDescriptionRequired;

  // Erros com o foco no primeiro inválido (ou no aviso geral).
  function mostrarErros(proximos: Erros) {
    setErros(proximos);
    focarDepois(primeiroInvalido(proximos, ORDEM));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (aEnviar) return;

    const locais: Erros = {
      title: validarTitulo(titulo),
      description: validarDescricao(descricao),
    };
    if (locais.title || locais.description) {
      mostrarErros(locais);
      return;
    }
    setErros({});
    setAEnviar(true);
    try {
      const resposta = await fetch("/api/area-cliente/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "novo_projeto",
          title: titulo,
          description: descricao,
          priority: urgencia,
        }),
      });

      if (resposta.status === 401) {
        router.push(localizePath(lang, "/area-cliente/entrar"));
        return;
      }

      if (resposta.status === 400) {
        const dados = await resposta.json();
        const e = dados.errors ?? {};
        // As mensagens de validação do backend vêm em português: só as usamos em pt; em
        // en/pl a chave do campo (`fallback`). Vazio: a frase do campo; outro erro (ex.
        // comprimento): a genérica.
        const doBackend = (mensagem: string | undefined, fallback: string) =>
          mensagem ? (lang === "pt" ? mensagem : fallback) : undefined;
        const doServidor: Erros = {
          title: doBackend(e.title?.[0], titulo.trim() ? t.errGeneral : t.errTitleRequired),
          description: doBackend(
            e.description?.[0],
            descricao.trim() ? t.errGeneral : t.errDescriptionRequired,
          ),
          // Este ecrã não mostra o tipo: um erro nele também vai para a mensagem geral.
          geral: e.geral || e.type ? t.errGeneral : undefined,
        };
        // Um 400 sem nenhum erro conhecido não pode ficar sem aviso.
        if (!Object.values(doServidor).some(Boolean)) doServidor.geral = t.errGeneral;
        mostrarErros(doServidor);
        return;
      }

      if (!resposta.ok) {
        mostrarErros({ geral: t.errGeneral });
        return;
      }

      const criado = await resposta.json();
      router.push(localizePath(lang, `/area-cliente/pedidos/${criado.id}`));
    } catch {
      mostrarErros({ geral: t.errGeneral });
    } finally {
      setAEnviar(false);
    }
  }

  return (
    <form noValidate onSubmit={onSubmit} className="w-full">
      <Folha
        contentGap="xl"
        actions={
          <Button
            type="submit"
            size="action"
            busy={aEnviar}
            className="w-full tracking-[var(--letter-spacing-label)] sm:w-fit"
          >
            {aEnviar ? t.submitting : t.submit}
          </Button>
        }
      >
        <div className="flex flex-col gap-lg">
          <Field htmlFor="projeto-titulo" label={t.titleLabel} error={erros.title} variant="folha">
            <Input
              id="projeto-titulo"
              placeholder={t.titlePlaceholder}
              value={titulo}
              onChange={(e) => {
                setTitulo(e.target.value);
                aoMudar(setErros, "title", validarTitulo(e.target.value));
              }}
              onBlur={(e) => aoSair(setErros, "title", validarTitulo(e.target.value))}
            />
          </Field>

          <Field
            htmlFor="projeto-descricao"
            label={t.descriptionLabel}
            hint={t.descriptionHint}
            error={erros.description}
            variant="folha"
          >
            <Textarea
              id="projeto-descricao"
              rows={5}
              className="min-h-40"
              placeholder={t.descriptionPlaceholder}
              value={descricao}
              onChange={(e) => {
                setDescricao(e.target.value);
                aoMudar(setErros, "description", validarDescricao(e.target.value));
              }}
              onBlur={(e) => aoSair(setErros, "description", validarDescricao(e.target.value))}
            />
          </Field>

          <Field htmlFor="projeto-urgencia" label={t.urgencyLabel} hint={t.urgencyHint} variant="folha">
            <Select
              id="projeto-urgencia"
              name="priority"
              value={urgencia}
              onChange={setUrgencia}
              options={urgencias}
              placeholder={t.urgencyPlaceholder}
              appearance="folha"
            />
          </Field>
        </div>

        <div className="flex flex-col gap-lg">
          <Notice tone="info" discreto title={t.attachments} />
          {erros.geral ? (
            <Notice id="projeto-erro" focavel tone="error" role="alert" title={erros.geral} />
          ) : null}
        </div>
      </Folha>
    </form>
  );
}
