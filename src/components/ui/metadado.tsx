import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// Espelha ds/display/metadado (fgWYW) do design-system.pen (direcção "A vez"): um par
// rótulo e valor em linha, gap $space-2xs. Rótulo em caption $text-tertiary; Valor em
// caption $font-weight-label $text-secondary, em $font-mono por defeito (referências) e em
// $font-body com `valorTexto` (override "Tipo", "Projeto" do Detalhe do pedido).
// `Metadados` é o contentor (<dl>): em linha com gap $space-md, padding-top $space-sm.

export function Metadados({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <dl className={cn("flex flex-wrap gap-x-md gap-y-2xs pt-sm", className)}>{children}</dl>
  );
}

export function Metadado({
  rotulo,
  valor,
  valorTexto = false,
}: {
  rotulo: string;
  valor: string;
  valorTexto?: boolean;
}) {
  return (
    <div className="flex min-w-0 items-baseline gap-2xs">
      <dt className="shrink-0 font-body text-caption tracking-[var(--letter-spacing-caption)] text-text-tertiary">
        {rotulo}
      </dt>
      <dd
        className={cn(
          "min-w-0 text-caption font-medium tracking-[var(--letter-spacing-caption)] text-text-secondary",
          valorTexto ? "font-body" : "font-mono",
        )}
      >
        {valor}
      </dd>
    </div>
  );
}
