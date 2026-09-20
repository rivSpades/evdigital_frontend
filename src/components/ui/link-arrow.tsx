import Link from "@/i18n/locale-link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

// Espelha o padrão "Alvo 44 · Ligação" que se repete na Home do .pen (porta B, cartão de
// projeto, teaser do blog): altura $tap-target-min, gap $space-2xs, cor $text-link e seta
// de 18px. O estado de hover não está desenhado no .pen; segue o hover da variante
// terciária do botão ($text-accent) para não inventar uma cor nova.

export function LinkArrow({
  href,
  children,
  external = false,
  className,
}: {
  href: string;
  children: string;
  external?: boolean;
  className?: string;
}) {
  const classes = cn(
    "inline-flex min-h-11 items-center gap-2xs self-start",
    "font-body text-body font-medium text-text-link transition-colors hover:text-text-accent",
    className,
  );
  const content = (
    <>
      {children}
      {external ? (
        <ArrowUpRight size={18} strokeWidth={2} aria-hidden />
      ) : (
        <ArrowRight size={18} strokeWidth={2} aria-hidden />
      )}
    </>
  );

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
