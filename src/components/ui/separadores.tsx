"use client";

import { useRef } from "react";
import Link from "@/i18n/locale-link";
import { separadorId, separadorPainelId } from "@/components/ui/separadores-ids";
import { cn } from "@/lib/cn";

// Espelha ds/navigation/separadores (b6ChC) e ds/navigation/separador (z8F3y) do
// design-system.pen (direcção «B · Registo em linhas»; em código substitui o TabSegments nas
// Definições). Sem caixa: trilho de 1px $border-subtle em baixo, cada separador com 44 de
// altura. Escolhido: $text-primary em $font-weight-body-strong com um indicador de
// $border-width-thick $accent-primary na base (inset, para não crescer). Não escolhido:
// $text-secondary em $font-weight-label. O verde é só o indicador. Alvo 44.
//
// O estado vive no URL (cada separador é uma ligação), mas a semântica é de separadores:
// role="tablist"/"tab" com aria-selected e aria-controls para o painel, tabindex móvel e
// setas esquerda/direita (e Home/End) para mudar o foco entre separadores; Enter segue a
// ligação. O painel usa `separadorPainelId(id)` como id e `separadorId(id, valor)` em
// aria-labelledby.

export type Separador = { value: string; label: string; href: string };

const calhaClasses = "flex items-stretch border-b border-border-subtle";

function separadorClasses(escolhido: boolean) {
  return cn(
    "flex h-11 items-center justify-center px-lg",
    "font-body text-label transition-colors",
    escolhido
      ? "font-semibold text-text-primary shadow-[inset_0_calc(-1*var(--border-width-thick))_0_var(--color-accent-primary)]"
      : "font-medium text-text-secondary hover:text-text-primary",
  );
}

export function Separadores({
  id,
  label,
  items,
  current,
  className,
}: {
  id: string;
  label: string;
  items: Separador[];
  current: string;
  className?: string;
}) {
  const refs = useRef<(HTMLAnchorElement | null)[]>([]);

  function onKeyDown(event: React.KeyboardEvent<HTMLAnchorElement>, index: number) {
    const ultimo = items.length - 1;
    let proximo: number | null = null;
    if (event.key === "ArrowRight") proximo = index === ultimo ? 0 : index + 1;
    if (event.key === "ArrowLeft") proximo = index === 0 ? ultimo : index - 1;
    if (event.key === "Home") proximo = 0;
    if (event.key === "End") proximo = ultimo;
    if (proximo === null) return;
    event.preventDefault();
    refs.current[proximo]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn(calhaClasses, "w-full", className)}
    >
      {items.map((item, index) => {
        const escolhido = item.value === current;
        return (
          <Link
            key={item.value}
            ref={(node) => {
              refs.current[index] = node;
            }}
            id={separadorId(id, item.value)}
            href={item.href}
            role="tab"
            aria-selected={escolhido}
            aria-controls={separadorPainelId(id)}
            tabIndex={escolhido ? 0 : -1}
            scroll={false}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={separadorClasses(escolhido)}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

/**
 * Variante de navegação entre PÁGINAS (ex. "Entrar | Criar conta" na Área de Cliente):
 * o mesmo visual, mas cada item é uma ligação para outra rota e não troca um painel no
 * mesmo ecrã, por isso a semântica é <nav aria-label> com ligações e `aria-current="page"`
 * na actual (sem role="tab", sem setas: Tab percorre as ligações). Ocupa a largura do
 * contentor e cada ligação fica com a mesma fracção (metade, com duas), para que as
 * posições não mudem de uma página para a outra.
 */
export function SeparadoresPaginas({
  label,
  items,
  current,
  className,
}: {
  label: string;
  items: Separador[];
  current: string;
  className?: string;
}) {
  return (
    <nav aria-label={label} className={cn(calhaClasses, "w-full", className)}>
      {items.map((item) => {
        const escolhido = item.value === current;
        return (
          <Link
            key={item.value}
            href={item.href}
            aria-current={escolhido ? "page" : undefined}
            className={cn(separadorClasses(escolhido), "min-w-0 flex-1 basis-0 px-sm")}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
