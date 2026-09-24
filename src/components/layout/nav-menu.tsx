"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "@/i18n/locale-link";
import { ChevronRight, Menu, X } from "lucide-react";
import { BrandLink } from "@/components/layout/brand-link";
import { ButtonLink } from "@/components/ui/button";
import { locales } from "@/i18n/config";
import { cn } from "@/lib/cn";

// Espelha as INSTÂNCIAS de ds/layout/nav (c6d0u) e ds/layout/nav--mobile (jC2h2) nos
// frames de página de "v2 · A vez" (flhgP), e o master ds/layout/nav--mobile-aberto
// (E4kPF), que não tem instâncias. Valores das instâncias (overrides sobre o master):
// - barra com 72 de altura em todas as larguras e sem régua na base (stroke transparente);
// - desktop: links alinhados à direita, colados às acções (gap $space-2xs), cada link com
//   inset $space-sm; activo = $text-primary a $font-weight-body-strong, sem sublinhado
//   (o "Indicador activo" fica desligado em todos os frames); inactivo = $text-secondary;
// - "Área de Cliente" só texto (glifo desligado), antes do CTA, gap $space-md;
// - CTA ds/action/button md com rótulo a $font-weight-label e $letter-spacing-label.
// O corte entre as duas cascas é lg (1024, $bp-wide): o .pen só tem 1280 e 375; abaixo de
// 1024 a fila de links + acções não cabe com a margem de layout.

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

const FOCAVEIS = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Alvo 44 × 44 com contorno hairline $border-default e raio $radius-md ("Alvo 44 · Abrir
// menu" / "Alvo 44 · Fechar menu").
const iconButtonClasses = cn(
  "flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-md)]",
  "border border-border-default text-text-primary",
  "transition-colors hover:bg-bg-surface-hover",
);

// Barra: mesma altura e margem nas duas cascas e no menu aberto, para o toque em "Abrir
// menu" não fazer saltar a marca nem o botão.
const barClasses = "flex h-18 items-center justify-between";
const barInset = "px-[var(--space-layout-margin-narrow)] md:px-[var(--space-layout-margin-mid)] lg:px-[var(--space-layout-margin-wide)]";

const localePrefix = new RegExp(`^/(${locales.join("|")})(?=/|$)`);

/** Caminho sem prefixo de idioma, para marcar o link activo quando a página não o diz. */
function useCaminhoActual(currentPath?: string) {
  const pathname = usePathname();
  if (currentPath !== undefined) return currentPath;
  return pathname ? pathname.replace(localePrefix, "") || "/" : undefined;
}

function isActive(caminho: string | undefined, href: string) {
  if (!caminho) return false;
  return caminho === href || caminho.startsWith(`${href}/`);
}

// Menu mobile como diálogo modal: ao abrir, o foco entra no menu (botão fechar); o Tab
// fica preso dentro dele; Esc ou "Fechar menu" fecham e devolvem o foco ao botão que o
// abriu. O botão de abrir diz o estado (rótulo "Abrir menu"/"Fechar menu" + aria-expanded).

export function NavMenu({ currentPath, strings }: { currentPath?: string; strings: NavStrings }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuId = `menu-${useId()}`;
  const caminho = useCaminhoActual(currentPath);

  function fechar({ devolverFoco = true }: { devolverFoco?: boolean } = {}) {
    setIsOpen(false);
    if (devolverFoco) toggleRef.current?.focus();
  }

  useEffect(() => {
    if (!isOpen) return;
    const menu = menuRef.current;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !menu) return;
      // O véu (botão aria-hidden, tabIndex -1) fica de fora: só rato/toque.
      const focaveis = Array.from(menu.querySelectorAll<HTMLElement>(FOCAVEIS)).filter(
        (elemento) => elemento.tabIndex !== -1,
      );
      if (focaveis.length === 0) return;
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      const activo = document.activeElement;
      if (event.shiftKey && (activo === primeiro || !menu.contains(activo))) {
        event.preventDefault();
        ultimo.focus();
      } else if (!event.shiftKey && (activo === ultimo || !menu.contains(activo))) {
        event.preventDefault();
        primeiro.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // O menu é só da casca mobile: se a janela passar a lg com ele aberto, fecha-o (senão o
  // body ficava sem scroll, com o diálogo escondido por lg:hidden).
  useEffect(() => {
    if (!isOpen) return;
    const largo = window.matchMedia("(min-width: 1024px)");
    const onChange = () => largo.matches && setIsOpen(false);
    largo.addEventListener("change", onChange);
    return () => largo.removeEventListener("change", onChange);
  }, [isOpen]);

  return (
    <header className={cn("sticky top-0 z-40 bg-bg-base", barInset)}>
      <div
        className={cn(
          barClasses,
          "mx-auto max-w-[var(--grid-max-width)] gap-md lg:justify-start lg:gap-2xs",
        )}
      >
        <BrandLink />

        <nav aria-label={strings.main} className="hidden flex-1 self-stretch lg:flex">
          <ul className="flex h-full flex-1 items-center justify-end gap-2xs">
            {strings.links.map((link) => {
              const current = isActive(caminho, link.href);
              return (
                <li key={link.href} className="h-full">
                  <Link
                    href={link.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "flex h-full items-center px-sm",
                      "font-body text-label tracking-[var(--letter-spacing-label)]",
                      "transition-colors",
                      current
                        ? "font-semibold text-text-primary"
                        : "font-medium text-text-secondary hover:text-text-primary",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-md lg:flex">
          <Link
            href={strings.clientAreaHref}
            className={cn(
              "flex h-11 items-center px-sm",
              "font-body text-label font-medium tracking-[var(--letter-spacing-label)]",
              "text-text-secondary transition-colors hover:text-text-primary",
            )}
          >
            {strings.clientArea}
          </Link>
          <ButtonLink href={CTA_HREF} className="tracking-[var(--letter-spacing-label)]">
            {strings.cta}
          </ButtonLink>
        </div>

        <button
          ref={toggleRef}
          type="button"
          aria-label={isOpen ? strings.closeMenu : strings.openMenu}
          aria-expanded={isOpen}
          aria-controls={isOpen ? menuId : undefined}
          onClick={() => (isOpen ? fechar() : setIsOpen(true))}
          className={cn(iconButtonClasses, "lg:hidden")}
        >
          <Menu size={24} strokeWidth={2} aria-hidden />
        </button>
      </div>

      {isOpen ? (
        <div
          ref={menuRef}
          id={menuId}
          role="dialog"
          aria-modal="true"
          aria-label={strings.main}
          className="fixed inset-0 z-50 flex flex-col bg-bg-base lg:hidden"
        >
          <div className={cn(barClasses, "shrink-0 gap-md", barInset)}>
            <BrandLink />
            <button
              ref={closeRef}
              type="button"
              aria-label={strings.closeMenu}
              onClick={() => fechar()}
              className={iconButtonClasses}
            >
              <X size={24} strokeWidth={2} aria-hidden />
            </button>
          </div>

          <nav
            aria-label={strings.main}
            className={cn(
              "flex shrink-0 flex-col gap-2xs overflow-y-auto py-lg",
              "rounded-b-[var(--radius-xl-ds)] border-b border-border-subtle bg-bg-surface-raised",
              barInset,
            )}
          >
            {strings.mobileLinks.map((link) => {
              const current = isActive(caminho, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={current ? "page" : undefined}
                  onClick={() => fechar({ devolverFoco: false })}
                  className={cn(
                    "flex h-14 shrink-0 items-center justify-between gap-sm rounded-[var(--radius-md)] px-md",
                    "font-body text-body-lg leading-[var(--line-height-label)] tracking-[var(--letter-spacing-label)]",
                    "text-text-primary transition-colors",
                    // Activo: fundo e peso (sem barra lateral nem marcador, design-guardrails §4).
                    current
                      ? "bg-bg-surface-selected font-semibold"
                      : "font-medium hover:bg-bg-surface-hover",
                  )}
                >
                  {link.label}
                  <ChevronRight
                    size={20}
                    strokeWidth={2}
                    aria-hidden
                    className={current ? "text-text-primary" : "text-text-tertiary"}
                  />
                </Link>
              );
            })}

            <div className="flex h-4 shrink-0 items-center">
              <span className="h-px w-full bg-border-subtle" />
            </div>

            <ButtonLink
              href={CTA_HREF}
              size="action"
              fullWidth
              className="tracking-[var(--letter-spacing-label)]"
              onClick={() => fechar({ devolverFoco: false })}
            >
              {strings.cta}
            </ButtonLink>
          </nav>

          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => fechar()}
            className="min-h-0 flex-1 bg-bg-overlay-scrim"
          />
        </div>
      ) : null}
    </header>
  );
}
