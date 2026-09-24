import { ReguaPasso } from "@/components/ui/regua-passo";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

// "Secção · como funciona" da ficha (E5Fid desktop, vwlOT mobile, grupo "Ecrã · Serviço
// (ficha)" de "v2 · A vez"): só com `genericProcess` no frontmatter. Gap $space-md,
// padding-bottom $space-4xl ($space-3xl em mobile). Título $font-size-headline
// ($font-size-title em mobile) e a régua: régua superior hairline $border-strong com os
// quatro ds/display/regua-passo, lado a lado em lg (gap $space-lg), empilhados abaixo.
// Os passos são as descrições de home.how.steps (as mesmas da Início), sem verbos nem
// títulos por passo. Sem scroll reveal.

export async function ComoFunciona({ lang }: { lang: Locale }) {
  const dicionario = await getDictionary(lang);
  const t = dicionario.servicos.comoFunciona;
  const passos = dicionario.home.how.steps;
  return (
    <section
      aria-labelledby="como-funciona-titulo"
      className="flex flex-col gap-md pb-3xl lg:pb-4xl"
    >
      <h2
        id="como-funciona-titulo"
        className="font-heading text-title font-semibold tracking-[var(--letter-spacing-title)] text-text-primary lg:text-headline lg:tracking-[var(--letter-spacing-headline)]"
      >
        {t.titulo}
      </h2>
      <ol className="flex flex-col border-t border-border-strong lg:flex-row lg:gap-lg">
        {passos.map((texto, index) => (
          <ReguaPasso key={index} estatico passo={index} texto={texto} />
        ))}
      </ol>
    </section>
  );
}
