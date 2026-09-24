import { getDictionary } from "@/i18n/dictionaries";
import { BlocoDaVez } from "@/components/ui/bloco-da-vez";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

// Frames "v2 · A vez" / Ecrã · Início: "Secção · fecho" (OIE0Z desktop, z8TLK mobile).
// Padding [$space-2xl, 0, $space-4xl, 0]. Um ds/layout/bloco-da-vez empilhado: em lg na
// coluna principal da grelha (colunas 4 a 12, a Margem fica vazia), abaixo a toda a
// largura. Frase ($font-size-title, $font-size-title-sm em mobile) e o controlo primário
// "Fale connosco" (56) com padding-top $space-xs. O facto do .pen não tem frase no React
// e fica de fora; a frase é a do fecho da Início (home.finalCta.body).
//
// Movimento (quadro 06): a régua aparece primeiro, só com opacidade; depois a frase e,
// por fim, o botão.

export async function CtaFinal() {
  const { common, home } = await getDictionary();
  return (
    <Reveal
      as="section"
      aria-labelledby="fecho-titulo"
      className="pt-2xl pb-4xl lg:grid lg:grid-cols-12 lg:gap-x-lg"
    >
      <BlocoDaVez
        reveal
        titleAs="h2"
        titleId="fecho-titulo"
        title={home.finalCta.body}
        className="lg:col-span-9 lg:col-start-4"
      >
        <div data-reveal="" className="flex pt-xs [--reveal-i:2]">
          <ButtonLink
            href="/contacto"
            size="action"
            className="tracking-[var(--letter-spacing-label)]"
          >
            {common.cta}
          </ButtonLink>
        </div>
      </BlocoDaVez>
    </Reveal>
  );
}
