"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { ComponentProps } from "react";
import { hasLocale, localizePath, defaultLocale } from "./config";

/**
 * Substituto directo de `next/link` para caminhos internos: prefixa o idioma actual
 * (`/servicos` -> `/en/servicos`). Serve em Server e Client Components porque lê o
 * idioma do segmento `[lang]` no cliente. Links externos e âncoras passam intactos.
 */
export default function LocaleLink({ href, ...props }: ComponentProps<typeof Link>) {
  const { lang } = useParams<{ lang?: string }>();
  const locale = hasLocale(lang) ? lang : defaultLocale;
  const resolved = typeof href === "string" ? localizePath(locale, href) : href;
  return <Link href={resolved} {...props} />;
}
