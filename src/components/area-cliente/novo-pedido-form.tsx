"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ErroCampo } from "@/components/ui/erro-campo";
import { Folha } from "@/components/ui/folha";
import { aoMudar, aoSair, primeiroInvalido, useFocoPendente } from "@/components/ui/formulario";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { OpcaoRadio } from "@/components/ui/opcao-radio";
import { Ligacao } from "@/components/ui/ligacao";
import { Select, type SelectOption } from "@/components/ui/select";
import { useHrefAreaCliente } from "@/i18n/area-cliente-host";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Projeto } from "@/lib/area-cliente/types";

// Frames "Novo pedido" do grupo "v2 · A vez" do design-system.pen (VZR5H/kM8iv sem projeto
// fixo, K9Pon/yykY7 com projeto fixo, erros Z6IR0/Q3HSd/J3UjXb, a enviar c3g47, erro do
// servidor n2Tvnh): tudo numa ds/layout/folha (704 em desktop, --mobile a toda a largura),
// em grupos a $space-xl uns dos outros e campos a $space-lg dentro de cada grupo:
// - Com projeto fixo, o contexto ("A criar um pedido para ...") em body $text-secondary.
// - "Que tipo de pedido é?" (label $font-weight-label) e as duas opções (ds/form/radio, gap
//   $space-sm); o erro do tipo (ds/form/erro-campo) por baixo das opções.
// - Projeto, SEMPRE visível logo a seguir ao tipo (os dois tipos deste formulário são sobre
//   um projeto que já existe): com projeto fixo um campo desligado; com projetos na conta a
//   escolha (ds/form/select); sem projetos, o campo desligado com o placeholder e a ligação
//   "Criar novo projeto" por baixo. O pedido pode seguir sem projeto (o backend aceita-o).
//   Antes (bug, 2026-09-24) o campo só existia depois de escolher o tipo E com projetos na
//   conta: numa conta sem projetos nunca aparecia, sem aviso nenhum.
// - Título, Descrição (com a ajuda por cima, 160 de altura) e Urgência (com a ajuda).
// - Aviso dos anexos: ds/feedback/notice info, só com o título em $text-secondary.
// - Erro do servidor: ds/feedback/notice de erro, no fim do conteúdo.
// - Acções: só "Enviar pedido" ("A enviar..." enquanto envia). O Voltar vive no topo da
//   página (design-guardrails.md §6): o "Cancelar" do React não está no .pen e saiu.
// O exemplo do título ("Exemplo: ...") do .pen é o placeholder do React.

// "novo_projeto" tem o seu próprio ecrã (`/area-cliente/projetos/novo`): este formulário
// serve apenas para pedidos sobre um projeto já existente.
const TIPOS = ["ticket", "feature"] as const;

const URGENCIAS = ["quando_possivel", "esta_semana", "urgente"] as const;

type Erros = Partial<Record<"type" | "title" | "description" | "project" | "geral", string>>;

// Micro-interacções (design-guardrails.md §6): tipo, título e descrição validam-se no
// cliente; o erro de cada um aparece ao sair dele (blur; no tipo, ao sair do grupo) ou ao
// submeter, e some quando fica válido. Ao submeter com erros o foco vai para o primeiro
// inválido pela ordem visual (o grupo do tipo foca a primeira opção); num erro do servidor
// sem campo, para o aviso geral. Botão em espera com aria-busy e a mesma largura.
const ORDEM: [string, string][] = [
  ["type", `pedido-tipo-${TIPOS[0]}`],
  ["project", "pedido-projeto"],
  ["title", "pedido-titulo"],
  ["description", "pedido-descricao"],
  ["geral", "pedido-erro"],
];

export function NovoPedidoForm({
  projetos,
  lang,
  t,
  criarProjeto,
  projetoFixo,
}: {
  projetos: Projeto[];
  lang: Locale;
  t: Dictionary["areaCliente"]["novoPedido"]["form"];
  /** Rótulo da ligação para Novo projeto, quando a conta ainda não tem projetos. */
  criarProjeto: string;
  projetoFixo?: Projeto;
}) {
  const urgencias: SelectOption[] = URGENCIAS.map((value) => ({
    value,
    label: t.urgencias[value],
  }));
  const router = useRouter();
  const hrefAreaCliente = useHrefAreaCliente();
  const [tipo, setTipo] = useState<(typeof TIPOS)[number] | "">("");
  const [projeto, setProjeto] = useState(projetoFixo?.id ?? "");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [urgencia, setUrgencia] = useState("quando_possivel");
  const [erros, setErros] = useState<Erros>({});
  const [aEnviar, setAEnviar] = useState(false);
  const focarDepois = useFocoPendente();

  const validarTipo = (valor: string) => (valor ? undefined : t.errType);
  const validarTitulo = (valor: string) => (valor.trim() ? undefined : t.errTitleRequired);
  const validarDescricao = (valor: string) =>
    valor.trim() ? undefined : t.errDescriptionRequired;

  // Erros com o foco no primeiro inválido (ou no aviso geral).
  function mostrarErros(proximos: Erros) {
    setErros(proximos);
    focarDepois(primeiroInvalido(proximos, ORDEM));
  }

  const opcoesProjeto: SelectOption[] = projetos.map((p) => ({ value: p.id, label: p.title }));
  const projetoEscolhivel = !projetoFixo && opcoesProjeto.length > 0;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (aEnviar) return;

    const locais: Erros = {
      type: validarTipo(tipo),
      title: validarTitulo(titulo),
      description: validarDescricao(descricao),
    };
    if (locais.type || locais.title || locais.description) {
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
          type: tipo,
          title: titulo,
          description: descricao,
          priority: urgencia,
          project: projetoFixo?.id ?? projeto,
        }),
      });

      if (resposta.status === 401) {
        router.push(hrefAreaCliente(lang, "/area-cliente/entrar"));
        return;
      }

      if (resposta.status === 400) {
        const dados = await resposta.json();
        const e = dados.errors ?? {};
        // As mensagens de validação do backend vêm em português: só as usamos em pt. Em
        // en/pl, a chave do campo (`fallback`).
        const doBackend = (mensagem: string | undefined, fallback: string) =>
          mensagem ? (lang === "pt" ? mensagem : fallback) : undefined;
        const doServidor: Erros = {
          type: e.type?.[0] ? t.errType : undefined,
          // Vazio: a frase do campo; outro erro (ex. comprimento): a genérica.
          title: doBackend(e.title?.[0], titulo.trim() ? t.errGeneral : t.errTitleRequired),
          description: doBackend(
            e.description?.[0],
            descricao.trim() ? t.errGeneral : t.errDescriptionRequired,
          ),
          // Sempre a frase do dicionário: o DRF responde a um projeto que já não existe com
          // uma frase técnica ("Pk inválido ... objeto não existe.").
          project: e.project?.[0] ? t.errProjectInvalid : undefined,
          // Urgência e non_field_errors não têm erro por campo: chegam em `geral`.
          geral: e.geral ? t.errGeneral : undefined,
        };
        // Com o campo do projeto desligado (projeto fixo ou conta sem projetos) o erro não
        // tem onde ser corrigido nem recebe foco: vai para o aviso geral.
        if (doServidor.project && !projetoEscolhivel) {
          doServidor.geral = doServidor.project;
          doServidor.project = undefined;
        }
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
      router.push(hrefAreaCliente(lang, `/area-cliente/pedidos/${criado.id}`));
      // As páginas visitadas ficam em cache no cliente (`staleTimes.dynamic`, next.config):
      // sem isto, voltar às listas nos segundos seguintes mostrava-as sem o pedido novo.
      router.refresh();
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
        {projetoFixo ? (
          <p className="font-body text-body text-text-secondary">
            {t.forProjectContext.replace("{projeto}", projetoFixo.title)}
          </p>
        ) : null}

        <div className="flex flex-col gap-lg">
          {/* role="radiogroup" (permitido num fieldset) para o grupo poder dizer
              aria-invalid; o nome continua a ser a legenda. Ao sair do grupo (foco fora
              dele) mostra-se o erro, como no blur de um campo. */}
          <fieldset
            role="radiogroup"
            aria-labelledby="pedido-tipo-legenda"
            aria-invalid={erros.type ? true : undefined}
            aria-describedby={erros.type ? "pedido-tipo-erro" : undefined}
            onBlur={(event) => {
              if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
              aoSair(setErros, "type", validarTipo(tipo));
            }}
            className="flex flex-col gap-sm"
          >
            <legend id="pedido-tipo-legenda" className="pb-sm font-body text-label font-medium tracking-[var(--letter-spacing-label)] text-text-primary">
              {t.typeQuestion}
            </legend>
            <div className="flex flex-col gap-sm">
              {TIPOS.map((valor) => (
                <OpcaoRadio
                  key={valor}
                  id={`pedido-tipo-${valor}`}
                  name="type"
                  value={valor}
                  checked={tipo === valor}
                  onChange={(v) => {
                    setTipo(v as (typeof TIPOS)[number]);
                    aoMudar(setErros, "type", undefined);
                  }}
                  label={t.tipos[valor].titulo}
                  description={t.tipos[valor].descricao}
                  describedBy={erros.type ? "pedido-tipo-erro" : undefined}
                />
              ))}
            </div>
            {erros.type ? <ErroCampo id="pedido-tipo-erro">{erros.type}</ErroCampo> : null}
          </fieldset>

          <Field htmlFor="pedido-projeto" label={t.projectLabel} error={erros.project} variant="folha">
            {projetoFixo ? (
              <Input id="pedido-projeto" value={projetoFixo.title} disabled readOnly />
            ) : opcoesProjeto.length > 0 ? (
              <Select
                id="pedido-projeto"
                name="project"
                value={projeto}
                onChange={(valor) => {
                  setProjeto(valor);
                  aoMudar(setErros, "project", undefined);
                }}
                options={opcoesProjeto}
                placeholder={t.projectPlaceholder}
                appearance="folha"
              />
            ) : (
              <Input id="pedido-projeto" value="" placeholder={t.projectPlaceholder} disabled readOnly />
            )}
          </Field>
          {!projetoFixo && opcoesProjeto.length === 0 ? (
            <Ligacao href="/area-cliente/projetos/novo" variant="acao" className="-mt-sm">
              {criarProjeto}
            </Ligacao>
          ) : null}
        </div>

        <div className="flex flex-col gap-lg">
          <Field htmlFor="pedido-titulo" label={t.titleLabel} error={erros.title} variant="folha">
            <Input
              id="pedido-titulo"
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
            htmlFor="pedido-descricao"
            label={t.descriptionLabel}
            hint={t.descriptionHint}
            error={erros.description}
            variant="folha"
          >
            <Textarea
              id="pedido-descricao"
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

          <Field htmlFor="pedido-urgencia" label={t.urgencyLabel} hint={t.urgencyHint} variant="folha">
            <Select
              id="pedido-urgencia"
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
            <Notice id="pedido-erro" focavel tone="error" role="alert" title={erros.geral} />
          ) : null}
        </div>
      </Folha>
    </form>
  );
}
