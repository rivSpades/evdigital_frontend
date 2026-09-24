import type { ComponentPropsWithoutRef, CSSProperties } from "react";
import { Ligacao } from "@/components/ui/ligacao";
import { cn } from "@/lib/cn";

// Espelha ds/display/porta (nKv3F) do design-system.pen (direcção "A vez"): uma porta de
// entrada da Início. Vertical, gap $space-md. Anatomia:
// - Quem (opcional): $font-body caption $text-tertiary
// - Frase: a voz do visitante entre aspas, $font-heading $font-weight-heading
//   $font-size-headline ($font-size-headline-narrow abaixo de lg), entrelinha e
//   espaçamento de headline. As aspas são as do .pen (“ ”), via <q>: não fazem parte do
//   texto do dicionário e o leitor de ecrã lê a frase como citação.
// - Descrição: $font-body body $text-secondary, no máximo 512 de largura (nó OuuJa)
// - Ligação: ds/action/ligacao primária com padding-top $space-sm
//
// Padding: [$space-xl, $space-md, $space-xl, 0] empilhada (instância mobile) e
// [$space-2xl, 0] lado a lado (lg). As réguas entre portas são do contentor.

const QUOTES: CSSProperties = { quotes: '"\\201C" "\\201D"' };

export function Porta({
  quem,
  frase,
  descricao,
  href,
  ligacao,
  className,
  ...rest
}: {
  quem?: string;
  frase: string;
  descricao: string;
  href: string;
  ligacao: string;
} & Omit<ComponentPropsWithoutRef<"div">, "children">) {
  return (
    <div
      className={cn("flex flex-col gap-md py-xl pr-md lg:py-2xl lg:pr-0", className)}
      {...rest}
    >
      {quem ? (
        <p className="font-body text-caption tracking-[var(--letter-spacing-caption)] text-text-tertiary">
          {quem}
        </p>
      ) : null}
      <h3 className="font-heading text-title leading-[var(--line-height-headline)] font-semibold tracking-[var(--letter-spacing-headline)] text-text-primary lg:text-headline">
        <q style={QUOTES}>{frase}</q>
      </h3>
      <p className="font-body text-body text-text-secondary lg:max-w-[512px]">{descricao}</p>
      <div className="pt-sm">
        <Ligacao href={href} className="tracking-[var(--letter-spacing-label)]">
          {ligacao}
        </Ligacao>
      </div>
    </div>
  );
}
