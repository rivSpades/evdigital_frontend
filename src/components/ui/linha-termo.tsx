import { cn } from "@/lib/cn";

// Espelha ds/display/linha-termo (EyBiB) do design-system.pen (direcção "A vez"): um par
// termo e explicação numa linha de registo. Padding [$space-md, 0], régua inferior hairline
// $border-default (a superior é do contentor). Sem ícone em quadrado nem fundo de destaque.
// - Termo: $font-body label $font-weight-body-strong $letter-spacing-label $text-primary,
//   na coluna de 278 do .pen = colunas 1 a 3 da grelha de 12 em lg.
// - Texto: $font-body body $text-secondary; `destaque` passa-o a $text-primary (os dois
//   meios que quase toda a gente espera, na Loja online).
// Abaixo de lg (override mobile do .pen): empilhados, gap $space-2xs.
// `colunaFixa` (Competências do detalhe do consultor, fS6QZ/e7iCjq/szjje): o Termo numa coluna
// fixa, a do retrato: 200 em tablet (md) e 278 em lg; em mobile continua empilhada.

export function LinhaTermo({
  termo,
  texto,
  destaque = false,
  colunaFixa = false,
  className,
}: {
  termo: string;
  texto: string;
  destaque?: boolean;
  colunaFixa?: boolean;
  className?: string;
}) {
  return (
    <li
      className={cn(
        "flex flex-col gap-2xs border-b border-border-default py-md",
        colunaFixa
          ? "md:grid md:grid-cols-[200px_minmax(0,1fr)] md:gap-x-lg md:gap-y-0 lg:grid-cols-[278px_minmax(0,1fr)]"
          : "lg:grid lg:grid-cols-12 lg:gap-x-lg lg:gap-y-0",
        className,
      )}
    >
      <p
        className={cn(
          "min-w-0 font-body text-label font-semibold tracking-[var(--letter-spacing-label)] text-text-primary",
          !colunaFixa && "lg:col-span-3",
        )}
      >
        {termo}
      </p>
      <p
        className={cn(
          "min-w-0 font-body text-body",
          !colunaFixa && "lg:col-span-9",
          destaque ? "text-text-primary" : "text-text-secondary",
        )}
      >
        {texto}
      </p>
    </li>
  );
}
