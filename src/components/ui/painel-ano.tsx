import { cn } from "@/lib/cn";

// Espelha ds/display/painel-ano (S16w3N) do design-system.pen: o painel da coluna sticky do
// Percurso (só lg+, coluna de 278). Régua superior hairline $border-default, padding-top
// $space-md, gap $space-xs: Ano $font-heading $font-weight-display $font-size-display-lg
// $letter-spacing-display; Organização body $font-weight-label $text-secondary; Posição
// (N/M, formato do passo-assistente) mono caption $text-tertiary.
// aria-hidden: repete o texto da etapa actual. A troca de etapa é só opacity
// ($motion-duration-fast), sem deslizar: quem usa muda a `key` e o conteúdo entra com
// `.percurso-troca` (globals.css).

export function PainelAno({
  ano,
  organizacao,
  posicao,
  animar,
  className,
}: {
  ano: string;
  organizacao: string;
  posicao: string;
  /** Crossfade ao trocar (só com movimento ligado). */
  animar: boolean;
  className?: string;
}) {
  return (
    <div aria-hidden className={cn("border-t border-border-default pt-md", className)}>
      <div className={cn("flex flex-col gap-xs", animar && "percurso-troca")}>
        <p className="font-heading text-display-lg leading-[var(--line-height-display)] font-bold tracking-[var(--letter-spacing-display)] text-text-primary">
          {ano}
        </p>
        <p className="font-body text-body leading-[var(--line-height-label)] font-medium text-text-secondary">
          {organizacao}
        </p>
        <p className="font-mono text-caption leading-[var(--line-height-caption)] text-text-tertiary">
          {posicao}
        </p>
      </div>
    </div>
  );
}
