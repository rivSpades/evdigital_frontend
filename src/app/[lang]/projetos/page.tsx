import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { ProjetoCard, ProjetoCardCompacto } from "@/components/projetos/projeto-card";
import { getAllProjects } from "@/lib/content";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";

// Listagem migrada dos frames S0F6k (wide, 1440) e kNnUB (narrow, 390) do
// design/design-system.pen. Os projetos vêm de content/projects/**, nunca do markup.

export async function generateMetadata({ params }: PageProps<"/[lang]/projetos">): Promise<Metadata> {
  const { lang } = await params;
  const { projetos: t } = await getDictionary(lang as Locale);
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    ...pageMetadata(lang as Locale, "/projetos"),
  };
}

export default async function ProjetosPage({ params }: PageProps<"/[lang]/projetos">) {
  const lang = (await params).lang as Locale;
  const { projetos: t } = await getDictionary(lang);
  const projetos = getAllProjects(lang);

  return (
    <>
      <Nav currentPath="/projetos" />

      <main className="flex-1 px-lg py-3xl md:px-xl lg:px-2xl lg:py-4xl">
        <div className="mx-auto flex max-w-[var(--grid-max-width)] flex-col gap-2xl lg:gap-3xl">
          <header>
            <h1 className="font-heading text-title/[var(--line-height-headline)] font-bold tracking-[var(--letter-spacing-headline)] text-text-primary lg:text-display-sm lg:tracking-[var(--letter-spacing-display)]">
              {t.title}
            </h1>
          </header>

          {/* Um projeto: cartão largo com Ficha rápida. Dois ou mais: grelha de 2 colunas
              com cartões compactos (o largo repetido seria scroll sem comparação). */}
          {projetos.length === 1 ? (
            <section aria-label={t.listLabel}>
              <ProjetoCard slug={projetos[0].slug} frontmatter={projetos[0].frontmatter} />
            </section>
          ) : (
            <section aria-label={t.listLabel} className="grid gap-md md:grid-cols-2 lg:gap-lg">
              {projetos.map((projeto) => (
                <ProjetoCardCompacto
                  key={projeto.slug}
                  slug={projeto.slug}
                  frontmatter={projeto.frontmatter}
                />
              ))}
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
