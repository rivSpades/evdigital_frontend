"use client";

import { useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { CircleAlert, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/cn";

// Espelha os swatches ds/form/input-field--* do frame "Inventário · Lote A" (EoIvi) e as
// instâncias reais dos frames Contacto (M9S6m / uhCIg) do design-system.pen.
//
// Anatomia fixada no .pen: rótulo sempre acima do campo e nunca em maiúsculas; o
// placeholder é um exemplo e nunca substitui o rótulo; ajuda e mensagem de erro a
// $font-size-body; erro sempre abaixo do campo e sempre com ícone além da cor.
//
// Métricas: altura $input-height (44), raio $input-radius, inset $input-inset-x,
// fundo $input-bg, contorno $input-border, foco $input-border-focus.
//
// O .pen desenha os estados de foco e de erro com um contorno de $border-width-thick
// (2px). Em CSS isso passaria a caixa a saltar 1px ao focar, por isso o segundo pixel é
// um fio interior (inset box-shadow) sobre a borda hairline, nunca um halo exterior
// (design-guardrails.md §1). O anel de foco exterior já vem do :focus-visible global.

const ICON_INSET = "left-[var(--input-inset-x)]";

// inset (16) + ícone (20) + gap $space-sm (12) = 48
const withIconPadding = "pl-12";

const controlBase = cn(
  "w-full rounded-[var(--input-radius)] bg-[var(--input-bg)]",
  "border border-[var(--input-border)]",
  "font-body text-body text-text-primary placeholder:text-text-tertiary",
  "transition-colors",
  "hover:border-border-interactive hover:bg-bg-surface-hover",
  "focus:border-[var(--input-border-focus)]",
  "focus:shadow-[inset_0_0_0_1px_var(--input-border-focus)]",
  "disabled:cursor-not-allowed disabled:border-border-subtle disabled:bg-bg-disabled",
  "disabled:text-text-disabled disabled:placeholder:text-text-disabled",
);

const controlInvalid = cn(
  "border-feedback-error-border",
  "shadow-[inset_0_0_0_1px_var(--color-feedback-error-border)]",
  "hover:border-feedback-error-border",
);

export function Field({
  htmlFor,
  label,
  optional = false,
  hint,
  error,
  children,
}: {
  htmlFor: string;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-xs">
      <div className="flex items-center gap-xs">
        <label
          htmlFor={htmlFor}
          className="font-body text-label font-medium text-text-primary"
        >
          {label}
        </label>
        {optional ? (
          <span className="font-body text-caption tracking-[var(--letter-spacing-caption)] text-text-tertiary">
            Opcional
          </span>
        ) : null}
      </div>

      {hint ? (
        <p id={`${htmlFor}-ajuda`} className="font-body text-body text-text-secondary">
          {hint}
        </p>
      ) : null}

      {children}

      {error ? (
        <p
          id={`${htmlFor}-erro`}
          className="flex gap-xs font-body text-body text-feedback-error-fg"
        >
          <CircleAlert
            size={20}
            strokeWidth={2}
            aria-hidden
            className="mt-[3px] shrink-0"
          />
          {error}
        </p>
      ) : null}
    </div>
  );
}

type InputProps = {
  invalid?: boolean;
  icon?: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"input">, "className">;

export function Input({ invalid = false, icon, className, ...rest }: InputProps) {
  return (
    <div className="relative">
      {icon ? (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute top-1/2 -translate-y-1/2 text-text-tertiary",
            ICON_INSET,
          )}
        >
          {icon}
        </span>
      ) : null}

      <input
        aria-invalid={invalid || undefined}
        className={cn(
          controlBase,
          "h-11 px-[var(--input-inset-x)]",
          icon ? withIconPadding : undefined,
          invalid && controlInvalid,
          className,
        )}
        {...rest}
      />
    </div>
  );
}

type PasswordInputProps = {
  invalid?: boolean;
  className?: string;
  showLabel: string;
  hideLabel: string;
} & Omit<ComponentPropsWithoutRef<"input">, "className" | "type">;

export function PasswordInput({
  invalid = false,
  className,
  showLabel,
  hideLabel,
  ...rest
}: PasswordInputProps) {
  const [visivel, setVisivel] = useState(false);

  return (
    <div className="relative">
      <input
        type={visivel ? "text" : "password"}
        aria-invalid={invalid || undefined}
        className={cn(
          controlBase,
          "h-11 px-[var(--input-inset-x)] pr-12",
          invalid && controlInvalid,
          className,
        )}
        {...rest}
      />
      <button
        type="button"
        onClick={() => setVisivel((valor) => !valor)}
        aria-label={visivel ? hideLabel : showLabel}
        className={cn(
          "absolute top-1/2 right-[var(--input-inset-x)] -translate-y-1/2 text-text-tertiary transition-colors",
          "hover:text-text-primary",
        )}
      >
        {visivel ? (
          <EyeOff size={20} strokeWidth={2} aria-hidden />
        ) : (
          <Eye size={20} strokeWidth={2} aria-hidden />
        )}
      </button>
    </div>
  );
}

type TextareaProps = {
  invalid?: boolean;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"textarea">, "className">;

export function Textarea({ invalid = false, className, ...rest }: TextareaProps) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={cn(
        controlBase,
        "block min-h-[120px] resize-y p-[var(--input-inset-x)]",
        "leading-[var(--line-height-body)]",
        invalid && controlInvalid,
        className,
      )}
      {...rest}
    />
  );
}
