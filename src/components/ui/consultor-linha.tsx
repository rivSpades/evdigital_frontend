import { ArrowRight } from "lucide-react";
import { Retrato } from "@/components/ui/retrato";
import Link from "@/i18n/locale-link";

// Espelha ds/display/consultor-linha (j9YLd) do design-system.pen: uma linha da lista
// /consultants (registo em linhas, não cartão). A linha inteira é a ligação para o detalhe
// (nome acessível = nome do consultor + headline); a seta é só indicação visual.
// - Régua $border-default em baixo (a lista leva a régua de cima), padding [$space-lg, 0],
//   gap $space-lg ($space-md em mobile), itens ao centro.
// - Retrato 64x80 (56x70 em mobile, override YoekC do frame tzkFv).
// - Texto (gap $space-2xs): Nome $font-heading $font-weight-heading $font-size-title-sm
//   ($font-size-body-lg em mobile) $letter-spacing-title; Headline body $text-secondary.
// - Seta: caixa 44x44 com lucide arrow-right 20 $text-secondary.
// - Hover: fundo $bg-surface-hover e seta em $text-primary.

export function ConsultorLinha({
  href,
  nome,
  headline,
  foto,
  iniciais,
}: {
  href: string;
  nome: string;
  headline: string;
  foto: string | null;
  iniciais: string;
}) {
  return (
    <li className="border-b border-border-default">
      <Link
        href={href}
        className="group flex items-center gap-md py-lg transition-colors hover:bg-bg-surface-hover md:gap-lg"
      >
        <Retrato
          src={foto}
          nome={nome}
          iniciais={iniciais}
          decorativa
          sizes="64px"
          className="h-[70px] w-14 md:h-20 md:w-16"
        />
        <span className="flex min-w-0 flex-1 flex-col gap-2xs">
          <span className="font-heading text-body-lg leading-[var(--line-height-title)] font-semibold tracking-[var(--letter-spacing-title)] text-text-primary md:text-title-sm">
            {nome}
          </span>
          <span className="font-body text-body text-text-secondary">{headline}</span>
        </span>
        <span
          aria-hidden
          className="flex size-11 shrink-0 items-center justify-center text-text-secondary transition-colors group-hover:text-text-primary"
        >
          <ArrowRight size={20} strokeWidth={2} />
        </span>
      </Link>
    </li>
  );
}
