import { cn } from "@/lib/cn";

// Espelha ds/display/escrito-por (mKxYG) do design-system.pen (direcção "A vez"): quem
// escreveu e quando. Em linha, gap $space-2xs. Data em $font-mono caption $text-tertiary,
// dentro de <time> quando há `dateTime`.
// - tom "nota" (por baixo de um texto): padding-top $space-sm, Texto em caption
//   $text-tertiary.
// - tom "autor" (linha do autor de uma mensagem, antes do corpo): Texto em body
//   $text-primary $font-weight-body-strong, gap $space-sm, sem padding.

export function EscritoPor({
  texto,
  data,
  dateTime,
  tom = "nota",
}: {
  texto: string;
  data: string;
  dateTime?: string;
  tom?: "nota" | "autor";
}) {
  const autor = tom === "autor";
  const dataCls = "font-mono text-caption text-text-tertiary";
  return (
    <p className={cn("flex flex-wrap items-baseline", autor ? "gap-x-sm gap-y-2xs" : "gap-2xs pt-sm")}>
      <span
        className={cn(
          "font-body",
          autor
            ? "text-body font-semibold text-text-primary"
            : "text-caption tracking-[var(--letter-spacing-caption)] text-text-tertiary",
        )}
      >
        {texto}
      </span>
      {dateTime ? (
        <time dateTime={dateTime} className={dataCls}>
          {data}
        </time>
      ) : (
        <span className={dataCls}>{data}</span>
      )}
    </p>
  );
}
