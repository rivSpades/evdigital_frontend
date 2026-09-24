import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// Espelha ds/layout/folha (i0lScq) e ds/layout/folha--mobile (tbpmM) do design-system.pen
// (direcção "A vez"): onde se escreve, um formulário e mais nada. Preenchida e neutra:
// $bg-surface, contorno hairline $border-subtle a toda a volta, $radius-none, nunca verde.
// Padding [$space-lg, $space-md] abaixo de md (folha--mobile) e $space-xl a partir de md.
//
// Slots: Conteúdo (gap $space-lg) e Acções no fundo (padding-top $space-xs, gap $space-sm)
// só com a acção que avança. Nunca "Voltar" dentro da folha (design-guardrails.md §6).
// Em mobile as Acções são sticky (coladas ao fundo do ecrã enquanto a folha está à vista).
//
// A largura vem do contentor (448 nos ecrãs de autenticação, 704 na coluna das páginas de
// formulário da Área de Cliente: Novo pedido, Novo projeto, Definições).

export function Folha({
  children,
  actions,
  contentGap = "lg",
  className,
}: {
  children: ReactNode;
  actions?: ReactNode;
  /**
   * Gap do Conteúdo: $space-lg (o master) ou $space-xl, mais folgado, nos formulários de
   * Entrar e Criar conta e entre grupos de campos em Novo pedido / Novo projeto (pedido do
   * dono, 2026-09-24).
   */
  contentGap?: "lg" | "xl";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-lg rounded-[var(--radius-none)] border border-border-subtle bg-bg-surface",
        "px-md py-lg md:p-xl",
        className,
      )}
    >
      <div className={cn("flex flex-col", contentGap === "xl" ? "gap-xl" : "gap-lg")}>
        {children}
      </div>
      {actions ? (
        <div
          className={cn(
            "flex flex-col gap-sm pt-xs",
            // Mobile (< md): as acções ficam coladas ao fundo do ecrã enquanto a folha está à
            // vista (pedido do dono, 2026-09-24), com fundo opaco e régua horizontal em cima,
            // esticadas até às bordas da folha e com a área segura do iOS por baixo.
            "max-md:sticky max-md:bottom-0 max-md:z-20 max-md:-mx-md max-md:-mb-lg max-md:border-t max-md:border-border-subtle max-md:bg-bg-surface max-md:px-md max-md:pt-md max-md:pb-[calc(var(--spacing-lg)+env(safe-area-inset-bottom))]",
          )}
        >
          {actions}
        </div>
      ) : null}
    </div>
  );
}
