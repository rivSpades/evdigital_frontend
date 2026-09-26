import { cn } from "@/lib/cn";

// Espelha ds/display/linha-detalhe (iadD3; variantes em po0Qk) do design-system.pen: linha de
// registo rótulo/valor para listas curtas de detalhe (Idiomas e Habilitações do consultor).
// Irmã de ds/display/linha-salario (ui/linha-salario.tsx): padding [$space-md, 0], gap
// $space-lg, régua $border-default em baixo (a lista, `<dl>`, leva a régua de cima).
// - Termo: $font-body body, $font-weight-label, $text-primary, entrelinha de label; ocupa o
//   espaço livre e parte linha se for longo.
// - Valor: $font-body body (sem mono, não é número), $text-secondary, alinhado à direita.
//   Opcional: sem valor não se vê (ex. «Carta de condução»), nunca «Não indicado».
// - `empilhada` (override das Habilitações e de valores longos): vertical, gap $space-3xs,
//   Valor por baixo alinhado à esquerda.
// Só leitura: sem hover nem foco, sem marcador antes do texto.

export function LinhaDetalhe({
  termo,
  valor,
  empilhada = false,
}: {
  termo: string;
  valor?: string;
  empilhada?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex border-b border-border-default py-md",
        empilhada ? "flex-col gap-3xs" : "flex-row items-start justify-between gap-lg",
      )}
    >
      <dt
        className={cn(
          "min-w-0 font-body text-body leading-[var(--line-height-label)] font-medium text-text-primary",
          !empilhada && "flex-1",
        )}
      >
        {termo}
      </dt>
      {valor ? (
        <dd
          className={cn(
            "min-w-0 font-body text-body leading-[var(--line-height-label)] text-text-secondary",
            empilhada ? "text-left" : "text-right",
          )}
        >
          {valor}
        </dd>
      ) : (
        // Um grupo do <dl> precisa de dt e dd: sem valor fica um dd escondido e vazio.
        <dd hidden />
      )}
    </div>
  );
}
