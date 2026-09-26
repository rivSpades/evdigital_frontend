// Espelha ds/display/linha-salario (BTsCY) do design-system.pen: uma linha do bloco «Salário
// esperado». Termo à esquerda (body $text-secondary, entrelinha de label), valor à direita
// em $font-mono $font-size-body-lg $text-primary. Régua $border-default em baixo, padding
// [$space-md, 0], gap $space-lg, espaço entre os dois. A lista (`<dl>`) leva a régua de cima.
// Cada linha é opcional: sem valor não se desenha (nunca «Não indicado»).

export function LinhaSalario({ termo, valor }: { termo: string; valor: string }) {
  return (
    <div className="flex items-center justify-between gap-lg border-b border-border-default py-md">
      <dt className="font-body text-body leading-[var(--line-height-label)] text-text-secondary">
        {termo}
      </dt>
      <dd className="font-mono text-body-lg leading-[var(--line-height-label)] whitespace-nowrap text-text-primary">
        {valor}
      </dd>
    </div>
  );
}
