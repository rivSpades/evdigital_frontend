import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

// Tabela genérica dos blocos "Opções" e "específico do produto" (PRD-servicos.md §4,
// bloco 3 e 7). Espelha a tabela do frame "Secção · Opções" da ficha da Loja online no
// design-system.pen: linha destacada com fundo $accent-primary-subtle e badge "A nossa
// recomendação" quando `recommended` é verdadeiro (decisão S-D2 do PRD-servicos.md).

export function Tabela({
  columns,
  rows,
  recommendedLabel,
}: {
  columns: string[];
  recommendedLabel: string;
  rows: { cells: string[]; recommended?: boolean }[];
}) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border-subtle">
      {/* Cabeçalho só no desktop: em mobile cada linha vira um cartão com rótulos. */}
      <div className="hidden bg-bg-surface-sunken lg:flex">
        {columns.map((col) => (
          <div key={col} className="flex-1 px-lg py-md">
            <p className="font-body text-caption font-medium tracking-[var(--letter-spacing-label)] text-text-tertiary uppercase">
              {col}
            </p>
          </div>
        ))}
      </div>

      {rows.map((row, i) => (
        <div
          key={row.cells[0]}
          className={cn(
            "flex flex-col gap-md p-lg lg:flex-row lg:gap-0 lg:p-0",
            i > 0 && "border-t border-border-subtle",
            row.recommended ? "bg-accent-primary-subtle" : "bg-bg-surface",
          )}
        >
          {row.cells.map((cell, cellIndex) => (
            <div key={columns[cellIndex]} className="flex-1 lg:px-lg lg:py-lg">
              <p className="font-body text-caption font-medium text-text-tertiary lg:hidden">
                {columns[cellIndex]}
              </p>
              {cellIndex === 0 ? (
                <div className="flex flex-col gap-xs">
                  <p className="font-heading text-title-sm font-semibold tracking-[var(--letter-spacing-title)] text-text-primary">
                    {cell}
                  </p>
                  {row.recommended ? (
                    <span className="inline-flex w-fit items-center gap-2xs rounded-[var(--badge-radius)] bg-accent-primary px-sm py-2xs">
                      <Star size={14} strokeWidth={2} aria-hidden className="text-text-on-accent" />
                      <span className="font-body text-caption font-medium text-text-on-accent">
                        {recommendedLabel}
                      </span>
                    </span>
                  ) : null}
                </div>
              ) : (
                <p className="font-body text-body text-text-secondary">{cell}</p>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
