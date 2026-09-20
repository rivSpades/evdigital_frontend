import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// Espelha ds/display/badge (uTH05): gap $badge-gap, inset [$badge-inset-y, $badge-inset-x],
// raio $badge-radius, contorno hairline. O ícone é opcional (as instâncias de stack do
// .pen desligam-no).
//
// Tons e tamanhos correspondem às instâncias reais no .pen:
// - neutral + sm  → etiquetas de nível do blog ($font-size-caption, ícone 14)
// - outline + sm  → tags do artigo ($color-transparent, sem ícone)

export type BadgeTone = "success" | "accent" | "neutral" | "outline";
export type BadgeSize = "sm" | "md";

const toneClasses: Record<BadgeTone, string> = {
  success: "border-feedback-success-border bg-feedback-success-bg text-feedback-success-fg",
  accent: "border-border-interactive bg-accent-primary-subtle text-text-accent",
  neutral: "border-border-default bg-bg-surface-raised text-text-secondary",
  outline: "border-border-default bg-transparent text-text-secondary",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "text-caption",
  md: "text-label",
};

export function Badge({
  tone = "success",
  size = "md",
  icon,
  children,
  className,
}: {
  tone?: BadgeTone;
  size?: BadgeSize;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-xs rounded-[var(--badge-radius)] border",
        "px-[var(--badge-inset-x)] py-[var(--badge-inset-y)]",
        "font-body font-medium",
        sizeClasses[size],
        toneClasses[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
