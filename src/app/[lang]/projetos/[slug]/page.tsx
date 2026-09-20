import type { Metadata } from "next";
import Link from "@/i18n/locale-link";
import { notFound } from "next/navigation";
import { ArrowLeft, CircleDot, ExternalLink } from "lucide-react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAllProjects, getProjectBySlug } from "@/lib/content";
import { hostLabel } from "@/lib/url";
import { locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";

// Ficha de projeto migrada dos frames ArroA (wide, 1440) e oQ6zT (narrow, 390) do
// design/design-system.pen. Rota dinâmica: um ficheiro por projeto em content/projects/**.
//
// Os testemunhos existem no schema mas estão vazios, por isso não há secção de
// testemunhos nesta página (decisão do PRD D7 — nada de "em breve").

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    getAllProjects(lang).map((projeto) => ({ lang, slug: projeto.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/projetos/[slug]">): Promise<Metadata> {
  const { slug, lang } = await params;
  const projeto = getProjectBySlug(lang as Locale, slug);
  if (!projeto) return {};

  return {
    title: projeto.frontmatter.title,
    description: projeto.frontmatter.description,
    ...pageMetadata(lang as Locale, `/projetos/${slug}`),
  };
}

export default async function ProjetoPage({ params }: PageProps<"/[lang]/projetos/[slug]">) {
  const { slug, lang } = await params;
  const { projetos: t } = await getDictionary(lang as Locale);
  const projeto = getProjectBySlug(lang as Locale, slug);
  if (!projeto) notFound();

  const { frontmatter, content } = projeto;
  const { title, description, stack, stackGroups, url } = frontmatter;

  const paragrafos = content
    .trim()
    .split(/\n{2,}/)
    .map((paragrafo) => paragrafo.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  return (
    <>
      <Nav currentPath="/projetos" />

      <main className="flex-1 px-lg pt-lg pb-3xl md:px-xl lg:px-2xl lg:pt-xl lg:pb-4xl">
        <div className="mx-auto flex max-w-[var(--grid-max-width)] flex-col gap-2xl lg:gap-3xl">
          <div className="flex flex-col gap-md lg:gap-lg">
            <Link
              href="/projetos"
              className="inline-flex h-11 items-center gap-xs self-start px-2xs font-body text-label font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              <ArrowLeft size={18} strokeWidth={2} aria-hidden />
              {t.backToList}
            </Link>

            <div className="flex flex-col gap-md">
              {url ? (
                <Badge
                  tone="accent"
                  className="self-start"
                  icon={<CircleDot size={16} strokeWidth={2} aria-hidden />}
                >
                  {t.statusLive}
                </Badge>
              ) : null}

              <h1 className="font-heading text-title/[var(--line-height-headline)] font-bold tracking-[var(--letter-spacing-headline)] text-text-primary lg:text-display-sm lg:tracking-[var(--letter-spacing-display)]">
                {title}
              </h1>

              <p className="font-body text-body-lg text-text-secondary lg:max-w-[720px]">
                {description}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2xl lg:flex-row lg:gap-3xl">
            <section aria-labelledby="o-que-e" className="flex flex-col gap-md lg:flex-1">
              <h2
                id="o-que-e"
                className="font-heading text-title-sm font-semibold tracking-[var(--letter-spacing-title)] text-text-primary"
              >
                {t.about}
              </h2>
              {paragrafos.map((paragrafo) => (
                <p key={paragrafo} className="font-body text-body text-text-secondary">
                  {paragrafo}
                </p>
              ))}
            </section>

            <aside className="flex flex-col gap-md lg:w-[380px] lg:shrink-0 lg:gap-lg">
              <Card className="flex flex-col gap-md p-lg">
                <h2 className="font-heading text-body-lg leading-[var(--line-height-title)] font-semibold tracking-[var(--letter-spacing-title)] text-text-primary">
                  {t.stackUsed}
                </h2>

                {stackGroups.length > 0 ? (
                  stackGroups.map((grupo) => (
                    <div key={grupo.label} className="flex flex-col gap-xs">
                      <p className="font-body text-caption text-text-tertiary">
                        {grupo.label}
                      </p>
                      <ul className="flex flex-wrap items-center gap-xs">
                        {grupo.items.map((item) => (
                          <li key={item}>
                            <Badge tone="neutral">{item}</Badge>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <ul className="flex flex-wrap items-center gap-xs">
                    {stack.map((item) => (
                      <li key={item}>
                        <Badge tone="neutral">{item}</Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>

              {url ? (
                <Card className="flex flex-col gap-sm p-lg">
                  <h2 className="font-heading text-body-lg leading-[var(--line-height-title)] font-semibold tracking-[var(--letter-spacing-title)] text-text-primary">
                    {t.visitTitle}
                  </h2>
                  <p className="font-body text-caption text-text-secondary">
                    {t.visitText}
                  </p>
                  <ButtonLink
                    href={url}
                    variant="secondary"
                    fullWidth
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {hostLabel(url)}
                    <ExternalLink size={20} strokeWidth={2} aria-hidden />
                  </ButtonLink>
                </Card>
              ) : null}
            </aside>
          </div>

          <Card className="flex flex-col gap-md p-lg lg:flex-row lg:items-center lg:justify-between lg:gap-2xl lg:p-2xl">
            <div className="flex flex-col gap-md lg:gap-xs">
              <p className="font-body text-body text-text-secondary">
                {t.ctaText}
              </p>
            </div>

            <ButtonLink href="/contacto" size="lg" className="w-full lg:w-auto">
              {t.ctaLabel}
            </ButtonLink>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  );
}
