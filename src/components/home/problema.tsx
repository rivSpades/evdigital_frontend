// Frames: "Secção · O problema" (G2Oyq / m6WAAO).
// O fio de destaque é o único elemento decorativo da secção: 8px de altura, raio
// $radius-pill, $accent-primary.

import { getDictionary } from "@/i18n/dictionaries";

export async function Problema() {
  const { home } = await getDictionary();
  const t = home.problem;
  return (
    <section
      aria-labelledby="problema-afirmacao"
      className="flex flex-col gap-md lg:gap-lg"
    >
      <span className="h-2 w-[72px] rounded-[var(--radius-pill)] bg-accent-primary lg:w-[88px]" />

      <h2
        id="problema-afirmacao"
        className="font-heading text-title leading-[var(--line-height-headline)] font-bold tracking-[var(--letter-spacing-headline)] text-text-primary lg:max-w-[900px] lg:text-display-sm lg:leading-[var(--line-height-headline)]"
      >
        {t.title}
      </h2>

      <p className="font-body text-body text-text-secondary lg:max-w-[820px] lg:text-body-lg">
        {t.body}
      </p>
    </section>
  );
}
