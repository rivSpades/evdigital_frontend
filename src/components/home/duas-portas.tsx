import { ArrowRight, Globe } from "lucide-react";
import { getDictionary } from "@/i18n/dictionaries";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LinkArrow } from "@/components/ui/link-arrow";

// Frames: "Secção · As duas portas" (yDekf / l8jvzE).
// A grelha do wide é deliberadamente assimétrica (660 / 516 dentro dos 1200 do
// $grid-max-width), não duas colunas iguais.
//
// `h2` invisível (`sr-only`): o `.pen` não desenha um título visível aqui — a secção é
// só os dois cartões, logo a seguir ao hero. Sem ele, a hierarquia de títulos saltava de
// h1 (Hero) para h3 (dentro dos cartões), o que o Lighthouse assinala como erro de
// acessibilidade (heading-order) — apanhado na auditoria de 2026-09-05.

export async function DuasPortas() {
  const { home } = await getDictionary();
  const t = home.doors;
  return (
    <section
      aria-labelledby="duas-portas-titulo"
      className="grid gap-md lg:grid-cols-[660fr_516fr] lg:gap-lg"
    >
      <h2 id="duas-portas-titulo" className="sr-only">
        {t.title}
      </h2>

      <Card
        surface="raised"
        highlight
        className="flex flex-col gap-sm p-lg lg:gap-md lg:p-xl"
      >
        <span className="flex size-12 items-center justify-center rounded-[var(--radius-md)] border border-border-interactive bg-accent-primary-subtle lg:size-14">
          <Globe size={24} strokeWidth={2} aria-hidden className="text-text-accent lg:size-7" />
        </span>

        <h3 className="font-heading text-title-sm font-semibold tracking-[var(--letter-spacing-title)] text-text-primary lg:text-title">
          {t.onlineTitle}
        </h3>

        <p className="font-body text-body text-text-secondary lg:text-body-lg">
          {t.onlineBody}
        </p>

        <ButtonLink
          href="/servicos#comecar"
          variant="secondary"
          className="h-12 w-full lg:w-auto lg:self-start"
        >
          {t.onlineCta}
          <ArrowRight size={20} strokeWidth={2} aria-hidden />
        </ButtonLink>
      </Card>

      <Card className="flex flex-col gap-sm p-lg lg:gap-md lg:p-xl">
        <h3 className="font-heading text-body-lg font-semibold tracking-[var(--letter-spacing-title)] text-text-primary lg:text-title-sm">
          {t.advancedTitle}
        </h3>

        <p className="font-body text-body text-text-secondary">
          {t.advancedBody}
        </p>

        <LinkArrow href="/servicos#avancadas">{t.advancedCta}</LinkArrow>
      </Card>
    </section>
  );
}
