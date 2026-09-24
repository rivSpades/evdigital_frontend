import { getDictionary } from "@/i18n/dictionaries";
import { ButtonLink } from "@/components/ui/button";
import { Ligacao } from "@/components/ui/ligacao";

// Frames "v2 · A vez" / Ecrã · Início: "Secção · hero" (rFFQD desktop 1280, h6S10
// mobile 375). Sem fundo próprio (é o $bg-base da página), padding [$space-4xl, 0] em lg e
// [$space-2xl, 0, $space-3xl, 0] empilhado. Texto (gap $space-lg): overline $font-mono
// caption $text-tertiary com $letter-spacing-overline; título $font-size-display
// ($font-size-display-sm-narrow em mobile) $font-weight-display; subtítulo body-lg
// $text-secondary, 680 de largura em lg. Acções a $space-xl do texto: botão primário (56)
// e ds/action/ligacao primária, lado a lado com gap $space-lg em lg, empilhados com gap
// $space-md abaixo.
//
// Movimento: o título (LCP) e a overline estão visíveis desde o primeiro paint; o
// subtítulo e a acção entram com um fade curto por CSS (.reveal-load, globals.css), sem
// esperar por scroll nem pelo JavaScript.

export async function Hero() {
  const { common, home } = await getDictionary();
  const t = home.hero;
  return (
    <section aria-labelledby="hero-titulo" className="pt-2xl pb-3xl lg:py-4xl">
      <div className="flex flex-col gap-xl">
        <div className="flex flex-col gap-lg">
          <p className="font-mono text-caption tracking-[var(--letter-spacing-overline)] text-text-tertiary uppercase">
            {t.overline}
          </p>
          <h1
            id="hero-titulo"
            className="font-heading text-[length:var(--font-size-display-sm-narrow)] leading-[var(--line-height-display)] font-bold tracking-[var(--letter-spacing-headline)] text-text-primary lg:text-display lg:tracking-[var(--letter-spacing-display)]"
          >
            {t.title}
          </h1>
          <p className="reveal-load font-body text-body-lg text-text-secondary [--reveal-i:1] lg:max-w-[680px]">
            {t.lead}
          </p>
        </div>

        <div className="reveal-load flex flex-col items-start gap-md [--reveal-i:2] lg:flex-row lg:items-center lg:gap-lg">
          <ButtonLink href="/contacto" size="action" className="tracking-[var(--letter-spacing-label)]">
            {common.cta}
          </ButtonLink>
          <Ligacao href="/servicos" className="tracking-[var(--letter-spacing-label)]">
            {t.secondaryCta}
          </Ligacao>
        </div>
      </div>
    </section>
  );
}
