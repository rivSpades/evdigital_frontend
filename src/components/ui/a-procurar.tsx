import { cn } from "@/lib/cn";

// Espelha ds/feedback/a-procurar (GnLA5) do design-system.pen (direcção "A vez"): estado de
// espera em linha (Contacto, passo 2 a carregar). Indicador de 16 (anel $border-width-thick
// $border-default com um arco $text-primary que roda; parado com movimento reduzido) e Texto
// em body $text-secondary, gap $space-sm, padding-top $space-2xs. Anunciado (role status).

export function AProcurar({ children, className }: { children: string; className?: string }) {
  return (
    <p role="status" className={cn("flex items-center gap-sm pt-2xs", className)}>
      <span
        aria-hidden
        className="size-4 shrink-0 animate-spin rounded-[var(--radius-pill)] border-2 border-border-default border-t-text-primary motion-reduce:animate-none"
      />
      <span className="font-body text-body text-text-secondary">{children}</span>
    </p>
  );
}
