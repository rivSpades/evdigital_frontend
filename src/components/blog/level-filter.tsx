import Link from "@/i18n/locale-link";
import { articleCount } from "@/lib/blog";
import { cn } from "@/lib/cn";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

// Frames "v2 · A vez" / Ecrã · Blog: "Margem · filtro por nível" (Ky0bn desktop, sqVy8
// mobile; KigTl / G7B2i no filtro sem resultados). Gap $space-2xs.
// - Cabeçalho: rótulo caption $text-tertiary à esquerda e contagem $font-mono caption
//   $text-tertiary à direita.
// - Níveis: instâncias de ds/action/ligacao (alvo de 44, sem fundo, sem pill). A activa em
//   $text-primary $font-weight-body-strong com aria-current; as outras em $text-secondary
//   $font-weight-label. Em lg empilhadas na Margem (colunas 1 a 3); abaixo lado a lado
//   com gap $space-md.
// O estado vive no URL (?nivel=), por isso é um Server Component.

export type BlogLevelFilter = "todos" | "simples" | "tecnico";

export async function LevelFilter({
  current,
  total,
  className,
}: {
  current: BlogLevelFilter;
  total: number;
  className?: string;
}) {
  const lang = await getLocale();
  const { blog: t } = await getDictionary(lang);
  const segments: { value: BlogLevelFilter; label: string; href: string }[] = [
    { value: "todos", label: t.filterAll, href: "/blog" },
    { value: "simples", label: t.filterSimple, href: "/blog?nivel=simples" },
    { value: "tecnico", label: t.filterTechnical, href: "/blog?nivel=tecnico" },
  ];

  return (
    <div className={cn("flex flex-col gap-2xs", className)}>
      <div className="flex items-center justify-between gap-sm">
        <p className="font-body text-caption text-text-tertiary">{t.filterOverline}</p>
        <p className="font-mono text-caption text-text-tertiary">
          {articleCount(lang, t, total)}
        </p>
      </div>

      <nav aria-label={t.filterLabel}>
        <ul className="flex gap-md lg:flex-col lg:gap-0">
          {segments.map((segment) => {
            const atual = segment.value === current;
            return (
              <li key={segment.value}>
                <Link
                  href={segment.href}
                  aria-current={atual ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center font-body text-label tracking-[var(--letter-spacing-label)] transition-colors",
                    atual
                      ? "font-semibold text-text-primary"
                      : "font-medium text-text-secondary hover:text-text-primary",
                  )}
                >
                  {segment.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
