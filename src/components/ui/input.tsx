"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { CircleAlert, Eye, EyeOff } from "lucide-react";
import { ErroCampo } from "@/components/ui/erro-campo";
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
// Variante "folha" (direcção "A vez", campos dentro de ds/layout/folha): o campo é a coisa
// mais escura e mais contornada da folha ($bg-surface-sunken + contorno $border-strong),
// rótulo com gap $space-2xs, ajuda em $font-size-caption $text-tertiary e erro no formato
// ds/form/erro-campo (glifo "!" + caption). O `Field` passa a variante aos controlos por
// contexto: um formulário numa `Folha` só precisa de `variant="folha"` em cada `Field`.
//
// O .pen desenha os estados de foco e de erro com um contorno de $border-width-thick
// (2px). Em CSS isso passaria a caixa a saltar 1px ao focar, por isso o segundo pixel é
// um fio interior (inset box-shadow) sobre a borda hairline, nunca um halo exterior
// (design-guardrails.md §1). O anel de foco exterior já vem do :focus-visible global.
//
// Acessibilidade: o `Field` liga ajuda e erro ao controlo por `aria-describedby` (via
// contexto) e o erro é anunciado (`role="alert"`).

export type FieldVariant = "default" | "folha";

type FieldContextValue = { variant: FieldVariant; describedBy?: string; invalid: boolean };

const FieldContext = createContext<FieldContextValue>({ variant: "default", invalid: false });

const ICON_INSET = "left-[var(--input-inset-x)]";

// inset (16) + ícone (20) + gap $space-sm (12) = 48
const withIconPadding = "pl-12";

function controlBase(variant: FieldVariant) {
  return cn(
    "w-full rounded-[var(--input-radius)]",
    variant === "folha"
      ? "border border-border-strong bg-bg-surface-sunken"
      : "border border-[var(--input-border)] bg-[var(--input-bg)]",
    "font-body text-body text-text-primary placeholder:text-text-tertiary",
    "transition-colors",
    "hover:border-border-interactive",
    variant === "default" && "hover:bg-bg-surface-hover",
    // O foco do campo é o anel interior (borda + fio inset, 2px no total, contraste > 3:1).
    // O anel exterior global (:focus-visible, em globals.css) somava-se e, por ter offset,
    // parecia uma segunda borda: em campos de texto o foco é sempre visível, até ao clicar.
    // Só aqui é suprimido. O `!` é obrigatório: o :focus-visible global está fora de
    // camadas e ganharia a uma utilidade normal (que vive em @layer utilities).
    "focus:border-[var(--input-border-focus)]",
    "focus:shadow-[inset_0_0_0_1px_var(--input-border-focus)]",
    "focus-visible:outline-none!",
    // Autofill do browser no tema escuro: o fundo claro do Chrome fica tapado por uma
    // sombra interior da cor do campo (o fundo do UA não se pode mudar) e o texto mantém
    // $text-primary. Com foco, o fio interior de foco vai por cima.
    variant === "folha"
      ? "autofill:shadow-[inset_0_0_0_1000px_var(--color-bg-surface-sunken)]"
      : "autofill:shadow-[inset_0_0_0_1000px_var(--input-bg)]",
    variant === "folha"
      ? "autofill:focus:shadow-[inset_0_0_0_1px_var(--input-border-focus),inset_0_0_0_1000px_var(--color-bg-surface-sunken)]"
      : "autofill:focus:shadow-[inset_0_0_0_1px_var(--input-border-focus),inset_0_0_0_1000px_var(--input-bg)]",
    "autofill:[-webkit-text-fill-color:var(--color-text-primary)] autofill:[caret-color:var(--color-text-primary)]",
    "disabled:cursor-not-allowed disabled:border-border-subtle disabled:bg-bg-disabled",
    "disabled:text-text-disabled disabled:placeholder:text-text-disabled",
  );
}

const controlInvalid = cn(
  "border-feedback-error-border",
  "shadow-[inset_0_0_0_1px_var(--color-feedback-error-border)]",
  "hover:border-feedback-error-border",
);

/**
 * Contexto do `Field` à volta (ajuda/erro em `describedBy`, `invalid`), para controlos
 * definidos noutros ficheiros (ex. `Select`) ficarem ligados ao rótulo, ajuda e erro.
 */
export function useFieldContext(): FieldContextValue {
  return useContext(FieldContext);
}

function joinIds(...ids: Array<string | undefined>) {
  const lista = ids.filter(Boolean);
  return lista.length > 0 ? lista.join(" ") : undefined;
}

export function Field({
  htmlFor,
  label,
  optional = false,
  optionalLabel = "Opcional",
  hint,
  error,
  variant = "default",
  aside,
  after,
  children,
}: {
  htmlFor: string;
  label: string;
  optional?: boolean;
  /** Texto de "Opcional" no idioma da página. */
  optionalLabel?: string;
  hint?: string;
  error?: string;
  variant?: FieldVariant;
  /** Acção em linha à direita do rótulo (ex. "Esqueceu a palavra-passe?"). */
  aside?: ReactNode;
  /**
   * Acção por baixo do campo (e do erro), depois do controlo na ordem de tabulação (ex.
   * "Esqueceu a palavra-passe?" no Entrar: campo, depois a ligação).
   */
  after?: ReactNode;
  children: ReactNode;
}) {
  const hintId = hint ? `${htmlFor}-ajuda` : undefined;
  const errorId = error ? `${htmlFor}-erro` : undefined;
  const folha = variant === "folha";

  return (
    <FieldContext.Provider
      value={{ variant, describedBy: joinIds(hintId, errorId), invalid: Boolean(error) }}
    >
      <div className={cn("flex flex-col", folha ? "gap-2xs" : "gap-xs")}>
        {/* Com `aside` a linha pode partir: se o rótulo e a acção não cabem lado a lado
            (ex. "Esqueceu a palavra-passe?" a 375), a acção desce e fica à direita, em vez
            de sair da folha. */}
        <div
          className={cn(
            "flex items-center",
            folha ? "gap-2xs" : "gap-xs",
            Boolean(aside) && "flex-wrap justify-between",
          )}
        >
          <div className={cn("flex items-center", folha ? "gap-2xs" : "gap-xs")}>
            <label
              htmlFor={htmlFor}
              className={cn(
                "font-body text-label font-medium text-text-primary",
                Boolean(aside) && "whitespace-nowrap",
              )}
            >
              {label}
            </label>
            {optional ? (
              // Na folha o .pen escreve "Opcional" ao tamanho do rótulo ($font-size-label,
              // $font-weight-body, $text-tertiary): Entrar · criar conta e Definições.
              <span
                className={cn(
                  "font-body text-text-tertiary",
                  folha
                    ? "text-label font-normal"
                    : "text-caption tracking-[var(--letter-spacing-caption)]",
                )}
              >
                {optionalLabel}
              </span>
            ) : null}
          </div>
          {aside ? <div className="ml-auto flex">{aside}</div> : null}
        </div>

        {hint ? (
          <p
            id={hintId}
            className={cn(
              "font-body",
              folha ? "text-caption text-text-tertiary" : "text-body text-text-secondary",
            )}
          >
            {hint}
          </p>
        ) : null}

        {children}

        {error ? (
          folha ? (
            <ErroCampo id={errorId}>{error}</ErroCampo>
          ) : (
            <p
              id={errorId}
              role="alert"
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
          )
        ) : null}

        {after ? <div className="flex">{after}</div> : null}
      </div>
    </FieldContext.Provider>
  );
}

type InputProps = {
  invalid?: boolean;
  icon?: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithRef<"input">, "className">;

export function Input({ invalid, icon, className, ...rest }: InputProps) {
  const field = useContext(FieldContext);
  const isInvalid = invalid ?? field.invalid;

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
        aria-invalid={isInvalid || undefined}
        aria-describedby={field.describedBy}
        className={cn(
          controlBase(field.variant),
          "h-11 px-[var(--input-inset-x)]",
          icon ? withIconPadding : undefined,
          isInvalid && controlInvalid,
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
  invalid,
  className,
  showLabel,
  hideLabel,
  ...rest
}: PasswordInputProps) {
  const field = useContext(FieldContext);
  const isInvalid = invalid ?? field.invalid;
  const [visivel, setVisivel] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // Mostrar/ocultar mantém o foco onde estava e o cursor na mesma posição: com o rato o
  // botão não tira o foco ao campo (mousedown sem default) e a selecção é reposta depois de
  // o `type` mudar; com o teclado o foco fica no botão.
  const selecao = useRef<[number | null, number | null] | null>(null);
  useEffect(() => {
    const campo = inputRef.current;
    if (!campo || !selecao.current) return;
    const [inicio, fim] = selecao.current;
    selecao.current = null;
    // Depois do frame: com um clique real o Chrome recoloca o cursor no início do campo a
    // seguir à troca de `type` (selectionchange assíncrono); repor antes disso não chega.
    const frame = requestAnimationFrame(() => {
      campo.focus();
      if (inicio !== null && fim !== null) campo.setSelectionRange(inicio, fim);
    });
    return () => cancelAnimationFrame(frame);
  }, [visivel]);

  function alternar() {
    const campo = inputRef.current;
    if (campo && document.activeElement === campo) {
      selecao.current = [campo.selectionStart, campo.selectionEnd];
    }
    setVisivel((valor) => !valor);
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type={visivel ? "text" : "password"}
        aria-invalid={isInvalid || undefined}
        aria-describedby={field.describedBy}
        className={cn(
          controlBase(field.variant),
          "h-11 px-[var(--input-inset-x)] pr-12",
          isInvalid && controlInvalid,
          className,
        )}
        {...rest}
      />
      {/* Alvo de $tap-target-min (44) encostado à direita do campo, com o ícone de 20 ao
          centro: o ícone fica ao mesmo inset do .pen e o toque não falha. */}
      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={alternar}
        // Rótulo que muda com o estado ("Mostrar"/"Ocultar"), sem aria-pressed: os dois
        // juntos anunciavam o estado duas vezes, e de forma contraditória.
        aria-label={visivel ? hideLabel : showLabel}
        className={cn(
          "absolute top-0 right-0 flex size-11 items-center justify-center rounded-[var(--input-radius)]",
          "text-text-tertiary transition-colors hover:text-text-primary",
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

export function Textarea({ invalid, className, ...rest }: TextareaProps) {
  const field = useContext(FieldContext);
  const isInvalid = invalid ?? field.invalid;

  return (
    <textarea
      aria-invalid={isInvalid || undefined}
      aria-describedby={field.describedBy}
      className={cn(
        controlBase(field.variant),
        "block min-h-[120px] resize-y p-[var(--input-inset-x)]",
        "leading-[var(--line-height-body)]",
        isInvalid && controlInvalid,
        className,
      )}
      {...rest}
    />
  );
}
