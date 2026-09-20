"use client";

import { useId, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/cn";

// Espelha ds/disclosure/accordion-item (mehKD): cabeçalho de $accordion-header-height
// (64 na largura estreita, ver override do frame mobile), inset $accordion-inset-x,
// raio $accordion-radius e divisor inferior $accordion-divider.

export type AccordionItem = {
  question: string;
  answer: string;
};

export function Accordion({
  items,
  defaultOpenIndex = 0,
  className,
}: {
  items: AccordionItem[];
  defaultOpenIndex?: number;
  className?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);
  const baseId = useId();

  return (
    <div className={cn("flex flex-col", className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const headerId = `${baseId}-header-${index}`;
        const Chevron = isOpen ? ChevronUp : ChevronDown;

        return (
          <div
            key={item.question}
            className="border-b border-[var(--accordion-divider)]"
          >
            <h3>
              <button
                type="button"
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className={cn(
                  "flex h-16 w-full items-center justify-between gap-sm lg:h-14",
                  "rounded-[var(--accordion-radius)] px-[var(--accordion-inset-x)] text-left",
                  "font-body text-label font-semibold text-text-primary",
                  "transition-colors hover:bg-bg-surface-hover",
                )}
              >
                {item.question}
                <Chevron
                  size={22}
                  strokeWidth={2}
                  aria-hidden
                  className={cn(
                    "shrink-0",
                    isOpen ? "text-text-accent" : "text-text-secondary",
                  )}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              hidden={!isOpen}
              className="px-[var(--accordion-inset-x)] pb-lg"
            >
              <p className="font-body text-body text-text-secondary">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
