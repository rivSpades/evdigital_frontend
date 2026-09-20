import Link from "@/i18n/locale-link";
import { cn } from "@/lib/cn";

// Espelha ds/navigation/tab-segment (WIklI) e o contentor
// "ds/navigation/tabs--segmented" das páginas de blog (QTIsq no wide, y6bH8 no narrow):
// carril $bg-surface-sunken com raio $radius-pill, contorno hairline $border-subtle e
// inset $space-2xs; segmento activo a $accent-primary com etiqueta $text-on-accent.
//
// A navegação é feita por ligações (o estado vive no URL), por isso o componente é um
// Server Component: não precisa de estado no cliente.

export type TabSegment = {
  label: string;
  href: string;
  current: boolean;
};

export function TabSegments({
  segments,
  label,
  className,
}: {
  segments: TabSegment[];
  label: string;
  className?: string;
}) {
  return (
    <nav
      aria-label={label}
      className={cn(
        "flex items-center gap-2xs rounded-[var(--radius-pill)]",
        "border border-border-subtle bg-bg-surface-sunken p-2xs",
        className,
      )}
    >
      {segments.map((segment) => (
        <Link
          key={segment.href}
          href={segment.href}
          aria-current={segment.current ? "page" : undefined}
          className={cn(
            "flex h-11 flex-1 items-center justify-center rounded-[var(--radius-pill)] px-md",
            "font-body text-label tracking-[var(--letter-spacing-label)] transition-colors",
            "lg:min-w-[112px] lg:flex-none",
            segment.current
              ? "bg-accent-primary font-semibold text-text-on-accent"
              : "font-medium text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary",
          )}
        >
          {segment.label}
        </Link>
      ))}
    </nav>
  );
}
