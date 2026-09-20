import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// Espelha ds/display/card (e8GF0) e ds/display/card--feature (idyUb): raio $card-radius,
// fundo $card-bg (ou $bg-surface-raised na porta A) e contorno hairline.
//
// O .pen desenha o contorno como gradiente vertical de $border-highlight (topo) para
// $card-border. Em CSS isso é uma borda sólida $card-border mais um fio de luz interior
// no topo (inset box-shadow) — nunca um halo exterior, ver design-guardrails.md §1.

export function Card({
  surface = "default",
  highlight = false,
  className,
  children,
}: {
  surface?: "default" | "raised";
  highlight?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--card-radius)] border",
        surface === "raised" ? "bg-bg-surface-raised" : "bg-bg-surface",
        highlight
          ? "border-[var(--card-border)] shadow-[inset_0_1px_0_0_var(--color-border-highlight)]"
          : "border-border-subtle",
        className,
      )}
    >
      {children}
    </div>
  );
}
