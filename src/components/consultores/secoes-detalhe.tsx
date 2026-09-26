import type { ReactNode } from "react";
import { LinhaDetalhe } from "@/components/ui/linha-detalhe";
import { LinhaTermo } from "@/components/ui/linha-termo";
import { cn } from "@/lib/cn";

// Secções de texto do detalhe do consultor (Server Components), migradas de «Consultores ·
// detalhe» do design-system.pen: K5am3W/P1Q4VK (desktop 1280), x88y6j (tablet 768) e l81Qkh
// (mobile 375). Ordem na página: Hero, Apresentação, Competências, Percurso, Idiomas e
// Habilitações, fecho. Regras comuns (campo `context` dos frames):
// - Cada secção abre com régua $border-default em cima; padding [$space-3xl, 0, $space-4xl, 0]
//   em md+ e [$space-2xl, 0, $space-3xl, 0] em mobile (o mesmo do Percurso).
// - Título empilhado por cima do conteúdo (sem split-header, sem eyebrow, sem numeração):
//   $font-heading $font-weight-heading $font-size-headline ($font-size-headline-narrow em
//   mobile), $line-height-headline, $letter-spacing-headline, $text-primary.
// - Sem cartões nem chips: listas de registo com régua em cima (a lista) e em baixo (cada linha).
// Uma secção sem dados não se desenha.

const SECCAO = "border-t border-border-default pt-2xl pb-3xl md:pt-3xl md:pb-4xl";

function TituloSeccao({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="font-heading text-[length:var(--font-size-headline-narrow)] leading-[var(--line-height-headline)] font-semibold tracking-[var(--letter-spacing-headline)] text-text-primary md:text-headline"
    >
      {children}
    </h2>
  );
}

// Secção · apresentação (NSclt desktop, BRPBt tablet, w0ws7 mobile). Em lg, uma coluna vazia
// de 278 (a do retrato, gap $space-lg) e a prosa na coluna do texto do hero; em tablet o texto
// encosta à margem. Coluna: gap $space-lg ($space-md em mobile). Parágrafos $font-body
// body-lg $text-secondary com 680 de largura máxima (body e largura total em mobile).
export function Apresentacao({ titulo, paragrafos }: { titulo: string; paragrafos: string[] }) {
  if (paragrafos.length === 0) return null;
  return (
    <section aria-labelledby="apresentacao-titulo" className={SECCAO}>
      <div className="lg:grid lg:grid-cols-[278px_minmax(0,1fr)] lg:gap-x-lg">
        <div className="flex flex-col gap-md md:gap-lg lg:col-start-2">
          <TituloSeccao id="apresentacao-titulo">{titulo}</TituloSeccao>
          {paragrafos.map((paragrafo, indice) => (
            <p
              key={indice}
              className="font-body text-body text-text-secondary md:max-w-[680px] md:text-body-lg"
            >
              {paragrafo}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

// Secção · competências (fS6QZ desktop, e7iCjq tablet, szjje mobile): título + lista de
// ds/display/linha-termo (EyBiB) com a área na coluna do retrato (278 em lg, 200 em tablet) e
// os itens à direita; empilhada em mobile. Gap título/lista $space-xl ($space-lg em mobile).
// Entradas sem «Área:» ficam com os itens no lugar do termo (texto principal da linha).
export function Competencias({
  titulo,
  grupos,
}: {
  titulo: string;
  grupos: { area?: string; itens: string }[];
}) {
  if (grupos.length === 0) return null;
  return (
    <section aria-labelledby="competencias-titulo" className={cn(SECCAO, "flex flex-col gap-lg md:gap-xl")}>
      <TituloSeccao id="competencias-titulo">{titulo}</TituloSeccao>
      <ul className="flex flex-col border-t border-border-default">
        {grupos.map((grupo, indice) => (
          <LinhaTermo
            key={`${grupo.area ?? ""}-${indice}`}
            termo={grupo.area ?? grupo.itens}
            texto={grupo.area ? grupo.itens : ""}
            colunaFixa
          />
        ))}
      </ul>
    </section>
  );
}

type Item = { label: string; value: string };

function ColunaDetalhe({
  id,
  titulo,
  itens,
  empilhada,
  className,
}: {
  id: string;
  titulo: string;
  itens: Item[];
  empilhada: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-lg md:gap-xl", className)}>
      <TituloSeccao id={id}>{titulo}</TituloSeccao>
      <dl className="flex flex-col border-t border-border-default">
        {itens.map((item, indice) => (
          <LinhaDetalhe
            key={`${item.label}-${indice}`}
            termo={item.label}
            valor={item.value || undefined}
            empilhada={empilhada}
          />
        ))}
      </dl>
    </div>
  );
}

// Secção · idiomas e habilitações (mOu9k desktop, pVlac tablet, SCHqf mobile): uma só secção
// com 2 colunas da grelha, Idiomas na coluna do retrato (278 em lg, 200 em tablet) e
// Habilitações no resto (gap $space-lg); em mobile empilhadas (gap $space-2xl). Cada coluna:
// título + lista de ds/display/linha-detalhe (iadD3), gap $space-xl ($space-lg em mobile).
// Idiomas em linha (língua | nível); Habilitações empilhadas (curso por cima, instituição e
// anos por baixo; sem valor, como «Carta de condução», só o rótulo).
export function IdiomasHabilitacoes({
  tituloIdiomas,
  tituloHabilitacoes,
  idiomas,
  habilitacoes,
}: {
  tituloIdiomas: string;
  tituloHabilitacoes: string;
  idiomas: Item[];
  habilitacoes: Item[];
}) {
  if (idiomas.length === 0 && habilitacoes.length === 0) return null;
  const duas = idiomas.length > 0 && habilitacoes.length > 0;
  return (
    <section
      className={cn(
        SECCAO,
        "flex flex-col gap-2xl",
        duas &&
          "md:grid md:grid-cols-[200px_minmax(0,1fr)] md:items-start md:gap-x-lg md:gap-y-0 lg:grid-cols-[278px_minmax(0,1fr)]",
      )}
    >
      {idiomas.length > 0 ? (
        <ColunaDetalhe
          id="idiomas-titulo"
          titulo={tituloIdiomas}
          itens={idiomas}
          empilhada={false}
          className={duas ? undefined : "md:max-w-[420px]"}
        />
      ) : null}
      {habilitacoes.length > 0 ? (
        <ColunaDetalhe
          id="habilitacoes-titulo"
          titulo={tituloHabilitacoes}
          itens={habilitacoes}
          empilhada
        />
      ) : null}
    </section>
  );
}
