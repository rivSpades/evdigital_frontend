"use client";

import { useEffect, useState } from "react";
import Link from "@/i18n/locale-link";
import { ChevronRight, CircleUserRound, Menu, X } from "lucide-react";
import { BrandLink } from "@/components/layout/brand-link";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

// Alvo de toque quadrado de $tap-target-min com contorno hairline $border-default,
// tal como o botão de menu do frame ds/layout/nav--mobile.
const iconButtonClasses = cn(
  "flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-md)]",
  "border border-border-default text-text-primary",
  "transition-colors hover:bg-bg-surface-hover",
);

// Espelha ds/layout/nav (c6d0u), ds/layout/nav--mobile (jC2h2) e
// ds/layout/nav--mobile-aberto (E4kPF) do design-system.pen.
// O corte entre as duas cascas é lg (1024, $bp-wide): abaixo disso a fila de links do
// desktop não cabe na margem de layout definida no .pen.

export type NavStrings = {
  main: string;
  links: { label: string; href: string }[];
  mobileLinks: { label: string; href: string }[];
  clientArea: string;
  clientAreaHref: string;
  cta: string;
  openMenu: string;
  closeMenu: string;
};

const CTA_HREF = "/contacto";

export function NavMenu({ currentPath, strings }: { currentPath?: string; strings: NavStrings }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-bg-base px-lg md:px-xl lg:px-2xl">
      <div className="mx-auto flex h-16 max-w-[var(--grid-max-width)] items-center justify-between gap-md lg:h-18 lg:gap-xl">
        <BrandLink />

        <nav aria-label={strings.main} className="hidden self-stretch lg:flex">
          <ul className="flex h-full items-center gap-xl">
            {strings.links.map((link) => {
              const isCurrent = currentPath === link.href;
              return (
                <li key={link.href} className="h-full">
                  <Link
                    href={link.href}
                    aria-current={isCurrent ? "page" : undefined}
                    className={cn(
                      "flex h-full flex-col items-center justify-center gap-xs px-2xs",
                      "font-body text-label font-medium tracking-[var(--letter-spacing-label)]",
                      "transition-colors",
                      isCurrent
                        ? "text-text-primary"
                        : "text-text-secondary hover:text-text-primary",
                    )}
                  >
                    {link.label}
                    {isCurrent ? (
                      <span className="h-0.5 w-full rounded-[var(--radius-pill)] bg-accent-primary" />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-md lg:flex">
          <ButtonLink href={CTA_HREF}>{strings.cta}</ButtonLink>
          <Link
            href={strings.clientAreaHref}
            className="flex h-11 items-center gap-xs px-sm font-body text-label font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            <CircleUserRound size={20} strokeWidth={2} aria-hidden />
            {strings.clientArea}
          </Link>
        </div>

        <button
          type="button"
          aria-label={strings.openMenu}
          aria-expanded={isOpen}
          onClick={() => setIsOpen(true)}
          className={cn(iconButtonClasses, "lg:hidden")}
        >
          <Menu size={24} strokeWidth={2} aria-hidden />
        </button>
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-bg-base lg:hidden">
          <div className="flex h-16 shrink-0 items-center justify-between gap-md px-lg">
            <BrandLink />
            <button
              type="button"
              aria-label={strings.closeMenu}
              onClick={() => setIsOpen(false)}
              className={iconButtonClasses}
            >
              <X size={24} strokeWidth={2} aria-hidden />
            </button>
          </div>

          <nav
            aria-label={strings.main}
            className="flex flex-col gap-2xs rounded-b-[var(--radius-xl-ds)] border-b border-border-subtle bg-bg-surface-raised px-lg py-lg"
          >
            {strings.mobileLinks.map((link) => {
              const isCurrent = currentPath === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isCurrent ? "page" : undefined}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex h-14 items-center justify-between gap-sm rounded-[var(--radius-md)] px-md",
                    "font-body text-body-lg tracking-[var(--letter-spacing-label)]",
                    isCurrent
                      ? "border-l-2 border-border-interactive bg-bg-surface-selected font-semibold text-text-accent"
                      : "font-medium text-text-primary",
                  )}
                >
                  {link.label}
                  <ChevronRight
                    size={20}
                    strokeWidth={2}
                    aria-hidden
                    className={isCurrent ? "text-text-accent" : "text-text-tertiary"}
                  />
                </Link>
              );
            })}

            <div className="flex h-4 items-center">
              <span className="h-px w-full bg-border-subtle" />
            </div>

            <ButtonLink
              href={CTA_HREF}
              size="lg"
              fullWidth
              onClick={() => setIsOpen(false)}
            >
              {strings.cta}
            </ButtonLink>
          </nav>

          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setIsOpen(false)}
            className="flex-1 bg-bg-overlay-scrim"
          />
        </div>
      ) : null}
    </header>
  );
}
