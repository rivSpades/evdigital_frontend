// Espelha ds/display/divisor-texto (bgnaS) do design-system.pen (direcção "A vez"): duas
// linhas hairline $border-default com uma palavra ao meio ($font-size-caption,
// $text-tertiary), gap $space-sm. Separa duas vias equivalentes (ex. "Continuar com
// Google" ou email no Entrar). Decorativo para leitores de ecrã: as duas vias já se
// anunciam sozinhas.

export function DivisorTexto({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-sm" aria-hidden>
      <span className="h-px flex-1 bg-border-default" />
      <span className="font-body text-caption tracking-[var(--letter-spacing-caption)] text-text-tertiary">
        {children}
      </span>
      <span className="h-px flex-1 bg-border-default" />
    </div>
  );
}
