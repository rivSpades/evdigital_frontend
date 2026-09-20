import Link from "@/i18n/locale-link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

// Espelha os swatches ds/action/button--* do design-system.pen.
// Tamanhos: md = $button-height-md (44) + $button-inset-x (24) + $font-size-label
//           lg = $button-height-lg (56) + $space-xl (32)      + $font-size-body-lg
//           compact = 36 + $space-md (16) + $font-size-label
// Todos os tamanhos cumprem $tap-target-min excepto compact, que só se usa em barras
// densas (não existe na Home).

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "danger";
export type ButtonSize = "compact" | "md" | "lg";

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
};

const sizeClasses: Record<ButtonSize, string> = {
  compact: "h-9 px-md text-label",
  md: "h-11 px-lg text-label",
  lg: "h-14 px-xl text-body-lg",
};

// A variante terciária é um botão sem caixa: usa o inset menor do .pen ($space-sm).
const tertiaryInset: Record<ButtonSize, string> = {
  compact: "px-sm",
  md: "px-sm",
  lg: "px-sm",
};

function buttonClasses({
  variant,
  size,
  fullWidth,
  className,
}: {
  variant: ButtonVariant;
  size: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-xs rounded-[var(--button-radius)]",
    "font-body font-medium whitespace-nowrap",
    "transition-colors disabled:cursor-not-allowed",
    sizeClasses[size],
    variant === "tertiary" && tertiaryInset[size],
    variantClasses[variant],
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

type ButtonProps = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, "children" | "className">;

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...rest}
    >
      {children}
    </button>
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
