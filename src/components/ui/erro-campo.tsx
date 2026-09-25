import { cn } from "@/lib/cn";

// Espelha ds/form/erro-campo (BbBvf) e a «Mensagem» de erro do ds/form/input-field nas
// folhas da direcção "A vez": glifo "!" funcional (círculo $feedback-error-fg de 18 com a
// letra a $bg-base) e texto em $font-size-caption $feedback-error-fg que diz como corrigir.
// Sempre abaixo do campo. Sem barra lateral, sem fundo.
//
// `role="alert"`: o erro nasce depois de submeter e tem de ser anunciado. O `id` liga-o ao
// controlo por `aria-describedby` (ver `Field`).

export function ErroCampo({
  id,
  children,
  className,
}: {
  id?: string;
  children: string;
  className?: string;
}) {
  return (
    <p id={id} role="alert" className={cn("flex gap-xs", className)}>
      <span aria-hidden className="shrink-0 pt-3xs">
        <span className="flex size-[18px] items-center justify-center rounded-[var(--radius-pill)] bg-feedback-error-fg font-body text-[length:var(--spacing-sm)] leading-none font-bold text-bg-base">
          !
        </span>
      </span>
      <span className="font-body text-caption text-feedback-error-fg">{children}</span>
    </p>
  );
}
