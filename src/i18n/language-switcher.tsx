"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { LOCALE_COOKIE, defaultLocale, hasLocale, localeLabels, locales, stripLocale } from "./config";
import { cn } from "@/lib/cn";

/**
 * Seletor de idioma. Guarda a escolha num cookie (vence o Accept-Language na próxima
 * visita) e mantém o utilizador na mesma página traduzida.
 *
 * Espelha o grupo "Idioma" de ds/layout/footer--vez (E2nmWM / EbRBz) do design-system.pen:
 * ds/action/ligacao na variante idioma, gap $space-2xs, cada uma com padding [0, $space-xs]
 * e alvo de 44; rótulo $font-mono caption; o activo em $text-primary, os restantes em
 * $text-secondary (sem verde nem marcador: o estado diz-se com cor de texto e
 * `aria-current`).
 */
export function LanguageSwitcher({ label, className }: { label: string; className?: string }) {
  const { lang } = useParams<{ lang?: string }>();
  const pathname = usePathname();
  const current = hasLocale(lang) ? lang : defaultLocale;
  const rest = stripLocale(pathname);

  return (
    <nav aria-label={label} className={className}>
      <ul className="flex items-center gap-2xs">
        {locales.map((locale) => (
          <li key={locale}>
            <Link
              href={rest === "/" ? `/${locale}` : `/${locale}${rest}`}
              hrefLang={locale}
              lang={locale}
              title={localeLabels[locale].native}
              aria-current={locale === current ? "true" : undefined}
              onClick={() => {
                document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
              }}
              className={cn(
                "flex h-11 min-w-11 items-center justify-center px-xs",
                "font-mono text-caption transition-colors",
                locale === current
                  ? "text-text-primary"
                  : "text-text-secondary hover:text-text-primary",
              )}
            >
              {localeLabels[locale].short}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
