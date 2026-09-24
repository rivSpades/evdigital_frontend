import { cn } from "@/lib/cn";

// Espelha ds/form/escolha-hora (kHaxr) do design-system.pen (direcção "A vez"): uma hora
// escolhível do agendamento (Contacto, passo 2). Alvo de 44 de altura, $input-radius, Hora
// em $font-mono label $text-primary centrada. Sem marcador.
// - Por escolher: $bg-surface-sunken, contorno hairline $border-default.
// - Escolhida: $bg-surface-raised, contorno $border-width-thick $text-primary (segundo pixel
//   como fio interior).
// Em linha com largura a encher a coluna (grelha do contentor), gap $space-xs.

export function EscolhaHora({
  hora,
  escolhida,
  onEscolher,
}: {
  hora: string;
  escolhida: boolean;
  onEscolher: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={escolhida}
      onClick={onEscolher}
      className={cn(
        "flex h-11 w-full items-center justify-center",
        "rounded-[var(--input-radius)] border font-mono text-label leading-none text-text-primary transition-colors",
        escolhida
          ? "border-text-primary bg-bg-surface-raised shadow-[inset_0_0_0_1px_var(--color-text-primary)]"
          : "border-border-default bg-bg-surface-sunken hover:border-border-strong",
      )}
    >
      {hora}
    </button>
  );
}
