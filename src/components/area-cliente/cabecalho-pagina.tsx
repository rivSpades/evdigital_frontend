import type { ReactNode } from "react";
import { BackLink } from "@/components/area-cliente/back-link";
import { cn } from "@/lib/cn";

// Cabeçalhos de página da Área de Cliente autenticada (frames "v2 · A vez" do
// design-system.pen). Título da página sempre em Sora $font-weight-heading com entrelinha
// e espaçamento de headline: $font-size-headline-narrow (31 = --text-title) em mobile e
// $font-size-headline a partir de md.
//
// - `CabecalhoLista` ("Secção · topo da página" de "Os seus projetos"): padding
//   [$space-2xl, 0, $space-xl, 0]; título com a acção (o subtítulo do .pen não tem frase
//   no React e fica de fora). Em mobile
//   empilhados com gap $space-lg; a partir de md em linha, a acção alinhada ao fundo.
// - `PaginaFormulario`: as páginas de formulário (Novo pedido, Novo projeto, Definições),
//   todas com a mesma estrutura (design-guardrails.md §6, pedido do dono 2026-09-24):
//   primeira linha, numa barra FIXA (sticky) por baixo da topbar: «Voltar» alinhado à margem
//   da página (24/32/48) e, AO LADO dele, o título da página (pedido do dono, 2026-09-24:
//   os títulos ficam ao lado do Voltar e fazem parte da navegação de topo, sempre visíveis). Por baixo, uma coluna
//   única centrada horizontalmente com a largura da folha (704; em mobile e tablet a
//   largura toda dentro das margens) com, alinhados à esquerda dentro dela: a introdução
//   quando a há, os separadores quando os há (a $space-xl da introdução) e o conteúdo
//   (folha, zona de perigo). Voltar → coluna: $space-xl; padding inferior $space-4xl.

const tituloClasses =
  "font-heading text-title leading-[var(--line-height-headline)] font-semibold tracking-[var(--letter-spacing-headline)] text-text-primary md:text-headline";

// Título ao lado do «Voltar» (linha de 44px do BackLink): menor que o das listas.
const tituloLinhaClasses =
  "min-w-0 font-heading text-title-sm leading-[var(--line-height-title)] font-semibold tracking-[var(--letter-spacing-title)] text-text-primary md:text-title";

export function CabecalhoLista({
  titulo,
  acao,
  className,
}: {
  titulo: string;
  acao?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "flex flex-col gap-lg pt-2xl pb-xl md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <h1 className={cn("min-w-0 flex-1", tituloClasses)}>{titulo}</h1>
      {acao ? <div className="flex shrink-0">{acao}</div> : null}
    </section>
  );
}

/** Largura da coluna das páginas de formulário (a da folha em desktop). */
export const colunaFormularioClasses = "mx-auto w-full max-w-[680px]";

export function PaginaFormulario({
  voltarHref,
  voltar,
  titulo,
  introducao,
  separadores,
  busy = false,
  children,
}: {
  voltarHref: string;
  voltar: string;
  titulo: string;
  /** Opcional: Novo pedido e Novo projeto não têm introdução. */
  introducao?: string;
  /** Separadores da página (Definições), entre a introdução e o conteúdo. */
  separadores?: ReactNode;
  /** No loading.tsx: a região fica com aria-busy. */
  busy?: boolean;
  children: ReactNode;
}) {
  return (
    <main aria-busy={busy || undefined} className="flex flex-1 flex-col pb-4xl">
      {/* Barra fixa por baixo da topbar (que é sticky e tem 64px + 1px de régua): «Voltar» e o
          título ficam sempre visíveis ao fazer scroll, como parte da navegação de topo
          (pedido do dono, 2026-09-24). Fundo opaco para o conteúdo não passar por baixo. */}
      <div className="sticky top-[65px] z-30 bg-bg-base px-lg md:px-xl lg:px-2xl">
        <div className="flex min-h-14 flex-wrap items-center gap-x-md gap-y-2xs py-2xs md:gap-x-lg">
          <BackLink href={voltarHref} label={voltar} />
          <h1 className={tituloLinhaClasses}>{titulo}</h1>
        </div>
      </div>
      <div className="px-lg md:px-xl lg:px-2xl">
        <div className={cn(colunaFormularioClasses, "flex flex-col gap-xl pt-md md:pt-lg")}>
          {introducao || separadores ? (
            <div className="flex flex-col gap-xl">
              {introducao ? (
                <p className="font-body text-body text-text-secondary md:text-body-lg">{introducao}</p>
              ) : null}
              {separadores}
            </div>
          ) : null}
          {children}
        </div>
      </div>
    </main>
  );
}

export { tituloClasses as tituloPaginaClasses };
