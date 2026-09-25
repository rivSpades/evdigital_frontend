"use client";

import { useId, useState, type CSSProperties } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/cn";

// Espelha ds/disclosure/accordion-item (mehKD): cabeçalho de $accordion-header-height
// (64 na largura estreita, ver override do frame mobile), inset $accordion-inset-x,
// raio $accordion-radius e divisor inferior $accordion-divider.
//
// Variante "vez" (instâncias da Início, direcção "A vez" do .pen): cabeçalho sem inset
// nem raio, padding [$space-lg, 0], gap $space-md, alinhado ao topo; pergunta em
// $font-heading $font-weight-heading $font-size-body-lg ($font-size-title-sm em lg) com
// entrelinha e espaçamento de title; sinal "+" / "−" em $font-mono $text-tertiary numa
// caixa de $tap-target-min em vez do chevron; resposta com padding-right
// $tap-target-min; divisores $border-default. A régua superior é do contentor.
//
// Variante "vez-ficha" (ficha de serviço, frames "Ecrã · Serviço (ficha)"): a "vez" com o
// override mobile do .pen abaixo de lg: cabeçalho padding [$space-md, 0] e gap $space-sm,
// resposta sem padding-right e com padding-bottom $space-md. Em lg igual à "vez", com a
// resposta à largura da coluna (sem o máximo de 608 da Início).
//
// `revealFrom` (só na Início, dentro de um grupo `Reveal`): cada pergunta entra inteira,
// pela ordem da lista, com o índice de stagger a começar neste número.

export type AccordionItem = {
  question: string;
  answer: string;
};

export function Accordion({
  items,
  defaultOpenIndex = null,
  variant = "default",
  revealFrom,
  className,
}: {
  items: AccordionItem[];
  /** Sem valor, todas as perguntas começam fechadas (pedido do dono, 2026-09-25). */
  defaultOpenIndex?: number | null;
  variant?: "default" | "vez" | "vez-ficha";
  revealFrom?: number;
  className?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);
  const baseId = useId();
  const vez = variant === "vez" || variant === "vez-ficha";
  const ficha = variant === "vez-ficha";

  return (
    <div className={cn("flex flex-col", className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const headerId = `${baseId}-header-${index}`;
        const Chevron = isOpen ? ChevronUp : ChevronDown;
        const reveal = revealFrom !== undefined;

        return (
          <div
            key={item.question}
            data-reveal={reveal ? "" : undefined}
            style={
              reveal ? ({ "--reveal-i": revealFrom + index } as CSSProperties) : undefined
            }
            className={cn(
              "border-b",
              vez ? "border-border-default" : "border-[var(--accordion-divider)]",
            )}
          >
            <h3>
              <button
                type="button"
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className={cn(
                  "flex w-full text-left",
                  vez
                    ? cn(
                        "items-start",
                        ficha ? "gap-sm py-md lg:gap-md lg:py-lg" : "gap-md py-lg",
                        "font-heading text-body-lg leading-[var(--line-height-title)] font-semibold tracking-[var(--letter-spacing-title)] text-text-primary",
                        "lg:text-title-sm",
                      )
                    : cn(
                        "h-16 items-center justify-between gap-sm lg:h-14",
                        "rounded-[var(--accordion-radius)] px-[var(--accordion-inset-x)]",
                        "font-body text-label font-semibold text-text-primary",
                        "transition-colors hover:bg-bg-surface-hover",
                      ),
                )}
              >
                {vez ? (
                  <>
                    <span className="flex-1">{item.question}</span>
                    <span
                      aria-hidden
                      className="flex w-[var(--tap-target-min)] shrink-0 justify-center font-mono text-body leading-[var(--line-height-title)] font-normal text-text-tertiary"
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </>
                ) : (
                  <>
                    {item.question}
                    <Chevron
                      size={22}
                      strokeWidth={2}
                      aria-hidden
                      className={cn(
                        "shrink-0",
                        isOpen ? "text-text-accent" : "text-text-secondary",
                      )}
                    />
                  </>
                )}
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              hidden={!isOpen}
              className={
                ficha
                  ? "pb-md lg:pr-[var(--tap-target-min)] lg:pb-lg"
                  : vez
                    ? "pr-[var(--tap-target-min)] pb-lg"
                    : "px-[var(--accordion-inset-x)] pb-lg"
              }
            >
              <p className={cn("font-body text-body text-text-secondary", vez && !ficha && "lg:max-w-[608px]")}>
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
