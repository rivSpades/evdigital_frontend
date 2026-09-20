import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

// Bloco 8 do template de ficha (PRD-servicos.md §4 e copy-servicos.md §9.1): os mesmos
// 4 passos do componente da Home (ComoTrabalhamos), aqui com o título "Como funciona"
// em vez de "Como trabalhamos" — é o mesmo processo, mas a Home fala da empresa e a
// ficha fala do produto. Reutiliza-se a lista para não haver duas fontes de verdade
// para o mesmo texto (copy-draft.md §2.4 / copy-servicos.md §9.1).

const NUMEROS = ["01", "02", "03", "04"];

export async function ComoFunciona({ lang }: { lang: Locale }) {
  const t = (await getDictionary(lang)).servicos.comoFunciona;
  return (
    <section aria-labelledby="como-funciona-titulo" className="flex flex-col gap-lg lg:gap-xl">
      <h2
        id="como-funciona-titulo"
        className="font-heading text-title font-bold tracking-[var(--letter-spacing-title)] text-text-primary lg:text-headline lg:tracking-[var(--letter-spacing-headline)]"
      >
        {t.titulo}
      </h2>

      <ol className="grid gap-lg lg:grid-cols-4 lg:gap-lg">
        {t.passos.map((passo, i) => (
          <li
            key={NUMEROS[i]}
            className="flex flex-col gap-sm border-t-2 border-border-default pt-md"
          >
            <span
              aria-hidden
              className="font-mono text-caption font-medium tracking-[var(--letter-spacing-overline)] text-text-accent"
            >
              {NUMEROS[i]}
            </span>
            <h3 className="font-heading text-title-sm font-semibold tracking-[var(--letter-spacing-title)] text-text-primary">
              {passo.titulo}
            </h3>
            <p className="font-body text-body text-text-secondary">{passo.descricao}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
