import { TabSegments } from "@/components/ui/tabs";
import { articleCount } from "@/lib/blog";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

// Frames: "Filtro por nível" (Q7KrN no wide, i4gxD no narrow).
// No wide a fila é rótulo + segmentos à esquerda e contagem à direita; no narrow o
// rótulo e a contagem partilham a primeira linha e os segmentos ocupam a segunda a toda
// a largura. Um só contentor com flex-wrap e `order` resolve as duas leituras sem
// duplicar a contagem no markup.

export type BlogLevelFilter = "todos" | "simples" | "tecnico";

export async function LevelFilter({
  current,
  total,
}: {
  current: BlogLevelFilter;
  total: number;
}) {
  const lang = await getLocale();
  const { blog: t } = await getDictionary(lang);
  const segments: { value: BlogLevelFilter; label: string; href: string }[] = [
    { value: "todos", label: t.filterAll, href: "/blog" },
    { value: "simples", label: t.filterSimple, href: "/blog?nivel=simples" },
    { value: "tecnico", label: t.filterTechnical, href: "/blog?nivel=tecnico" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-sm lg:gap-md">
      <span className="order-1 font-body text-caption font-medium tracking-[var(--letter-spacing-overline)] text-text-tertiary">
        {t.filterOverline}
      </span>

      <p className="order-2 ml-auto font-body text-caption text-text-tertiary lg:order-3">
        {articleCount(lang, t, total)}
      </p>

      <TabSegments
        label={t.filterLabel}
        className="order-3 w-full lg:order-2 lg:w-auto"
        segments={segments.map((segment) => ({
          label: segment.label,
          href: segment.href,
          current: segment.value === current,
        }))}
      />
    </div>
  );
}
