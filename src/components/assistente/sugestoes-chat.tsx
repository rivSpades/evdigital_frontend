import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

// Espelha ds/display/sugestoes-chat (TXnhf) do design-system.pen (assistente «O balcão»): as
// sugestões de ação do assistente, no padrão «Registo em linhas» (régua por cima, linhas a toda
// a largura, rótulo em $text-primary e seta em $text-secondary), instâncias de
// ds/display/linha-accao em modo sugestão. É o MESMO componente das 3 perguntas iniciais do
// estado vazio e das sugestões por baixo da última resposta. Tocar envia a frase como mensagem do
// visitante. Hover: fundo $bg-surface-hover (sem verde); foco: anel $border-focus (o único
// verde); sem estado desactivado (uma sugestão que não se pode usar não se mostra). Entrada:
// opacidade e 4px de subida em 180 ms, escalonada de 70 ms (só opacidade com
// prefers-reduced-motion); `entrada` só nas sugestões pós-resposta.

export function SugestoesChat({
  itens,
  rotulo,
  onEscolher,
  entrada = false,
  className,
}: {
  itens: string[];
  /** Nome acessível do grupo («Sugestões de resposta»). */
  rotulo: string;
  onEscolher: (frase: string) => void;
  entrada?: boolean;
  className?: string;
}) {
  return (
    <ul
      role="group"
      aria-label={rotulo}
      className={cn("border-t border-border-default", className)}
    >
      {itens.map((frase, i) => (
        <li
          key={frase}
          className={entrada ? "sugestao-entra" : undefined}
          style={{ "--i": i } as CSSProperties}
        >
          <button
            type="button"
            onClick={() => onEscolher(frase)}
            className="group flex min-h-11 w-full cursor-pointer items-center justify-between gap-lg border-b border-border-default py-md text-left font-body text-label font-medium text-text-primary transition-colors hover:bg-bg-surface-hover active:bg-bg-surface-pressed focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-border-focus focus-visible:ring-inset"
          >
            <span>{frase}</span>
            <ArrowRight
              aria-hidden
              className="size-5 shrink-0 text-text-secondary"
              strokeWidth={1.5}
            />
          </button>
        </li>
      ))}
    </ul>
  );
}
