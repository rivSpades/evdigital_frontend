import type { ReactNode, Ref } from "react";
import { cn } from "@/lib/cn";

// Espelha ds/display/etapa-percurso (H0Zme) do design-system.pen: uma etapa do Percurso.
// - Carril (32 de largura, altura da etapa): Linha antes (2x9), Marca horizontal (2px de
//   altura, aponta para o texto) e Linha depois (2, preenche a altura). As etapas empilhadas
//   sem gap formam uma linha-guia contínua. Última etapa: sem Linha depois.
// - Conteúdo (gap $space-xs, padding-bottom $space-3xl; $space-2xl em mobile; 0 na última):
//   Período mono caption $text-tertiary; Função $font-heading $font-weight-heading
//   $font-size-title-sm $letter-spacing-title; Organização body $font-weight-label; História
//   (padding-top $space-xs) body, largura 600 em md+ (fill em mobile).
// - Gap carril/conteúdo $space-lg ($space-sm em mobile, overrides dos frames l81Qkh).
//
// Estados (nota de movimento t395ry). As linhas do carril ficam sempre $border-default: o
// verde é o carril de progresso que corre por cima (components/consultores/percurso.tsx).
// - base (sem JS, sem suporte, reduced motion): marca 12 $border-strong, texto normal.
// - anterior: marca 12 $text-secondary, texto normal.
// - actual: marca 32 $accent-primary; Função sobe para $font-size-title (md+; em mobile fica
//   title-sm, override B3pIDm) e História passa a $text-primary.
// - seguinte: marca 12 $border-default; Organização, Função e História em $text-tertiary.
// Trocas de estado: só cor (e a largura da marca), $motion-duration-fast $motion-easing-out.

export type EstadoEtapa = "base" | "anterior" | "actual" | "seguinte";

const troca =
  "transition-[color,width,background-color] duration-[var(--motion-duration-fast)] ease-[var(--motion-easing-out)] motion-reduce:transition-none";

export function EtapaPercurso({
  periodo,
  funcao,
  organizacao,
  historia,
  estado,
  ultima,
  marcaRef,
  conteudoProps,
}: {
  periodo: string;
  funcao: string;
  organizacao: string;
  historia: string;
  estado: EstadoEtapa;
  ultima: boolean;
  /** Marca: o percurso observa-a para saber que etapa passou a linha de leitura. */
  marcaRef?: Ref<HTMLSpanElement>;
  /** Atributos do Conteúdo (ex. `data-reveal` da entrada ao scroll). */
  conteudoProps?: Record<string, string>;
}): ReactNode {
  const seguinte = estado === "seguinte";
  const actual = estado === "actual";
  return (
    <div className="flex gap-sm md:gap-lg">
      <div aria-hidden className="flex w-8 shrink-0 flex-col items-start">
        <span className="h-[9px] w-[2px] bg-border-default" />
        <span
          ref={marcaRef}
          className={cn(
            "h-[2px]",
            troca,
            actual ? "w-8 bg-accent-primary" : "w-3",
            estado === "base" && "bg-border-strong",
            estado === "anterior" && "bg-text-secondary",
            seguinte && "bg-border-default",
          )}
        />
        {ultima ? null : <span className="w-[2px] flex-1 bg-border-default" />}
      </div>

      <div
        {...conteudoProps}
        className={cn("flex min-w-0 flex-1 flex-col gap-xs", ultima ? "pb-0" : "pb-2xl md:pb-3xl")}
      >
        <p className="font-mono text-caption leading-[var(--line-height-caption)] text-text-tertiary">
          {periodo}
        </p>
        <h3
          className={cn(
            "font-heading leading-[var(--line-height-title)] font-semibold tracking-[var(--letter-spacing-title)]",
            troca,
            actual ? "text-title-sm md:text-title" : "text-title-sm",
            seguinte ? "text-text-tertiary" : "text-text-primary",
          )}
        >
          {funcao}
        </h3>
        <p
          className={cn(
            "font-body text-body leading-[var(--line-height-label)] font-medium",
            troca,
            seguinte ? "text-text-tertiary" : "text-text-secondary",
          )}
        >
          {organizacao}
        </p>
        <p
          className={cn(
            "pt-xs font-body text-body whitespace-pre-line md:max-w-[600px]",
            troca,
            actual ? "text-text-primary" : seguinte ? "text-text-tertiary" : "text-text-secondary",
          )}
        >
          {historia}
        </p>
      </div>
    </div>
  );
}
