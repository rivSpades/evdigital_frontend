import type { Metadata } from "next";
import { htmlLang, locales, ogLocale, localizePath, type Locale } from "./config";

/**
 * `alternates` (canonical + hreflang) e `openGraph.locale` de uma página.
 * `path` é o caminho sem idioma ("/servicos/loja-online"; "/" para a home).
 * Junta-se ao resto do `Metadata` da página: `{ title, description, ...pageMetadata(lang, "/x") }`.
 */
export function pageMetadata(locale: Locale, path: string): Metadata {
  return {
    alternates: {
      canonical: localizePath(locale, path),
      languages: {
        ...Object.fromEntries(locales.map((l) => [htmlLang[l], localizePath(l, path)])),
        "x-default": localizePath("pt", path),
      },
    },
    openGraph: { locale: ogLocale[locale] },
  };
}
