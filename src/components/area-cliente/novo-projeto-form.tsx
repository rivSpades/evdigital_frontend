"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Paperclip } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import { localizePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

// Ecrã dedicado a "Criar novo projeto" — ao contrário de `NovoPedidoForm`, não há
// pergunta de tipo nem seleção de projeto: é sempre sobre um projeto novo.

const URGENCIAS = ["quando_possivel", "esta_semana", "urgente"] as const;

type Erros = Partial<Record<"title" | "description" | "geral", string>>;

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

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
        setErros({
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
      <div className="flex flex-col gap-lg">
        <Field htmlFor="projeto-titulo" label={t.titleLabel} error={erros.title}>
          <Input
            id="projeto-titulo"
            placeholder={t.titlePlaceholder}
            value={titulo}
            invalid={Boolean(erros.title)}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </Field>

        <Field
          htmlFor="projeto-descricao"
          label={t.descriptionLabel}
          hint={t.descriptionHint}
          error={erros.description}
        >
          <Textarea
            id="projeto-descricao"
            rows={6}
            placeholder={t.descriptionPlaceholder}
            value={descricao}
            invalid={Boolean(erros.description)}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </Field>

        <Field htmlFor="projeto-urgencia" label={t.urgencyLabel} hint={t.urgencyHint}>
          <Select
            id="projeto-urgencia"
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
        <ButtonLink
          href="/area-cliente/projetos"
          variant="secondary"
          size="lg"
          className="w-full sm:w-auto"
        >
          {t.cancel}
        </ButtonLink>
      </div>
    </form>
  );
}
