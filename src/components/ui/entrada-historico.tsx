import { EstadoTexto, type EstadoTextoTom } from "@/components/ui/estado-texto";
import { cn } from "@/lib/cn";

// Espelha ds/display/entrada-historico (NqDYn) do design-system.pen (direcção "A vez"): uma
// mudança de estado do pedido como linha de registo. Régua inferior hairline
// $border-default (a superior é do contentor), padding [$space-md, 0].
// - Data: $font-mono caption $text-tertiary (coluna de 202 em lg)
// - Estado: ds/display/estado-texto, só a palavra (coluna de 202 em lg)
// - Explicação: body $text-secondary
// Em lg as três em linha com gap $space-lg; abaixo de lg (instâncias de 375) empilhadas
// com gap $space-2xs. A entrada actual tem padding-left $space-md (override "Entrada
// actual" do .pen). O "Quem" do .pen ("por si", "por EvDigital") não tem frase no React e
// fica de fora.

export function EntradaHistorico({
  data,
  estado,
  estadoTom,
  explicacao,
  actual = false,
}: {
  data: string;
  estado: string;
  estadoTom: EstadoTextoTom;
  explicacao?: string;
  actual?: boolean;
}) {
  return (
    <li
      className={cn(
        "flex flex-col gap-2xs border-b border-border-default py-md lg:flex-row lg:gap-lg",
        actual && "pl-md",
      )}
    >
      <p className="font-mono text-caption text-text-tertiary lg:w-[202px] lg:shrink-0">{data}</p>
      <div className="lg:w-[202px] lg:shrink-0">
        <EstadoTexto tom={estadoTom}>{estado}</EstadoTexto>
      </div>
      {explicacao ? (
        <p className="min-w-0 font-body text-body text-text-secondary lg:flex-1">{explicacao}</p>
      ) : null}
    </li>
  );
}
