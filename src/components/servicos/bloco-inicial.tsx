import { Card } from "@/components/ui/card";
import { LinkArrow } from "@/components/ui/link-arrow";
import { IconeServico } from "@/components/servicos/icones";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { getAllServices } from "@/lib/content";

// Frames: "Bloco · Para quem está a começar" (IbjYl no wide, VsgzM no narrow).
// Site profissional em destaque (caixa maior), Loja online e Marcações e reservas em
// dois cartões lado a lado — já não é uma lista de linhas: PRD-servicos.md §2 reduziu
// esta família a 3 produtos. Os textos vêm de content/services/** (family A).

export async function BlocoInicial({ lang }: { lang: Locale }) {
  const t = (await getDictionary(lang)).servicos.inicial;
  const servicos = getAllServices(lang).filter((s) => s.frontmatter.family === "A");
  const [destaque, ...restantes] = servicos;
  if (!destaque) return null;

  return (
    <section
      id="comecar"
      aria-labelledby="servicos-inicial-titulo"
      className="flex scroll-mt-24 flex-col gap-xl lg:gap-2xl"
    >
      <div className="flex flex-col gap-xs lg:gap-sm">
        <h2
          id="servicos-inicial-titulo"
          className="font-heading text-title font-semibold tracking-[var(--letter-spacing-headline)] text-text-primary lg:text-headline"
        >
          {t.titulo}
        </h2>
        <p className="font-body text-body text-text-secondary lg:max-w-[700px] lg:text-body-lg">
          {t.subtitulo}
        </p>
      </div>

      <Card
        highlight
        className="flex flex-col gap-md p-lg lg:flex-row lg:items-center lg:gap-lg lg:p-xl"
      >
        <span className="flex size-14 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-accent-primary-subtle lg:size-16">
          <IconeServico
            slug={destaque.slug}
            size={28}
            className="text-text-accent lg:size-8"
          />
        </span>

        <div className="flex flex-1 flex-col gap-md lg:gap-xs">
          <h3 className="font-heading text-title-sm font-semibold tracking-[var(--letter-spacing-title)] text-text-primary lg:text-title">
            {destaque.frontmatter.title}
          </h3>
          <p className="font-body text-body text-text-secondary lg:text-body-lg">
            {destaque.frontmatter.outcome}
          </p>
        </div>

        <LinkArrow href={`/servicos/${destaque.slug}`} className="lg:self-center">
          {t.verComoFunciona}
        </LinkArrow>
      </Card>

      <div className="grid gap-md lg:grid-cols-2 lg:gap-lg">
        {restantes.map((servico) => (
          <Card
            key={servico.slug}
            highlight
            className="flex flex-col gap-md p-lg"
          >
            <span className="flex size-14 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-accent-primary-subtle">
              <IconeServico slug={servico.slug} size={28} className="text-text-accent" />
            </span>

            <div className="flex flex-1 flex-col gap-xs">
              <h3 className="font-heading text-title-sm font-semibold tracking-[var(--letter-spacing-title)] text-text-primary">
                {servico.frontmatter.title}
              </h3>
              <p className="font-body text-body text-text-secondary">
                {servico.frontmatter.summary}
              </p>
            </div>

            <LinkArrow href={`/servicos/${servico.slug}`}>{t.verComoFunciona}</LinkArrow>
          </Card>
        ))}
      </div>
    </section>
  );
}
