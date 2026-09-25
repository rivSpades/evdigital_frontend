"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useFieldContext } from "@/components/ui/input";
import { cn } from "@/lib/cn";

// Espelha os swatches ds/overlay/dropdown-menu--* do frame "Inventário · Lote A" (EoIvi)
// e o "Campo · O que precisa" dos frames Contacto (M9S6m / uhCIg) do design-system.pen.
//
// O gatilho é um campo em linha de base (direcção «B · Registo em linhas», ver `ui/input.tsx`):
// sem fundo nem contorno em cima e nos lados, só a linha de base de 1px $border-strong, altura
// $input-height, raio 0, padding horizontal 0, valor em body $font-weight-body e seta de 20 à
// direita. Aberto ou focado, a linha passa a 2px $border-focus (borda + fio inset, sem anel
// exterior); em erro, $feedback-error-fg.
//
// A lista é $bg-surface-raised com $radius-none e contorno $border-default, itens a direito,
// 44px de altura ($tap-target-min) e o visto em $text-primary (o verde fica para botão, foco e
// ligação). `group` numa opção abre um rótulo de grupo (caption $font-weight-label
// $text-tertiary) antes da primeira opção desse grupo; as opções desse grupo ficam num
// role="group" com esse rótulo em aria-labelledby.

export type SelectOption = { value: string; label: string; group?: string };

export function Select({
  id,
  name,
  value,
  onChange,
  options,
  placeholder,
  invalid: invalidProp,
  describedBy: describedByProp,
  onBlur,
}: {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
  /** Por omissão vem do `Field` à volta (erro presente). */
  invalid?: boolean;
  /** Por omissão vem do `Field` à volta (ids da ajuda e do erro). */
  describedBy?: string;
  /**
   * O foco saiu do campo (para mostrar o erro em blur, design-guardrails.md §6). Escolher
   * uma opção com o rato não conta: a lista não tira o foco ao gatilho.
   */
  onBlur?: () => void;
}) {
  const field = useFieldContext();
  const invalid = invalidProp ?? field.invalid;
  const describedBy = describedByProp ?? field.describedBy;
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const listId = `${id}-opcoes`;
  const optionId = (index: number) => `${id}-opcao-${index}`;
  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [isOpen, activeIndex]);

  function open() {
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setIsOpen(true);
  }

  function choose(index: number) {
    onChange(options[index].value);
    setIsOpen(false);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }
    if (event.key === "Tab") {
      setIsOpen(false);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpen) {
        open();
        return;
      }
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((current) => {
        const next = current + step;
        if (next < 0) return options.length - 1;
        if (next > options.length - 1) return 0;
        return next;
      });
      return;
    }
    if (isOpen && (event.key === "Home" || event.key === "End")) {
      event.preventDefault();
      setActiveIndex(event.key === "Home" ? 0 : options.length - 1);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (isOpen) choose(activeIndex);
      else open();
    }
  }

  // Opções seguidas com o mesmo `group` formam um bloco: sem grupo, as opções ficam direto
  // dentro da listbox; com grupo, num role="group" com o rótulo em aria-labelledby. Nada de
  // wrappers role="presentation" entre a listbox e as opções (escondiam-nas da árvore de
  // acessibilidade).
  const blocos: { group?: string; indices: number[] }[] = [];
  options.forEach((option, index) => {
    const ultimo = blocos[blocos.length - 1];
    if (ultimo && ultimo.group === option.group) ultimo.indices.push(index);
    else blocos.push({ group: option.group, indices: [index] });
  });

  function renderOption(index: number) {
    const option = options[index];
    const isSelected = option.value === value;
    return (
      <div
        key={option.value}
        id={optionId(index)}
        role="option"
        aria-selected={isSelected}
        ref={(node) => {
          optionRefs.current[index] = node;
        }}
        onMouseEnter={() => setActiveIndex(index)}
        onClick={() => choose(index)}
        className={cn(
          "flex h-11 shrink-0 cursor-pointer items-center gap-sm px-sm",
          "rounded-[var(--radius-none)]",
          "font-body text-body text-text-primary",
          isSelected && "bg-bg-surface-selected",
          !isSelected && index === activeIndex && "bg-bg-surface-hover",
        )}
      >
        <span className="flex-1">{option.label}</span>
        {isSelected ? (
          <Check size={20} strokeWidth={2} aria-hidden className="text-text-primary" />
        ) : null}
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={value} />

      <button
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={isOpen ? optionId(activeIndex) : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        onKeyDown={onKeyDown}
        onBlur={(event) => {
          if (rootRef.current?.contains(event.relatedTarget as Node | null)) return;
          onBlur?.();
        }}
        className={cn(
          "flex h-11 w-full items-center justify-between gap-sm",
          "rounded-none border-0 border-b bg-transparent px-0",
          "font-body text-body transition-colors focus-visible:outline-none!",
          isOpen
            ? "border-[var(--input-border-focus)] shadow-[inset_0_-1px_0_var(--input-border-focus)]"
            : "border-border-strong hover:border-border-interactive focus:border-[var(--input-border-focus)] focus:shadow-[inset_0_-1px_0_var(--input-border-focus)]",
          invalid &&
            !isOpen &&
            "border-feedback-error-fg shadow-[inset_0_-1px_0_var(--color-feedback-error-fg)] hover:border-feedback-error-fg",
          selected ? "text-text-primary" : "text-text-tertiary",
        )}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        {isOpen ? (
          <ChevronUp size={20} strokeWidth={2} aria-hidden className="shrink-0 text-text-secondary" />
        ) : (
          <ChevronDown size={20} strokeWidth={2} aria-hidden className="shrink-0 text-text-secondary" />
        )}
      </button>

      {isOpen ? (
        <div
          id={listId}
          role="listbox"
          aria-label={placeholder}
          // O foco fica no gatilho (aria-activedescendant): clicar numa opção não o tira.
          onMouseDown={(event) => event.preventDefault()}
          className={cn(
            "absolute top-[calc(100%+var(--spacing-xs))] right-0 left-0 z-30",
            "flex max-h-[280px] flex-col overflow-auto p-2xs bg-bg-surface-raised",
            "max-h-[360px] rounded-[var(--radius-none)] border border-border-default",
          )}
        >
          {blocos.map((bloco) => {
            const itens = bloco.indices.map(renderOption);
            const rotuloId = `${id}-grupo-${bloco.indices[0]}`;
            if (!bloco.group) return <Fragment key={rotuloId}>{itens}</Fragment>;
            return (
              <div key={rotuloId} role="group" aria-labelledby={rotuloId} className="flex shrink-0 flex-col">
                <div
                  id={rotuloId}
                  className="px-sm pt-xs pb-2xs font-body text-caption font-medium text-text-tertiary"
                >
                  {bloco.group}
                </div>
                {itens}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
