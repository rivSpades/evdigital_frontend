import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// Espelha ds/display/facto (OZCXp) do design-system.pen (direcção "A vez"): uma linha de
// ficha. Termo em $font-body caption $text-tertiary por cima, Valor em caption
// $text-primary, padding [$space-sm, 0] e régua inferior hairline $border-default (régua
// horizontal neutra de registo, não marca lateral).
// Valor em $font-mono por defeito (referências, datas); `valorTexto` passa-o a $font-body
// (override das fichas de projeto: "Produto próprio", "Django REST API").
//
// `Factos` é o contentor: <dl> com a régua superior hairline $border-default.

export function Factos({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <dl className={cn("flex flex-col border-t border-border-default", className)}>{children}</dl>
  );
}

// `emLinha` (ficha do pedido em mobile, override das instâncias de 375): abaixo de lg o
// Termo e o Valor ficam lado a lado, gap $space-sm, Termo com 118 de largura; em lg voltam
// a empilhar-se (coluna de 278). `aviso`: Valor em $feedback-warning-fg (urgência "Está a
// travar o negócio").

export function Facto({
  termo,
  valor,
  valorTexto = false,
  emLinha = false,
  aviso = false,
}: {
  termo?: string;
  valor: string;
  valorTexto?: boolean;
  emLinha?: boolean;
  aviso?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex border-b border-border-default py-sm",
        emLinha ? "flex-row gap-sm lg:flex-col lg:gap-0" : "flex-col",
      )}
    >
      {termo ? (
        <dt
          className={cn(
            "font-body text-caption tracking-[var(--letter-spacing-caption)] text-text-tertiary",
            emLinha && "w-[118px] shrink-0 lg:w-auto",
          )}
        >
          {termo}
        </dt>
      ) : null}
      <dd
        className={cn(
          "min-w-0 text-caption",
          aviso ? "text-feedback-warning-fg" : "text-text-primary",
          valorTexto ? "font-body" : "font-mono",
        )}
      >
        {valor}
      </dd>
    </div>
  );
}
