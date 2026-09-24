import { cn } from "@/lib/cn";

// Espelha as instâncias de ds/form/radio (m87SJ) nas folhas de "Novo pedido" do
// design-system.pen (direcção "A vez"): uma opção de escolha única com rótulo e descrição,
// padding $space-md, $input-radius, gap $space-sm.
// - Por escolher: $bg-surface-sunken com contorno hairline $border-default (interior).
// - Escolhida: $bg-surface-raised com contorno $border-width-thick $text-primary. Em CSS o
//   segundo pixel é um fio interior (inset box-shadow), para a caixa não saltar ao escolher.
// - Círculo de 20 ($bg-surface-sunken, contorno $border-width-thick $border-strong; na
//   escolhida $accent-primary com o ponto de 8): é o controlo, não um marcador de texto.
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
        "flex w-full gap-sm rounded-[var(--input-radius)] border transition-colors",
        compacta ? "items-center px-md py-sm" : "items-start p-md",
        "has-[input:focus-visible]:[outline:var(--border-width-focus)_solid_var(--color-border-focus)]",
        "has-[input:focus-visible]:[outline-offset:var(--focus-ring-offset)]",
        checked
          ? "border-text-primary bg-bg-surface-raised shadow-[inset_0_0_0_1px_var(--color-text-primary)]"
          : "border-border-default bg-bg-surface-sunken hover:border-border-strong",
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
          "flex size-5 shrink-0 items-center justify-center rounded-[var(--radius-pill)] border-2 bg-bg-surface-sunken",
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
