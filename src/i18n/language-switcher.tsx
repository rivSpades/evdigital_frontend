"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { LOCALE_COOKIE, defaultLocale, hasLocale, localeLabels, locales, stripLocale } from "./config";
import { cn } from "@/lib/cn";

/**
 * Seletor de idioma. Guarda a escolha num cookie (vence o Accept-Language na próxima
 * visita) e mantém o utilizador na mesma página traduzida.
 */
export function LanguageSwitcher({ label, className }: { label: string; className?: string }) {
  const { lang } = useParams<{ lang?: string }>();
  const pathname = usePathname();
  const current = hasLocale(lang) ? lang : defaultLocale;
  const rest = stripLocale(pathname);

  return (
    <nav aria-label={label} className={cn("flex items-center gap-2xs", className)}>
      <Globe size={16} strokeWidth={2} aria-hidden className="text-text-tertiary" />
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
                "flex h-11 min-w-9 items-center justify-center rounded-[var(--radius-md)] px-2xs",
                "font-body text-label font-medium transition-colors",
                locale === current
                  ? "text-text-accent"
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
