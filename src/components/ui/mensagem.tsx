import { EscritoPor } from "@/components/ui/escrito-por";

// Uma mensagem da conversa do Detalhe do pedido, em texto aberto (design-guardrails §4:
// sem cartões com contorno para blocos de conteúdo; decisão do dono 2026-09-24).
// Sem fundo, sem contorno, sem cantos: padding vertical $space-lg, gap $space-xs, e uma
// régua hairline $border-default em cima só a partir da segunda mensagem (nunca lateral).
// - Linha do autor: ds/display/escrito-por em tom "autor" (nome body $text-primary com
//   peso, data/hora $font-mono caption $text-tertiary em <time>).
// - Texto: body $text-primary.
// Cliente e equipa têm o mesmo estilo e a mesma coluna (largura máxima 704): distinguem-se
// só pelo nome do autor.

export function Mensagem({
  autor,
  hora,
  dataHora,
  texto,
}: {
  autor: string;
  hora: string;
  /** ISO 8601 da mensagem, para o atributo dateTime do <time>. */
  dataHora: string;
  texto: string;
}) {
  return (
    <li className="flex w-full max-w-[704px] flex-col gap-xs border-t border-border-default py-lg first:border-t-0">
      <EscritoPor tom="autor" texto={autor} data={hora} dateTime={dataHora} />
      <p className="font-body text-body whitespace-pre-line text-text-primary">{texto}</p>
    </li>
  );
}
