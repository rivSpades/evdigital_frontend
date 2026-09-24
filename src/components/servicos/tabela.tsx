import { cn } from "@/lib/cn";

// Tabela genérica dos blocos "Opções" e "específico do produto" (PRD-servicos.md §4,
// blocos 3 e 7). Nenhum serviço a usa hoje e o .pen "A vez" não a desenha: fica como
// registo (réguas horizontais hairline $border-default, sem fundo nem cartão, sem verde).
// A linha recomendada (decisão S-D2 do PRD-servicos.md) diz-se com o rótulo em texto
// ($text-primary, $font-weight-body-strong) por baixo do nome, sem fundo nem marcador.
// Cabeçalho de colunas só em lg; abaixo cada célula leva o rótulo da coluna.

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
    <div role="table" className="flex flex-col border-t border-border-default">
      <div role="row" className="hidden border-b border-border-default py-sm lg:flex lg:gap-lg">
        {columns.map((col) => (
          <p
            key={col}
            role="columnheader"
            className="flex-1 font-body text-caption tracking-[var(--letter-spacing-caption)] text-text-tertiary"
          >
            {col}
          </p>
        ))}
      </div>

      {rows.map((row) => (
        <div
          key={row.cells[0]}
          role="row"
          className="flex flex-col gap-md border-b border-border-default py-md lg:flex-row lg:gap-lg"
        >
          {row.cells.map((cell, cellIndex) => (
            <div key={columns[cellIndex]} role="cell" className="flex flex-1 flex-col gap-2xs">
              <p className="font-body text-caption text-text-tertiary lg:hidden">
                {columns[cellIndex]}
              </p>
              <p
                className={cn(
                  cellIndex === 0
                    ? "font-heading text-title-sm font-semibold tracking-[var(--letter-spacing-title)] text-text-primary"
                    : "font-body text-body text-text-secondary",
                )}
              >
                {cell}
              </p>
              {cellIndex === 0 && row.recommended ? (
                <p className="font-body text-caption font-semibold text-text-primary">
                  {recommendedLabel}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
