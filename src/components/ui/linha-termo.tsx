import { cn } from "@/lib/cn";

// Espelha ds/display/linha-termo (EyBiB) do design-system.pen (direcção "A vez"): um par
// termo e explicação numa linha de registo. Padding [$space-md, 0], régua inferior hairline
// $border-default (a superior é do contentor). Sem ícone em quadrado nem fundo de destaque.
// - Termo: $font-body label $font-weight-body-strong $letter-spacing-label $text-primary,
//   na coluna de 278 do .pen = colunas 1 a 3 da grelha de 12 em lg.
// - Texto: $font-body body $text-secondary; `destaque` passa-o a $text-primary (os dois
//   meios que quase toda a gente espera, na Loja online).
// Abaixo de lg (override mobile do .pen): empilhados, gap $space-2xs.

export function LinhaTermo({
  termo,
  texto,
  destaque = false,
  className,
}: {
  termo: string;
  texto: string;
  destaque?: boolean;
  className?: string;
}) {
  return (
    <li
      className={cn(
        "flex flex-col gap-2xs border-b border-border-default py-md",
        "lg:grid lg:grid-cols-12 lg:gap-x-lg lg:gap-y-0",
        className,
      )}
    >
      <p className="font-body text-label font-semibold tracking-[var(--letter-spacing-label)] text-text-primary lg:col-span-3">
        {termo}
      </p>
      <p
        className={cn(
          "font-body text-body lg:col-span-9",
          destaque ? "text-text-primary" : "text-text-secondary",
        )}
      >
        {texto}
      </p>
    </li>
  );
}
