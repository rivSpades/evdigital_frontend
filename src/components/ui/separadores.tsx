"use client";

import { useRef } from "react";
import Link from "@/i18n/locale-link";
import { separadorId, separadorPainelId } from "@/components/ui/separadores-ids";
import { cn } from "@/lib/cn";

// Espelha ds/navigation/separadores (b6ChC) e ds/navigation/separador (z8F3y) do
// design-system.pen (direcção "A vez"; em código substitui o TabSegments nas Definições).
// Calha $bg-surface-sunken com contorno hairline $border-subtle, padding e gap $space-2xs.
// Raio (Shape Consistency Lock, design-guardrails.md §2): cada separador usa o raio dos
// botões (--button-radius), não pílula, para ficar igual aos campos e botões ao lado; a
// calha é concêntrica (raio do botão + o padding de $space-2xs). Separador escolhido: $bg-surface-raised, contorno hairline
// $border-strong, rótulo $text-primary em $font-weight-body-strong. Não escolhido: sem
// fundo nem contorno, rótulo $text-secondary em $font-weight-label. Nunca verde. Alvo 44.
//
// O estado vive no URL (cada separador é uma ligação), mas a semântica é de separadores:
// role="tablist"/"tab" com aria-selected e aria-controls para o painel, tabindex móvel e
// setas esquerda/direita (e Home/End) para mudar o foco entre separadores; Enter segue a
// ligação. O painel usa `separadorPainelId(id)` como id e `separadorId(id, valor)` em
// aria-labelledby.

export type Separador = { value: string; label: string; href: string };

const calhaClasses =
  "flex items-center gap-2xs rounded-[calc(var(--button-radius)+var(--spacing-2xs))] border border-border-subtle bg-bg-surface-sunken p-2xs";

function separadorClasses(escolhido: boolean) {
  return cn(
    "flex h-11 items-center justify-center rounded-[var(--button-radius)] border px-lg",
    "font-body text-label transition-colors",
    escolhido
      ? "border-border-strong bg-bg-surface-raised font-semibold text-text-primary"
      : "border-transparent font-medium text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary",
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
      className={cn(calhaClasses, "w-fit", className)}
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
