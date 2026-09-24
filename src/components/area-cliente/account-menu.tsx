"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Settings } from "lucide-react";
import Link from "@/i18n/locale-link";
import { useHrefAreaCliente } from "@/i18n/area-cliente-host";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import type { MeInfo } from "@/lib/area-cliente/session";

// Conta da barra de topo (ac/layout/topbar, grupo Conta, com os overrides das instâncias
// dos ecrãs v2 "A vez"): gap $space-xs, nome em body $text-primary (só a partir de md; em
// mobile o .pen desliga-o) e avatar de 32 ($radius-pill, $bg-surface-raised, contorno
// hairline $border-default) com as iniciais em $font-mono caption $font-weight-label
// $text-secondary. Alvo de 44.
//
// O painel e os itens seguem os swatches ds/overlay/dropdown-menu--* (mesma especificação
// de components/ui/select.tsx): $bg-surface-raised, $radius-md, contorno $border-subtle e
// fio de luz interior a $border-highlight; itens de 44 ($tap-target-min), $radius-sm,
// hover $bg-surface-hover.
//
// Menu acessível (padrão "menu button"): Enter, espaço ou seta abaixo abrem e põem o foco
// no primeiro item (seta acima: no último); setas, Home e End movem o foco entre itens;
// Esc fecha e devolve o foco ao botão; Tab fecha e segue; clicar fora fecha.

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
  const hrefAreaCliente = useHrefAreaCliente();
  const [isOpen, setIsOpen] = useState(false);
  const [focoInicial, setFocoInicial] = useState<"primeiro" | "ultimo">("primeiro");
  const [aSair, setASair] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const nome = me.name || me.email;

  function itens(): HTMLElement[] {
    return Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])') ?? [],
    );
  }

  useEffect(() => {
    if (!isOpen) return;
    const lista = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])') ?? [],
    );
    (focoInicial === "ultimo" ? lista[lista.length - 1] : lista[0])?.focus();

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [isOpen, focoInicial]);

  function abrir(onde: "primeiro" | "ultimo") {
    setFocoInicial(onde);
    setIsOpen(true);
  }

  function fechar(devolverFoco: boolean) {
    setIsOpen(false);
    if (devolverFoco) triggerRef.current?.focus();
  }

  function onTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      abrir(event.key === "ArrowUp" ? "ultimo" : "primeiro");
    }
  }

  function onMenuKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const lista = itens();
    const atual = lista.indexOf(document.activeElement as HTMLElement);
    let proximo: number | null = null;
    if (event.key === "ArrowDown") proximo = atual < lista.length - 1 ? atual + 1 : 0;
    if (event.key === "ArrowUp") proximo = atual > 0 ? atual - 1 : lista.length - 1;
    if (event.key === "Home") proximo = 0;
    if (event.key === "End") proximo = lista.length - 1;
    if (proximo !== null) {
      event.preventDefault();
      lista[proximo]?.focus();
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      fechar(true);
    } else if (event.key === "Tab") {
      fechar(false);
    }
  }

  async function sair() {
    setASair(true);
    try {
      await fetch("/api/area-cliente/sair", { method: "POST" });
    } finally {
      router.push(hrefAreaCliente(lang, "/area-cliente/entrar"));
      router.refresh();
    }
  }

  const itemClasses = cn(
    "flex h-11 shrink-0 items-center gap-sm rounded-[var(--radius-sm)] px-sm",
    "font-body text-body text-text-primary transition-colors",
    "hover:bg-bg-surface-hover focus-visible:bg-bg-surface-hover",
    "disabled:cursor-not-allowed disabled:opacity-60",
  );

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? "conta-menu" : undefined}
        onClick={() => (isOpen ? fechar(false) : abrir("primeiro"))}
        onKeyDown={onTriggerKeyDown}
        className="flex h-11 min-w-11 items-center justify-center gap-xs rounded-[var(--radius-sm)] md:px-2xs"
      >
        {/* Nome acessível do botão: o nome da conta (visível a partir de md; abaixo disso só
            para leitores de ecrã). As iniciais são decorativas. */}
        <span className="sr-only font-body text-body text-text-primary md:not-sr-only md:max-w-[220px] md:truncate">
          {nome}
        </span>
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-pill)] border border-border-default bg-bg-surface-raised font-mono text-caption font-medium text-text-secondary"
        >
          {iniciais(nome)}
        </span>
      </button>

      {isOpen ? (
        <div
          ref={menuRef}
          id="conta-menu"
          role="menu"
          aria-label={nome}
          onKeyDown={onMenuKeyDown}
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
            tabIndex={-1}
            onClick={() => setIsOpen(false)}
            className={itemClasses}
          >
            <Settings size={20} strokeWidth={2} aria-hidden className="shrink-0 text-text-tertiary" />
            {t.topbar.definicoes}
          </Link>

          <span role="separator" className="my-3xs h-px bg-border-subtle" />

          <button
            type="button"
            role="menuitem"
            tabIndex={-1}
            onClick={sair}
            disabled={aSair}
            className={itemClasses}
          >
            <LogOut size={20} strokeWidth={2} aria-hidden className="shrink-0 text-text-tertiary" />
            {t.logout}
          </button>
        </div>
      ) : null}
    </div>
  );
}
