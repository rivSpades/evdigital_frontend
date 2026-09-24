import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// Espelha ds/display/zona-perigo (S2clWU) do design-system.pen (direcção "A vez"): fim do
// separador Segurança. Superfície aberta (sem fundo), contorno hairline $border-default
// nos quatro lados, $radius-none, padding $space-lg, gap $space-md. Título em
// $font-weight-body-strong, descrição $text-secondary e, por baixo, o slot com o botão
// (variante outline-danger) ou o ds/feedback/notice de estado. Nunca barra lateral, nunca
// fundo vermelho.

export function ZonaPerigo({
  title,
  description,
  titleId,
  children,
  className,
}: {
  title: string;
  description: string;
  titleId?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        "flex w-full flex-col gap-md rounded-[var(--radius-none)] border border-border-default p-lg",
        className,
      )}
    >
      <div className="flex flex-col gap-2xs">
        <h2 id={titleId} className="font-body text-body font-semibold text-text-primary">
          {title}
        </h2>
        <p className="font-body text-body text-text-secondary">{description}</p>
      </div>
      {children}
    </section>
  );
}
