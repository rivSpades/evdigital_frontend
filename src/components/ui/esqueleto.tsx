import { cn } from "@/lib/cn";

// Espelha ds/feedback/esqueleto-bloco (MMOtP) e ds/feedback/esqueleto-linha (v3JAY) do
// design-system.pen (direcção "A vez"): blocos $bg-surface-raised sem brilho animado.
// - EsqueletoBloco: tamanho e raio por props (título 24 de altura, texto 16, cantos a
//   direito; o dia do calendário 68x72 com $input-radius).
// - EsqueletoLinha: linha de registo a carregar, dois blocos (título 24 e texto 16) com a
//   régua inferior hairline $border-default, padding [$space-lg, 0], gap $space-xs.
// São decorativos (aria-hidden): quem os usa marca a região com aria-busy.

export function EsqueletoBloco({ className }: { className?: string }) {
  return <span aria-hidden className={cn("block bg-bg-surface-raised", className)} />;
}

export function EsqueletoLinha({
  titleWidth = "w-1/2",
  textWidth = "w-5/6",
  single = false,
}: {
  titleWidth?: string;
  textWidth?: string;
  single?: boolean;
}) {
  return (
    <div aria-hidden className="flex flex-col gap-xs border-b border-border-default py-lg">
      <EsqueletoBloco className={cn("h-6", titleWidth)} />
      {single ? null : <EsqueletoBloco className={cn("h-4", textWidth)} />}
    </div>
  );
}
