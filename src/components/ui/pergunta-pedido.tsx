// Espelha ds/display/pergunta-pedido (FwMXx) do design-system.pen (direcção "A vez"): o
// que a equipa perguntou (ou o motivo de um pedido que não avança), citado dentro do bloco
// da vez. Texto aberto (design-guardrails §4: sem caixa, sem borda lateral): só uma régua
// hairline $border-default em cima, padding-top $space-md, gap $space-2xs, largura
// máxima 640.
// - Quem: $font-mono caption $text-tertiary
// - Texto: body $text-primary

export function PerguntaPedido({ quem, texto }: { quem: string; texto: string }) {
  return (
    <div className="flex w-full max-w-[640px] flex-col gap-2xs border-t border-border-default pt-md">
      <p className="font-mono text-caption text-text-tertiary">{quem}</p>
      <p className="font-body text-body whitespace-pre-line text-text-primary">{texto}</p>
    </div>
  );
}
