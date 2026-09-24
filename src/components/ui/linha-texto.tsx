import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// Espelha ds/display/linha-texto (xBySX) do design-system.pen (direcção "A vez"): item de
// lista como linha de registo com régua inferior hairline $border-default e SEM marcador
// antes do texto (design-guardrails.md §4). `ListaTexto` é o contentor (<ul>) com a régua
// superior.
//
// Variantes (overrides do .pen):
// - item (default): $font-body body $text-secondary, padding [$space-md, 0]
// - item compacto (`compacta`): padding [$space-xs, 0] (listas dentro de uma
//   ds/display/secao-leitura, ex. dados recolhidos na Política de Privacidade)
// - afirmacao: $font-heading $font-weight-heading $text-primary, $font-size-body-lg e
//   padding [$space-md, 0] em mobile, $font-size-title-sm e [$space-lg, 0] em lg (Sobre,
//   "Explicamos antes de fazer.")
// - item grande (`grande`): body-lg a partir de lg (ficha de serviço avançado, "O que poderá
//   incluir": override $font-size-body-lg no desktop, body no mobile)

export function ListaTexto({ children, className }: { children: ReactNode; className?: string }) {
  return <ul className={cn("flex flex-col border-t border-border-default", className)}>{children}</ul>;
}

export function LinhaTexto({
  children,
  variante = "item",
  compacta = false,
  grande = false,
}: {
  children: ReactNode;
  variante?: "item" | "afirmacao";
  compacta?: boolean;
  grande?: boolean;
}) {
  return (
    <li
      className={cn(
        "border-b border-border-default",
        variante === "afirmacao"
          ? "py-md font-heading text-body-lg leading-[var(--line-height-title)] font-semibold tracking-[var(--letter-spacing-title)] text-text-primary lg:py-lg lg:text-title-sm"
          : cn(
              "font-body text-body text-text-secondary",
              compacta ? "py-xs" : "py-md",
              grande && "lg:text-body-lg",
            ),
      )}
    >
      {children}
    </li>
  );
}
