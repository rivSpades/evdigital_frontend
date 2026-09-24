import type { ReactNode } from "react";
import Link from "@/i18n/locale-link";
import { EstadoTexto, type EstadoTextoTom } from "@/components/ui/estado-texto";
import { cn } from "@/lib/cn";

// Espelha ds/display/registo-linha (suwKI) do design-system.pen (direcção "A vez"): um
// registo como linha, não cartão. Régua inferior hairline $border-default (a superior é do
// contentor `Registo`). Sem fundo, sem marcador antes do texto: o estado é a palavra
// (ds/display/estado-texto). A linha inteira é a ligação para o detalhe.
//
// Duas variantes, as duas famílias de instâncias do ecrã "Os seus projetos":
// - "projeto" (Registo · projetos): Corpo com padding [$space-lg, $space-md, $space-lg, 0].
//   Em lg, em linha com gap $space-lg: Estado (coluna de 172, padding-top $space-2xs),
//   Identificação (368: Nome em Sora $font-size-body-lg $font-weight-heading e Serviço em
//   caption $text-tertiary), Mudança (body $text-secondary, o resto da largura) e Data
//   (172, à direita, $font-mono caption $text-tertiary). Abaixo de lg (instâncias de 375)
//   tudo empilhado com gap $space-2xs e a Data à esquerda.
// - "pedido" (Registo · pedidos): Corpo com padding [$space-sm, 0]. Em lg, em linha com
//   gap $space-lg: Identificação (Ref em $font-mono caption $text-tertiary com 148 de
//   largura, Nome em body $text-primary e, opcional, o Tipo em caption $text-tertiary),
//   Estado final (172, padding-top $space-2xs) e Data (172, à direita). Abaixo de lg:
//   Identificação empilhada (gap $space-2xs), Estado por baixo (gap $space-md) e sem Data.

export function Registo({ children, className }: { children: ReactNode; className?: string }) {
  return <ul className={cn("flex flex-col border-t border-border-default", className)}>{children}</ul>;
}

type Comum = {
  href: string;
  nome: string;
  estado: string;
  estadoTom: EstadoTextoTom;
  data?: string;
};

export function RegistoLinha(
  props:
    | (Comum & {
        variante: "projeto";
        servico: string;
        mudanca?: string;
        /** Nome em $text-secondary (projeto entregue). */
        nomeApagado?: boolean;
      })
    | (Comum & { variante: "pedido"; referencia: string; tipo?: string }),
) {
  const { href, nome, estado, estadoTom, data } = props;

  if (props.variante === "projeto") {
    return (
      <li className="border-b border-border-default">
        <Link
          href={href}
          className="group flex flex-col gap-2xs py-lg pr-md lg:flex-row lg:gap-lg"
        >
          <div className="lg:w-[172px] lg:shrink-0 lg:pt-2xs">
            <EstadoTexto tom={estadoTom}>{estado}</EstadoTexto>
          </div>
          <div className="flex flex-col gap-2xs lg:w-[368px] lg:shrink-0">
            <h2
              className={cn(
                "font-heading text-body-lg leading-[var(--line-height-title)] font-semibold tracking-[var(--letter-spacing-title)] underline-offset-4 group-hover:underline",
                props.nomeApagado ? "text-text-secondary" : "text-text-primary",
              )}
            >
              {nome}
            </h2>
            <p className="font-body text-caption tracking-[var(--letter-spacing-caption)] text-text-tertiary">
              {props.servico}
            </p>
          </div>
          <p className="min-w-0 font-body text-body text-text-secondary lg:flex-1">
            {props.mudanca}
          </p>
          {data ? (
            <p className="font-mono text-caption text-text-tertiary lg:w-[172px] lg:shrink-0 lg:pt-2xs lg:text-right">
              {data}
            </p>
          ) : null}
        </Link>
      </li>
    );
  }

  return (
    <li className="border-b border-border-default">
      <Link
        href={href}
        className="group flex flex-col gap-md py-sm lg:flex-row lg:items-start lg:gap-lg"
      >
        <div className="flex min-w-0 flex-col gap-2xs lg:flex-1 lg:flex-row lg:items-baseline lg:gap-lg">
          <p className="font-mono text-caption text-text-tertiary lg:w-[148px] lg:shrink-0">
            {props.referencia}
          </p>
          <p className="min-w-0 font-body text-body">
            <span className="text-text-primary underline-offset-4 group-hover:underline">{nome}</span>
            {props.tipo ? (
              <span className="text-caption tracking-[var(--letter-spacing-caption)] text-text-tertiary">
                {" "}
                · {props.tipo}
              </span>
            ) : null}
          </p>
        </div>
        <div className="lg:w-[172px] lg:shrink-0 lg:pt-2xs">
          <EstadoTexto tom={estadoTom}>{estado}</EstadoTexto>
        </div>
        {data ? (
          <p className="hidden font-mono text-caption text-text-tertiary lg:block lg:w-[172px] lg:shrink-0 lg:pt-2xs lg:text-right">
            {data}
          </p>
        ) : null}
      </Link>
    </li>
  );
}
