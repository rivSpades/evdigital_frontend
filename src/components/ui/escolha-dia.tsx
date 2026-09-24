import { cn } from "@/lib/cn";

// Espelha ds/form/escolha-dia (vdLWY) do design-system.pen (direcção "A vez"): um dia
// escolhível do agendamento (Contacto, passo 2). Cartão de 68 x 72, $input-radius, gap
// $space-3xs, conteúdo centrado: Dia da semana (body caption $letter-spacing-caption
// $text-tertiary), Dia ($font-mono body-lg, entrelinha de title, $text-primary) e Mês (mono
// caption $text-tertiary). Sem marcador.
// - Por escolher: $bg-surface-sunken, contorno hairline $border-default.
// - Escolhido: $bg-surface-raised, contorno $border-width-thick $text-primary (o segundo
//   pixel é um fio interior, para o cartão não saltar ao escolher).
// Em grupo numa linha com gap $space-xs que desliza na horizontal (ver o contentor).

export function EscolhaDia({
  diaSemana,
  dia,
  mes,
  rotulo,
  escolhido,
  onEscolher,
}: {
  diaSemana: string;
  dia: string;
  mes: string;
  /** Data por extenso, para leitores de ecrã. */
  rotulo: string;
  escolhido: boolean;
  onEscolher: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={escolhido}
      aria-label={rotulo}
      onClick={onEscolher}
      className={cn(
        "flex h-[72px] w-[68px] shrink-0 flex-col items-center justify-center gap-3xs",
        "rounded-[var(--input-radius)] border transition-colors",
        escolhido
          ? "border-text-primary bg-bg-surface-raised shadow-[inset_0_0_0_1px_var(--color-text-primary)]"
          : "border-border-default bg-bg-surface-sunken hover:border-border-strong",
      )}
    >
      <span className="font-body text-caption tracking-[var(--letter-spacing-caption)] text-text-tertiary">
        {diaSemana}
      </span>
      <span className="font-mono text-body-lg leading-[var(--line-height-title)] text-text-primary">
        {dia}
      </span>
      <span className="font-mono text-caption text-text-tertiary">{mes}</span>
    </button>
  );
}
