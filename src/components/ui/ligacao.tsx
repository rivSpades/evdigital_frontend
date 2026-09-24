import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "@/i18n/locale-link";
import { cn } from "@/lib/cn";

// Espelha ds/action/ligacao (U2U6FY) do design-system.pen (direcção "A vez"): ligação de
// texto sem fundo nem contorno, alvo de toque de 44 de altura, sem sublinhado nem marcador
// antes do texto. Variantes (overrides do Rótulo no .pen):
// - primaria: $text-primary, $font-size-label, $font-weight-label
// - em-linha: $text-link, $font-size-caption (ex. "Esqueceu a palavra-passe?", "Enviar
//   outra vez")
// - discreta: $text-secondary, $font-size-label (ex. "Voltar ao site")
//
// `Ligacao` navega (LocaleLink); `LigacaoBotao` é a mesma aparência para uma acção no
// próprio ecrã (button), para não usar <a> sem destino.

// - acao: $text-link, $font-size-body, $font-weight-label (ex. "Ver ficha", "Ler artigo",
//   "Ver todos os artigos", "Ver o que fazemos" nas páginas públicas)

// - discreta-caption: $text-secondary, $font-size-caption (rodapé ds/layout/footer--vez:
//   "Privacidade", "Termos", "Área de Cliente")

export type LigacaoVariant = "primaria" | "em-linha" | "discreta" | "acao" | "discreta-caption";

const variantClasses: Record<LigacaoVariant, string> = {
  primaria: "text-label font-medium text-text-primary hover:text-text-secondary",
  "em-linha": "text-caption text-text-link hover:text-text-accent",
  discreta: "text-label text-text-secondary hover:text-text-primary",
  acao: "text-body font-medium text-text-link hover:text-text-accent",
  "discreta-caption": "text-caption text-text-secondary hover:text-text-primary",
};

export function ligacaoClasses(variant: LigacaoVariant, className?: string) {
  return cn(
    "inline-flex min-h-11 w-fit items-center gap-xs font-body whitespace-nowrap transition-colors",
    "disabled:cursor-not-allowed disabled:text-text-disabled",
    variantClasses[variant],
    className,
  );
}

export function Ligacao({
  href,
  variant = "primaria",
  className,
  children,
  ...rest
}: {
  href: string;
  variant?: LigacaoVariant;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">) {
  return (
    <Link href={href} className={ligacaoClasses(variant, className)} {...rest}>
      {children}
    </Link>
  );
}

export function LigacaoBotao({
  variant = "em-linha",
  className,
  children,
  type = "button",
  ...rest
}: {
  variant?: LigacaoVariant;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">) {
  return (
    <button type={type} className={ligacaoClasses(variant, className)} {...rest}>
      {children}
    </button>
  );
}
