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
import { Eye, EyeOff } from "lucide-react";
import { ErroCampo } from "@/components/ui/erro-campo";
import { cn } from "@/lib/cn";

// Espelha os swatches ds/form/input-field--* do frame "Inventário · Lote A" (EoIvi) e as
// instâncias reais dos ecrãs de formulário do design-system.pen (direcção «B · Registo em
// linhas», 2026-09-25).
//
// Anatomia: cada campo é uma LINHA. Em md+ a etiqueta ocupa a coluna da esquerda (168,
// $font-size-label, $font-weight-label) e o controlo, a ajuda e o erro a coluna da direita
// (gap $space-lg); abaixo de md a linha empilha, etiqueta por cima com gap $space-xs. Padding
// vertical $space-md e régua $border-subtle de 1px no topo de cada linha (a `Folha` tira a
// da primeira). O placeholder é um exemplo e nunca substitui o rótulo. A ajuda fica por baixo
// do controlo e o erro (ds/form/erro-campo: glifo + caption, sempre além da cor) substitui-a.
//
// Controlo: sem fundo, sem contorno em cima e nos lados; só a linha de base de 1px
// $border-strong (≥3:1), raio 0, padding horizontal 0, altura $input-height (44). Hover:
// $border-interactive. Foco e erro: a linha passa a 2px (a borda hairline + um fio inset de
// 1px, para o layout não crescer), $border-focus e $feedback-error-fg. Desactivado:
// $text-disabled e $border-subtle.
//
// Acessibilidade: o `Field` liga ajuda e erro ao controlo por `aria-describedby` (via
// contexto) e o erro é anunciado (`role="alert"`).

type FieldContextValue = { describedBy?: string; invalid: boolean };

const FieldContext = createContext<FieldContextValue>({ invalid: false });

const ICON_INSET = "left-0";

// ícone (20) + gap $space-sm (12) = 32
const withIconPadding = "pl-8";

const controlBase = cn(
  "w-full rounded-none border-0 border-b border-border-strong bg-transparent px-0",
  "font-body text-body text-text-primary placeholder:text-text-tertiary",
  "transition-colors",
  "hover:border-border-interactive",
  // O foco é a linha de base a 2px (borda + fio inset, sem crescer o layout). O anel
  // exterior global (:focus-visible, em globals.css) é suprimido só nos campos de texto. O
  // `!` é obrigatório: o :focus-visible global está fora de camadas e ganharia a uma
  // utilidade normal (que vive em @layer utilities).
  "focus:border-[var(--input-border-focus)]",
  "focus:shadow-[inset_0_-1px_0_var(--input-border-focus)]",
  "focus-visible:outline-none!",
  // Autofill do browser no tema escuro: o fundo claro do Chrome fica tapado por uma sombra
  // interior da cor da página (o fundo do UA não se pode mudar) e o texto mantém
  // $text-primary. Com foco, o fio inset da linha de base vai por cima.
  "autofill:shadow-[inset_0_0_0_1000px_var(--color-bg-base)]",
  "autofill:focus:shadow-[inset_0_-1px_0_var(--input-border-focus),inset_0_0_0_1000px_var(--color-bg-base)]",
  "autofill:[-webkit-text-fill-color:var(--color-text-primary)] autofill:[caret-color:var(--color-text-primary)]",
  "disabled:cursor-not-allowed disabled:border-border-subtle disabled:bg-transparent",
  "disabled:text-text-disabled disabled:placeholder:text-text-disabled",
);

const controlInvalid = cn(
  "border-feedback-error-fg",
  "shadow-[inset_0_-1px_0_var(--color-feedback-error-fg)]",
  "hover:border-feedback-error-fg focus:border-feedback-error-fg",
  "focus:shadow-[inset_0_-1px_0_var(--color-feedback-error-fg)]",
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
  /**
   * Acção por baixo da etiqueta, na coluna da esquerda (ex. "Esqueceu a palavra-passe?"),
   * com alvo de 44.
   */
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

  return (
    <FieldContext.Provider
      value={{ describedBy: joinIds(error ? undefined : hintId, errorId), invalid: Boolean(error) }}
    >
      <div
        className={cn(
          "flex flex-col gap-xs border-t border-border-subtle py-md",
          "md:grid md:grid-cols-[168px_minmax(0,1fr)] md:items-start md:gap-x-lg",
        )}
      >
        <div className="flex flex-col md:pt-[10px]">
          <div className="flex flex-wrap items-baseline gap-x-xs">
            <label
              htmlFor={htmlFor}
              className="font-body text-label font-medium text-text-primary"
            >
              {label}
            </label>
            {optional ? (
              <span className="font-body text-label font-normal text-text-tertiary">
                {optionalLabel}
              </span>
            ) : null}
          </div>
          {aside ? <div className="flex">{aside}</div> : null}
        </div>

        <div className="flex min-w-0 flex-col gap-xs">
          {children}

          {hint && !error ? (
            <p
              id={hintId}
              className="font-body text-caption tracking-[var(--letter-spacing-caption)] text-text-tertiary"
            >
              {hint}
            </p>
          ) : null}

          {error ? <ErroCampo id={errorId}>{error}</ErroCampo> : null}

          {after ? <div className="flex">{after}</div> : null}
        </div>
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
          controlBase,
          "h-11",
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
          controlBase,
          "h-11 pr-11",
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
          "absolute top-0 right-0 flex size-11 items-center justify-center rounded-[var(--radius-sm)]",
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
        controlBase,
        "block min-h-[112px] resize-y py-[10px]",
        "leading-[var(--line-height-body)]",
        isInvalid && controlInvalid,
        className,
      )}
      {...rest}
    />
  );
}
