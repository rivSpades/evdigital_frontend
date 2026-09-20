"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/cn";

// Espelha os swatches ds/overlay/dropdown-menu--* do frame "Inventário · Lote A" (EoIvi)
// e o "Campo · O que precisa" dos frames Contacto (M9S6m / uhCIg) do design-system.pen.
//
// O gatilho segue as métricas do campo de formulário (altura $input-height, raio
// $input-radius, inset $input-inset-x) e não as do botão, porque no .pen ele vive dentro
// da coluna do formulário, ao lado dos restantes campos. Aberto passa a
// $bg-surface-pressed com contorno $border-interactive de $border-width-thick.
//
// O painel é $bg-surface-raised com $radius-md, contorno $border-subtle e fio de luz
// interior a $border-highlight (nunca um halo exterior). Cada item tem 44px de altura
// ($tap-target-min), raio $radius-sm, e o item escolhido fica a $bg-surface-selected com
// visto a $text-accent.

export type SelectOption = { value: string; label: string };

export function Select({
  id,
  name,
  value,
  onChange,
  options,
  placeholder,
  invalid = false,
  describedBy,
}: {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
  invalid?: boolean;
  describedBy?: string;
}) {
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
        className={cn(
          "flex h-11 w-full items-center justify-between gap-xs",
          "rounded-[var(--input-radius)] px-[var(--input-inset-x)]",
          "border font-body text-label font-medium transition-colors",
          isOpen
            ? "border-border-interactive bg-bg-surface-pressed shadow-[inset_0_0_0_1px_var(--color-border-interactive)]"
            : "border-[var(--input-border)] bg-[var(--input-bg)] hover:border-border-interactive hover:bg-bg-surface-hover",
          invalid &&
            !isOpen &&
            "border-feedback-error-border shadow-[inset_0_0_0_1px_var(--color-feedback-error-border)] hover:border-feedback-error-border",
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
          className={cn(
            "absolute top-[calc(100%+var(--spacing-xs))] right-0 left-0 z-30",
            "flex max-h-[280px] flex-col gap-3xs overflow-auto p-2xs",
            "rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface-raised",
            "shadow-[inset_0_1px_0_0_var(--color-border-highlight),var(--shadow-elevation-3)]",
          )}
        >
          {options.map((option, index) => {
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
                  "flex h-11 shrink-0 cursor-pointer items-center gap-sm rounded-[var(--radius-sm)] px-sm",
                  "font-body text-body text-text-primary",
                  isSelected && "bg-bg-surface-selected",
                  !isSelected && index === activeIndex && "bg-bg-surface-hover",
                )}
              >
                <span className="flex-1">{option.label}</span>
                {isSelected ? (
                  <Check size={20} strokeWidth={2} aria-hidden className="text-text-accent" />
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
