import { ServicoLinha } from "@/components/ui/servico-linha";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { getAllServices } from "@/lib/content";

// Frames "v2 · A vez" / Ecrã · Serviços (CEY4K desktop 1280, hgNkr mobile 375): as duas
// famílias do catálogo como registos de ds/display/servico-linha (régua superior hairline
// $border-default no contentor). Os textos vêm de content/<lang>/services/**, pela ordem do
// frontmatter: família A com a frase `summary`, família B com a frase `outcome` (as que o
// .pen mostra em cada registo).
//
// - "Para quem está a começar" (i4Gr0v / Jb6wQ): título $font-size-headline
//   ($font-size-title em mobile) $font-weight-heading, a $space-lg do registo ($space-md
//   em mobile), registo a toda a largura (Título na coluna larga de 368). Padding-bottom
//   $space-4xl ($space-3xl em mobile).
// - "Para quem já quer ir mais longe" (fHb2w / TRWx9): em lg, título $font-size-title na
//   Margem (colunas 1 a 3) e registo na coluna principal (4 a 12, Título na coluna de 280);
//   padding [$space-2xl, 0, $space-3xl, 0]. Em mobile empilha como a primeira.
// As âncoras #comecar e #avancadas são os destinos das portas da Início.

export async function FamiliaInicial({ lang }: { lang: Locale }) {
  const t = (await getDictionary(lang)).servicos.inicial;
  const servicos = getAllServices(lang).filter((s) => s.frontmatter.family === "A");
  if (servicos.length === 0) return null;
  return (
    <section
      id="comecar"
      aria-labelledby="servicos-inicial-titulo"
      className="flex scroll-mt-24 flex-col gap-md pb-3xl lg:gap-lg lg:pb-4xl"
    >
      <h2
        id="servicos-inicial-titulo"
        className="font-heading text-title font-semibold tracking-[var(--letter-spacing-title)] text-text-primary lg:text-headline lg:tracking-[var(--letter-spacing-headline)]"
      >
        {t.titulo}
      </h2>
      <ul className="flex flex-col border-t border-border-default">
        {servicos.map((servico) => (
          <ServicoLinha
            key={servico.slug}
            href={`/servicos/${servico.slug}`}
            titulo={servico.frontmatter.title}
            resumo={servico.frontmatter.summary}
          />
        ))}
      </ul>
    </section>
  );
}

export async function FamiliaAvancada({ lang }: { lang: Locale }) {
  const t = (await getDictionary(lang)).servicos.avancado;
  const servicos = getAllServices(lang).filter((s) => s.frontmatter.family === "B");
  if (servicos.length === 0) return null;
  return (
    <section
      id="avancadas"
      aria-labelledby="servicos-avancado-titulo"
      className="flex scroll-mt-24 flex-col gap-md pb-3xl lg:grid lg:grid-cols-12 lg:gap-x-lg lg:gap-y-0 lg:pt-2xl"
    >
      <h2
        id="servicos-avancado-titulo"
        className="font-heading text-title font-semibold tracking-[var(--letter-spacing-title)] text-text-primary lg:col-span-3"
      >
        {t.titulo}
      </h2>
      <ul className="flex flex-col border-t border-border-default lg:col-span-9">
        {servicos.map((servico) => (
          <ServicoLinha
            key={servico.slug}
            href={`/servicos/${servico.slug}`}
            titulo={servico.frontmatter.title}
            resumo={servico.frontmatter.outcome}
            coluna="margem"
          />
        ))}
      </ul>
    </section>
  );
}
