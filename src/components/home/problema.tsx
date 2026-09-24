import { getDictionary } from "@/i18n/dictionaries";
import { Reveal } from "@/components/ui/reveal";

// Frames "v2 · A vez" / Ecrã · Início: "Secção · o problema" (m7gWwY desktop, YiKiJ
// mobile). Padding [$space-4xl, 0] em lg e [$space-3xl, 0] abaixo. Em lg o texto vive na
// coluna principal da grelha de 12 (colunas 4 a 12; a Margem das colunas 1 a 3 fica
// vazia, gutter $space-layout-gutter-wide). Título $font-size-headline
// ($font-size-title-sm em mobile) $font-weight-heading, 624 de largura em lg; texto
// body-lg $text-secondary, 760 em lg; gap $space-lg. Sem nenhum elemento decorativo.
//
// Movimento (quadro 03): a afirmação sozinha, a explicação 70 ms depois.

export async function Problema() {
  const { home } = await getDictionary();
  const t = home.problem;
  return (
    <Reveal
      as="section"
      aria-labelledby="problema-titulo"
      className="py-3xl lg:grid lg:grid-cols-12 lg:gap-x-lg lg:py-4xl"
    >
      <div className="flex flex-col gap-lg lg:col-span-9 lg:col-start-4">
        <h2
          id="problema-titulo"
          data-reveal=""
          className="font-heading text-title-sm font-semibold tracking-[var(--letter-spacing-title)] text-text-primary lg:max-w-[624px] lg:text-headline lg:tracking-[var(--letter-spacing-headline)]"
        >
          {t.title}
        </h2>
        <p
          data-reveal=""
          className="font-body text-body-lg text-text-secondary [--reveal-i:1] lg:max-w-[760px]"
        >
          {t.body}
        </p>
      </div>
    </Reveal>
  );
}
