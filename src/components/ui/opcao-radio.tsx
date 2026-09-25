import { cn } from "@/lib/cn";

// Espelha as instâncias de ds/form/radio (m87SJ) do design-system.pen (direcção «B · Registo
// em linhas»): uma opção de escolha única com rótulo e descrição, altura ≥ $tap-target-min,
// padding $space-md, raio $radius-md, gap $space-sm, sem fundo por omissão.
// - Por escolher: contorno hairline $border-default; hover $border-strong.
// - Escolhida: contorno $accent-primary (hairline + fio interior de 1px, para a caixa não
//   saltar ao escolher) e fundo $accent-primary-subtle.
// - Círculo de 20 sem fundo (contorno $border-width-thick $border-strong; na escolhida
//   $accent-primary com o ponto de 8): é o controlo, não um marcador de texto.
// - Rótulo: body $font-weight-label $text-primary; Descrição: body $text-secondary.
//
// É um <input type="radio"> nativo (setas mudam a escolha dentro do grupo, espaço
// escolhe), escondido visualmente; o foco visível vai para a opção inteira.

export function OpcaoRadio({
  id,
  name,
  value,
  checked,
  onChange,
  label,
  description,
  describedBy,
  compacta = false,
}: {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
  description?: string;
  /** Id do erro do grupo (ds/form/erro-campo), ligado a cada opção. */
  describedBy?: string;
  /**
   * Opção só com rótulo (instâncias do passo 2 do Contacto): padding [$space-sm,
   * $space-md] e círculo centrado com o rótulo.
   */
  compacta?: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex w-full gap-sm rounded-[var(--radius-md)] border transition-colors",
        compacta ? "items-center px-md py-sm" : "items-start p-md",
        "has-[input:focus-visible]:[outline:var(--border-width-focus)_solid_var(--color-border-focus)]",
        "has-[input:focus-visible]:[outline-offset:var(--focus-ring-offset)]",
        checked
          ? "border-accent-primary bg-accent-primary-subtle shadow-[inset_0_0_0_1px_var(--color-accent-primary)]"
          : "border-border-default bg-transparent hover:border-border-strong",
      )}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        aria-describedby={describedBy}
        className="sr-only"
      />
      <span
        aria-hidden
        className={cn(
          compacta ? undefined : "mt-3xs",
          "flex size-5 shrink-0 items-center justify-center rounded-[var(--radius-pill)] border-2",
          checked ? "border-accent-primary" : "border-border-strong",
        )}
      >
        {checked ? <span className="size-2 rounded-[var(--radius-pill)] bg-accent-primary" /> : null}
      </span>
      <span className="flex min-w-0 flex-col gap-3xs">
        <span className="font-body text-body font-medium text-text-primary">{label}</span>
        {description ? (
          <span className="font-body text-body text-text-secondary">{description}</span>
        ) : null}
      </span>
    </label>
  );
}
