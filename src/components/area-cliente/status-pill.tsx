import { cn } from "@/lib/cn";

// Espelha ac/display/status-pill do design-system.pen: ponto colorido + etiqueta,
// dentro de um contorno subtil. A cor do ponto vem de quem usa o componente — os
// significados de cor não são fixos aqui porque servem estados diferentes (projeto,
// pedido) com paletas próprias.

export function StatusPill({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "accent" | "warning" | "neutral";
}) {
  const dotClass = {
    accent: "bg-text-accent",
    warning: "bg-feedback-warning-fg",
    neutral: "bg-text-tertiary",
  }[tone];

  return (
    <span className="inline-flex items-center gap-xs rounded-[var(--badge-radius)] border border-border-default bg-bg-surface-raised px-sm py-2xs">
      <span aria-hidden className={cn("size-2 rounded-full", dotClass)} />
      <span className="font-body text-caption font-medium text-text-primary">{label}</span>
    </span>
  );
}
