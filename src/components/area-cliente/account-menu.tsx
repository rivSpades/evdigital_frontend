"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, LogOut, Settings } from "lucide-react";
import Link from "@/i18n/locale-link";
import { localizePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import type { MeInfo } from "@/lib/area-cliente/session";

// Painel e itens seguem exactamente os swatches ds/overlay/dropdown-menu--* do
// design-system.pen (mesma especificação que components/ui/select.tsx já usa): painel
// $bg-surface-raised, $radius-md, contorno $border-subtle e fio de luz interior a
// $border-highlight; itens a 44px ($tap-target-min), $radius-sm, hover a
// $bg-surface-hover. Não é um novo padrão de overlay — reutiliza o já desenhado.

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

export function AccountMenu({
  me,
  lang,
  t,
}: {
  me: MeInfo;
  lang: Locale;
  t: Dictionary["areaCliente"];
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [aSair, setASair] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  async function sair() {
    setASair(true);
    try {
      await fetch("/api/area-cliente/sair", { method: "POST" });
    } finally {
      router.push(localizePath(lang, "/area-cliente/entrar"));
      router.refresh();
    }
  }

  const itemClasses = cn(
    "flex h-11 shrink-0 items-center gap-sm rounded-[var(--radius-sm)] px-sm",
    "font-body text-body text-text-primary transition-colors",
    "hover:bg-bg-surface-hover disabled:cursor-not-allowed disabled:opacity-60",
  );

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((valor) => !valor)}
        className="flex items-center gap-sm rounded-[var(--radius-sm)] transition-colors hover:bg-bg-surface-hover"
      >
        <span className="hidden font-body text-caption text-text-secondary sm:inline">
          {me.name || me.email}
        </span>
        <span className="flex size-8 items-center justify-center rounded-[var(--radius-pill)] border border-border-default bg-bg-surface-raised">
          <span className="font-body text-caption font-medium text-text-secondary">
            {iniciais(me.name || me.email)}
          </span>
        </span>
        {isOpen ? (
          <ChevronUp size={16} strokeWidth={2} aria-hidden className="text-text-tertiary" />
        ) : (
          <ChevronDown size={16} strokeWidth={2} aria-hidden className="text-text-tertiary" />
        )}
      </button>

      {isOpen ? (
        <div
          role="menu"
          aria-label={me.name || me.email}
          className={cn(
            "absolute top-[calc(100%+var(--spacing-xs))] right-0 z-50 w-56",
            "flex flex-col gap-3xs p-2xs",
            "rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface-raised",
            "shadow-[inset_0_1px_0_0_var(--color-border-highlight),var(--shadow-elevation-3)]",
          )}
        >
          <Link
            href="/area-cliente/definicoes"
            role="menuitem"
            onClick={() => setIsOpen(false)}
            className={itemClasses}
          >
            <Settings size={20} strokeWidth={2} aria-hidden className="shrink-0 text-text-tertiary" />
            {t.topbar.definicoes}
          </Link>

          <span aria-hidden className="my-3xs h-px bg-border-subtle" />

          <button type="button" role="menuitem" onClick={sair} disabled={aSair} className={itemClasses}>
            <LogOut size={20} strokeWidth={2} aria-hidden className="shrink-0 text-text-tertiary" />
            {t.logout}
          </button>
        </div>
      ) : null}
    </div>
  );
}
