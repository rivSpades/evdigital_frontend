"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CirclePlus, Paperclip, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import { localizePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import type { Projeto } from "@/lib/area-cliente/types";

// Ecrã "Área de Cliente · Novo pedido" (sGpAX) do design-system.pen.

// "novo_projeto" tem o seu próprio ecrã (`/area-cliente/projetos/novo`) — este
// formulário serve apenas para pedidos sobre um projeto já existente.
const TIPOS = [
  { valor: "ticket", icone: TriangleAlert },
  { valor: "feature", icone: CirclePlus },
] as const;

const URGENCIAS = ["quando_possivel", "esta_semana", "urgente"] as const;

type Erros = Partial<Record<"type" | "title" | "description" | "geral", string>>;

export function NovoPedidoForm({
  projetos,
  lang,
  t,
  projetoFixo,
}: {
  projetos: Projeto[];
  lang: Locale;
  t: Dictionary["areaCliente"]["novoPedido"]["form"];
  projetoFixo?: Projeto;
}) {
  const urgencias: SelectOption[] = URGENCIAS.map((value) => ({
    value,
    label: t.urgencias[value],
  }));
  const router = useRouter();
  const [tipo, setTipo] = useState<(typeof TIPOS)[number]["valor"] | "">("");
  const [projeto, setProjeto] = useState(projetoFixo?.id ?? "");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [urgencia, setUrgencia] = useState("quando_possivel");
  const [erros, setErros] = useState<Erros>({});
  const [aEnviar, setAEnviar] = useState(false);

  const precisaDeProjeto = tipo === "ticket" || tipo === "feature";
  const opcoesProjeto: SelectOption[] = projetos.map((p) => ({ value: p.id, label: p.title }));

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErros({});

    if (!tipo) {
      setErros({ type: t.errType });
      return;
    }

    setAEnviar(true);
    try {
      const resposta = await fetch("/api/area-cliente/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: tipo,
          title: titulo,
          description: descricao,
          priority: urgencia,
          project: precisaDeProjeto ? (projetoFixo?.id ?? projeto) : "",
        }),
      });

      if (resposta.status === 401) {
        router.push(localizePath(lang, "/area-cliente/entrar"));
        return;
      }

      if (resposta.status === 400) {
        const dados = await resposta.json();
        const e = dados.errors ?? {};
        setErros({
          type: e.type?.[0],
          title: e.title?.[0],
          description: e.description?.[0],
        });
        return;
      }

      if (!resposta.ok) {
        setErros({ geral: t.errGeneral });
        return;
      }

      const criado = await resposta.json();
      router.push(localizePath(lang, `/area-cliente/pedidos/${criado.id}`));
    } catch {
      setErros({ geral: t.errGeneral });
    } finally {
      setAEnviar(false);
    }
  }

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-2xl">
      {projetoFixo ? (
        <p className="font-body text-body text-text-secondary">
          {t.forProjectContext.replace("{projeto}", projetoFixo.title)}
        </p>
      ) : null}

      <div className="flex flex-col gap-md">
        <p className="font-body text-label font-medium text-text-primary">
          {t.typeQuestion}
        </p>
        <div className="flex flex-col gap-md">
          {TIPOS.map((tp) => {
            const selecionado = tipo === tp.valor;
            const Icone = tp.icone;
            return (
              <button
                key={tp.valor}
                type="button"
                onClick={() => setTipo(tp.valor)}
                className={cn(
                  "flex items-center gap-md rounded-[var(--radius-md)] p-lg text-left transition-colors",
                  selecionado
                    ? "border-2 border-border-interactive bg-bg-surface-selected"
                    : "border border-border-subtle bg-bg-surface hover:bg-bg-surface-hover",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-[var(--radius-pill)] border-2",
                    selecionado ? "border-accent-primary" : "border-border-strong",
                  )}
                >
                  {selecionado ? <span className="size-3 rounded-full bg-accent-primary" /> : null}
                </span>
                <span className="flex flex-1 flex-col gap-2xs">
                  <span className="font-body text-body-lg font-semibold text-text-primary">
                    {t.tipos[tp.valor].titulo}
                  </span>
                  <span className="font-body text-body text-text-secondary">{t.tipos[tp.valor].descricao}</span>
                </span>
                <Icone
                  size={24}
                  strokeWidth={2}
                  aria-hidden
                  className={selecionado ? "text-text-accent" : "text-text-tertiary"}
                />
              </button>
            );
          })}
        </div>
        {erros.type ? <p className="font-body text-body text-feedback-error-fg">{erros.type}</p> : null}
      </div>

      <div className="flex flex-col gap-lg">
        {precisaDeProjeto && projetoFixo ? (
          <Field htmlFor="pedido-projeto" label={t.projectLabel}>
            <Input id="pedido-projeto" value={projetoFixo.title} disabled readOnly />
          </Field>
        ) : precisaDeProjeto && opcoesProjeto.length > 0 ? (
          <Field htmlFor="pedido-projeto" label={t.projectLabel}>
            <Select
              id="pedido-projeto"
              name="project"
              value={projeto}
              onChange={setProjeto}
              options={opcoesProjeto}
              placeholder={t.projectPlaceholder}
            />
          </Field>
        ) : null}

        <Field htmlFor="pedido-titulo" label={t.titleLabel} error={erros.title}>
          <Input
            id="pedido-titulo"
            placeholder={t.titlePlaceholder}
            value={titulo}
            invalid={Boolean(erros.title)}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </Field>

        <Field
          htmlFor="pedido-descricao"
          label={t.descriptionLabel}
          hint={t.descriptionHint}
          error={erros.description}
        >
          <Textarea
            id="pedido-descricao"
            rows={6}
            placeholder={t.descriptionPlaceholder}
            value={descricao}
            invalid={Boolean(erros.description)}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </Field>

        <Field htmlFor="pedido-urgencia" label={t.urgencyLabel} hint={t.urgencyHint}>
          <Select
            id="pedido-urgencia"
            name="priority"
            value={urgencia}
            onChange={setUrgencia}
            options={urgencias}
            placeholder={t.urgencyPlaceholder}
          />
        </Field>

        <div className="flex items-center gap-sm rounded-[var(--radius-md)] border border-border-default bg-bg-surface-sunken px-md py-lg text-text-tertiary">
          <Paperclip size={20} strokeWidth={2} aria-hidden className="shrink-0" />
          <p className="font-body text-body text-text-secondary">
            {t.attachments}
          </p>
        </div>
      </div>

      {erros.geral ? <p className="font-body text-body text-feedback-error-fg">{erros.geral}</p> : null}

      <div className="flex flex-col gap-md sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={aEnviar} className="w-full sm:w-auto">
          {aEnviar ? t.submitting : t.submit}
        </Button>
      </div>
    </form>
  );
}
