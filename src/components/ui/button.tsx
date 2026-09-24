"use client";

import Link from "@/i18n/locale-link";
import { useLayoutEffect, useRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/cn";

// Espelha os swatches ds/action/button--* do design-system.pen.
// Tamanhos: md = $button-height-md (44) + $button-inset-x (24) + $font-size-label
//           lg = $button-height-lg (56) + $space-xl (32)      + $font-size-body-lg
//           compact = 36 + $space-md (16) + $font-size-label
//           action = $button-height-lg (56) + $button-inset-x (24) + $font-size-label
//                    (acção que avança numa folha, direcção "A vez" do .pen)
// Todos os tamanhos cumprem $tap-target-min excepto compact, que só se usa em barras
// densas (não existe na Home).
//
// Variantes da direcção "A vez" (frames v2 do .pen, instâncias de ds/action/button com
// overrides): outline = sem fundo, contorno hairline $border-strong, rótulo $text-primary
// (secundário: "Fale connosco" no Entrar, "Tentar outra vez"); outline-danger = sem fundo,
// contorno hairline $feedback-error-border, rótulo $feedback-error-fg (zona de perigo);
// destructive = $feedback-error-solid com rótulo $feedback-error-on-solid (confirmar uma
// acção destrutiva num modal). Nenhuma destas é verde: o verde fica para o primário.
//
// `busy` (estado "a entrar" / "a enviar" dos frames v2 do Entrar): desactivado, fundo
// $bg-disabled com contorno hairline $border-default, spinner (Lucide loader-circle 16,
// $text-primary) antes do rótulo em $text-secondary. Anunciado com aria-busy. Em espera o
// botão mantém a largura que tinha (design-guardrails.md §6): a etiqueta de espera é mais
// curta, e num botão `w-fit` o botão encolhia e o layout saltava. Quando a etiqueta de
// espera é mais comprida que a normal (ex. "Finalizar" → "A enviar..." no Contacto), passa-se
// `rotuloEspera`: o botão reserva desde o início o espaço dela (com o spinner), invisível.

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "danger"
  | "outline"
  | "outline-danger"
  | "destructive";
export type ButtonSize = "compact" | "md" | "lg" | "action";

const variantClasses: Record<ButtonVariant, string> = {
  primary: cn(
    "bg-accent-primary text-text-on-accent",
    "hover:bg-accent-primary-hover",
    "active:bg-accent-primary-pressed active:shadow-[inset_0_0_0_1px_var(--color-shadow-inset-shade)]",
    "disabled:bg-bg-disabled disabled:text-text-disabled disabled:shadow-[inset_0_0_0_1px_var(--color-border-subtle)]",
  ),
  secondary: cn(
    "border-2 border-border-strong bg-bg-surface text-text-primary",
    "hover:border-border-interactive hover:bg-bg-surface-hover",
    "active:border-border-interactive active:bg-bg-surface-pressed",
    "disabled:border-border-subtle disabled:bg-bg-disabled disabled:text-text-disabled",
  ),
  tertiary: cn(
    "text-text-link",
    "hover:bg-bg-surface-hover hover:text-text-accent",
    "active:bg-bg-surface-pressed active:text-text-accent active:shadow-[inset_0_0_0_1px_var(--color-shadow-inset-shade)]",
    "disabled:bg-transparent disabled:text-text-disabled",
  ),
  danger: cn(
    "border-2 border-feedback-error-border bg-bg-surface text-feedback-error-fg",
    "hover:bg-feedback-error-bg",
    "active:border-feedback-error-solid active:bg-feedback-error-bg",
    "disabled:border-border-subtle disabled:bg-bg-disabled disabled:text-text-disabled",
  ),
  outline: cn(
    "border border-border-strong bg-transparent text-text-primary",
    "hover:bg-bg-surface-hover active:bg-bg-surface-pressed",
    "disabled:border-border-subtle disabled:text-text-disabled disabled:hover:bg-transparent",
  ),
  "outline-danger": cn(
    "border border-feedback-error-border bg-transparent text-feedback-error-fg",
    "hover:bg-feedback-error-bg active:bg-feedback-error-bg",
    "disabled:border-border-subtle disabled:text-text-disabled disabled:hover:bg-transparent",
  ),
  destructive: cn(
    "bg-feedback-error-solid text-feedback-error-on-solid",
    "hover:bg-[var(--p-red-100)] active:bg-[var(--p-red-100)]",
    "disabled:border disabled:border-border-default disabled:bg-bg-surface-raised disabled:text-text-secondary",
  ),
};

const busyClasses = cn(
  "bg-bg-disabled text-text-secondary",
  "shadow-[inset_0_0_0_1px_var(--color-border-default)]",
);

const sizeClasses: Record<ButtonSize, string> = {
  compact: "h-9 px-md text-label",
  md: "h-11 px-lg text-label",
  lg: "h-14 px-xl text-body-lg",
  action: "h-14 px-[var(--button-inset-x)] text-label",
};

// A variante terciária é um botão sem caixa: usa o inset menor do .pen ($space-sm).
const tertiaryInset: Record<ButtonSize, string> = {
  compact: "px-sm",
  md: "px-sm",
  lg: "px-sm",
  action: "px-sm",
};

function buttonClasses({
  variant,
  size,
  fullWidth,
  busy = false,
  className,
}: {
  variant: ButtonVariant;
  size: ButtonSize;
  fullWidth?: boolean;
  busy?: boolean;
  className?: string;
}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-xs rounded-[var(--button-radius)]",
    "font-body font-medium whitespace-nowrap",
    "transition-colors disabled:cursor-not-allowed",
    sizeClasses[size],
    variant === "tertiary" && tertiaryInset[size],
    // Sem merge de classes (`cn` só junta): em curso, o aspecto de "busy" substitui o da
    // variante em vez de competir com os seus `disabled:`.
    busy ? busyClasses : variantClasses[variant],
    fullWidth && "w-full",
    className,
  );
}

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
};

type ButtonProps = CommonProps & {
  /** Pedido em curso: desactiva o botão e mostra o spinner antes do rótulo. */
  busy?: boolean;
  /** Etiqueta de espera: reserva a largura dela (mais o spinner) em qualquer estado. */
  rotuloEspera?: string;
} & Omit<ComponentPropsWithoutRef<"button">, "children" | "className">;

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  children,
  type = "button",
  busy = false,
  rotuloEspera,
  disabled,
  ...rest
}: ButtonProps) {
  // Largura do último render sem espera; em espera fica como mínimo (o botão não encolhe).
  // Medida e aplicada em layout effect, antes de pintar: sem saltos visíveis.
  const botaoRef = useRef<HTMLButtonElement>(null);
  const larguraRef = useRef(0);
  useLayoutEffect(() => {
    const botao = botaoRef.current;
    if (!botao) return;
    if (busy) {
      if (larguraRef.current) botao.style.minWidth = `${larguraRef.current}px`;
    } else {
      botao.style.minWidth = "";
      larguraRef.current = botao.offsetWidth;
    }
  });

  return (
    <button
      ref={botaoRef}
      type={type}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      className={buttonClasses({
        variant,
        size,
        fullWidth,
        busy,
        className,
      })}
      {...rest}
    >
      {rotuloEspera ? (
        // Duas camadas na mesma célula da grelha: o conteúdo e, invisível (fora da árvore
        // de acessibilidade), o espaço da etiqueta de espera. A mais larga manda.
        <span className="grid">
          <span className="col-start-1 row-start-1 inline-flex items-center justify-center gap-xs">
            {busy ? <Spinner /> : null}
            {children}
          </span>
          <span
            aria-hidden
            className="invisible col-start-1 row-start-1 inline-flex items-center justify-center gap-xs"
          >
            <span className="size-4 shrink-0" />
            {rotuloEspera}
          </span>
        </span>
      ) : (
        <>
          {busy ? <Spinner /> : null}
          {children}
        </>
      )}
    </button>
  );
}

function Spinner() {
  return (
    <LoaderCircle
      size={16}
      strokeWidth={2}
      aria-hidden
      className="animate-spin text-text-primary motion-reduce:animate-none"
    />
  );
}

type ButtonLinkProps = CommonProps & { href: string } & Omit<
    ComponentPropsWithoutRef<"a">,
    "children" | "className" | "href"
  >;

export function ButtonLink({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  children,
  href,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...rest}
    >
      {children}
    </Link>
  );
}
