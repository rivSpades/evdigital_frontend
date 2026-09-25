import { ArrowRight } from "lucide-react";
import Link from "@/i18n/locale-link";
import { cn } from "@/lib/cn";

// Espelha ds/display/servico-linha (Y0wJWK) do design-system.pen (direcção "A vez"): um
// serviço do catálogo como linha de registo, não cartão. A linha inteira é a ligação para
// a ficha. Padding [$space-lg, 0], régua inferior hairline $border-default (a superior é
// do contentor Registo). Sem ícone em quadrado, sem fundo, sem verde.
// - Título: $font-heading title-sm $font-weight-heading $text-primary, numa coluna de
//   368 ("larga", registo a toda a largura) ou 280 ("margem", registo na coluna principal
//   ao lado da Margem): larguras dos nós ePnEL do .pen.
// - Resumo: $font-body body $text-secondary.
// - Seta: Lucide arrow-right 20 $text-secondary num alvo de $tap-target-min, depois do
//   texto (funcional, não marcador).
// Abaixo de md (override mobile): texto empilhado (gap $space-xs) e a Seta mantém-se à
// direita, centrada na linha — é ela que diz que a linha é uma ligação (sem hover em touch).

export function ServicoLinha({
  href,
  titulo,
  resumo,
  coluna = "larga",
}: {
  href: string;
  titulo: string;
  resumo: string;
  coluna?: "larga" | "margem";
}) {
  return (
    <li className="border-b border-border-default">
      <Link
        href={href}
        className="group flex items-center gap-md py-lg md:items-start md:gap-lg"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-xs md:flex-row md:gap-lg">
          <h3
            className={cn(
              "font-heading text-title-sm font-semibold tracking-[var(--letter-spacing-title)] text-text-primary md:shrink-0",
              coluna === "larga" ? "md:w-[368px]" : "md:w-[280px]",
            )}
          >
            {titulo}
          </h3>
          {resumo ? (
            <p className="font-body text-body text-text-secondary transition-colors group-hover:text-text-primary md:flex-1">
              {resumo}
            </p>
          ) : (
            <span className="md:flex-1" />
          )}
        </div>
        <span
          aria-hidden
          className="flex size-11 shrink-0 items-center justify-center text-text-primary transition-transform group-hover:translate-x-1 group-active:translate-x-1 md:text-text-secondary md:group-hover:text-text-primary"
        >
          <ArrowRight size={20} strokeWidth={2} />
        </span>
      </Link>
    </li>
  );
}
