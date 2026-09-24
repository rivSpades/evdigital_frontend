import { getDictionary } from "@/i18n/dictionaries";
import { Reveal } from "@/components/ui/reveal";
import { ReguaPasso } from "@/components/ui/regua-passo";

// Frames "v2 · A vez" / Ecrã · Início: "Secção · como trabalhamos" (r37Xo desktop,
// g5AsDM mobile). Padding [$space-3xl, 0, $space-4xl, 0], gap $space-md.
// - Título em $text-secondary, $font-size-title-sm ($font-size-body-lg em mobile).
// - Régua: régua superior hairline $border-strong com quatro ds/display/regua-passo,
//   lado a lado em lg (gap $space-lg), empilhados abaixo.
// Só a descrição de cada passo (home.how.steps): sem verbos nem títulos por passo
// (decisão do dono, 2026-09-24; o .pen ainda os desenha, o React não).
//
// Movimento (quadro 04): título e a linha da régua (só opacidade); depois as
// quatro marcas batem uma a uma, cada uma seguida do seu passo (globals.css).

export async function ComoTrabalhamos() {
  const { home } = await getDictionary();
  const t = home.how;
  return (
    <Reveal
      as="section"
      aria-labelledby="como-trabalhamos-titulo"
      className="flex flex-col gap-md pt-3xl pb-4xl"
    >
      <h2
        id="como-trabalhamos-titulo"
        data-reveal=""
        className="font-heading text-body-lg leading-[var(--line-height-title)] font-semibold tracking-[var(--letter-spacing-title)] text-text-secondary lg:text-title-sm"
      >
        {t.title}
      </h2>

      <ol
        data-reveal="fade"
        className="flex flex-col border-t border-border-strong [--reveal-i:1] lg:flex-row lg:gap-lg"
      >
        {t.steps.map((texto, index) => (
          <ReguaPasso key={index} passo={index} texto={texto} />
        ))}
      </ol>
    </Reveal>
  );
}
