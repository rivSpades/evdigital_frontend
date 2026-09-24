import { cn } from "@/lib/cn";

// Espelha ds/display/estado-texto (qvGBo) do design-system.pen (direcção "A vez"): o
// estado diz-se só com a PALAVRA, em $font-body caption com $letter-spacing-caption. Sem
// glifo, ponto, losango nem cor de marca antes do texto (design-guardrails.md §4).
// Tons (overrides da Palavra no .pen): primario ("Em produção", "Em curso") | secundario
// ("Recebido") | terciario ("Em pausa", "Não avança") | destaque (o estado que pede uma
// resposta ao cliente, "À espera de si": no .pen é $font-weight-display; aqui fica em
// $text-primary e só o peso o distingue, sem verde: o verde fica para botão, foco e ligação).

export type EstadoTextoTom = "primario" | "secundario" | "terciario" | "destaque";

const tomClasses: Record<EstadoTextoTom, string> = {
  primario: "text-text-primary",
  secundario: "text-text-secondary",
  terciario: "text-text-tertiary",
  destaque: "font-semibold text-text-primary",
};

export function EstadoTexto({
  children,
  tom = "secundario",
  className,
}: {
  children: string;
  tom?: EstadoTextoTom;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-body text-caption tracking-[var(--letter-spacing-caption)]",
        tomClasses[tom],
        className,
      )}
    >
      {children}
    </p>
  );
}
