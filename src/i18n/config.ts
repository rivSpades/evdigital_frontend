// Idiomas suportados. `pt` é a língua de origem: os dicionários e o conteúdo em `pt`
// definem a forma (tipos) que `en` e `pl` têm de cumprir — falta de uma chave em
// qualquer idioma falha o `tsc`/build em vez de aparecer vazia em produção.

export const locales = ["pt", "en", "pl"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pt";

/** Cookie que guarda a escolha manual feita no seletor de idioma (vence o browser). */
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const localeLabels: Record<Locale, { short: string; native: string }> = {
  pt: { short: "PT", native: "Português" },
  en: { short: "EN", native: "English" },
  pl: { short: "PL", native: "Polski" },
};

/** Valor do atributo `lang` do `<html>` e do `hreflang`. */
export const htmlLang: Record<Locale, string> = {
  pt: "pt-PT",
  en: "en",
  pl: "pl",
};

/** Valor de `og:locale`. */
export const ogLocale: Record<Locale, string> = {
  pt: "pt_PT",
  en: "en_GB",
  pl: "pl_PL",
};

export function hasLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/**
 * Escolhe o idioma a partir do cabeçalho `Accept-Language`, respeitando os pesos (q).
 * "pl-PL,pl;q=0.9,en;q=0.8" -> "pl". Sem correspondência devolve o idioma por defeito.
 */
export function matchLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return defaultLocale;

  const ranked = acceptLanguage
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      const weight = q ? Number.parseFloat(q.slice(2)) : 1;
      return { tag: tag.trim().toLowerCase(), weight: Number.isNaN(weight) ? 0 : weight, index };
    })
    .filter((entry) => entry.tag && entry.weight > 0)
    .sort((a, b) => b.weight - a.weight || a.index - b.index);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (hasLocale(base)) return base;
  }
  return defaultLocale;
}

/** Prefixa um caminho interno ("/servicos") com o idioma ("/en/servicos"). */
export function localizePath(locale: Locale, href: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  return href === "/" ? `/${locale}` : `/${locale}${href}`;
}

/** Remove o prefixo de idioma de um pathname ("/en/blog" -> "/blog"; "/en" -> "/"). */
export function stripLocale(pathname: string): string {
  const [, first, ...rest] = pathname.split("/");
  if (!hasLocale(first)) return pathname || "/";
  return rest.length ? `/${rest.join("/")}` : "/";
}
