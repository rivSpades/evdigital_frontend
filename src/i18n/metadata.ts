import type { Metadata } from "next";
import { htmlLang, locales, ogLocale, localizePath, type Locale } from "./config";

function imagemPartilha(locale: Locale) {
  return {
    url: `/${locale}/opengraph-image`,
    width: 1200,
    height: 630,
    alt: "EvDigital",
  };
}

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
    // O `openGraph` da página substitui o do layout por inteiro, por isso a imagem de
    // partilha (`[lang]/opengraph-image.tsx`) tem de vir daqui.
    openGraph: { locale: ogLocale[locale], images: [imagemPartilha(locale)] },
    twitter: {
      card: "summary_large_image",
      images: [imagemPartilha(locale).url],
    },
  };
}
