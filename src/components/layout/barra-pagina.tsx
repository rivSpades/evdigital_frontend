import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { BackLink } from "@/components/area-cliente/back-link";

// Primeira linha de cada página do site público, por baixo do Nav: a seta «voltar» e, AO
// LADO dela, o título da página (o h1). Barra sticky com fundo opaco, para o título e a
// saída ficarem sempre visíveis ao fazer scroll — o mesmo padrão de PaginaFormulario na Área
// de Cliente (design-guardrails.md §6, pedido do dono 2026-09-24), agora nas páginas públicas
// (pedido do dono, 2026-09-25: o título já não abre o corpo da página em display grande).
//
// - Vai dentro do <main> (que tem as margens da página): as margens negativas fazem o fundo
//   sangrar até às bordas e o conteúdo da barra volta a alinhar-se com a margem da página.
// - top-18 = altura do Nav (h-18) que é sticky em top-0.
// - Títulos longos (fichas) quebram até 2 linhas; o texto completo fica sempre no DOM.
// - Sem `href`, a seta é um botão (`onClick`): volta a um estado anterior da mesma rota
//   (passos do assistente de Contacto).

const tituloClasses =
  "min-w-0 line-clamp-2 font-heading text-title-sm leading-[var(--line-height-title)] font-semibold tracking-[var(--letter-spacing-title)] text-text-primary md:text-title";

export function BarraPagina({
  titulo,
  voltarLabel,
  voltarHref,
  onVoltar,
  voltarDisabled,
  tituloComoH1 = true,
  className,
}: {
  titulo: ReactNode;
  voltarLabel: string;
  voltarHref?: string;
  onVoltar?: () => void;
  voltarDisabled?: boolean;
  /** false: o título da barra é só um rótulo (`<p>`) e o h1 da página vive no corpo. */
  tituloComoH1?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "sticky top-18 z-30 -mx-lg bg-bg-base px-lg md:-mx-xl md:px-xl lg:-mx-2xl lg:px-2xl",
        className,
      )}
    >
      <div className="mx-auto flex min-h-14 w-full max-w-[var(--grid-max-width)] items-center gap-x-md py-2xs md:gap-x-lg">
        <BackLink
          href={voltarHref}
          onClick={onVoltar}
          disabled={voltarDisabled}
          label={voltarLabel}
        />
        {tituloComoH1 ? (
          <h1 className={tituloClasses}>{titulo}</h1>
        ) : (
          <p className={tituloClasses}>{titulo}</p>
        )}
      </div>
    </div>
  );
}
