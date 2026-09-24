import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { ProjetoRegisto } from "@/components/projetos/projeto-registo";
import { ProjetoLinha } from "@/components/ui/projeto-linha";
import { getAllProjects } from "@/lib/content";
import { hostLabel } from "@/lib/url";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";

// Listagem migrada do grupo "Ecrã · Projetos" de "v2 · A vez" (flhgP) do
// design/design-system.pen: "Projetos · com 1 projeto" (Z3GQJ desktop 1280, I5TCAE mobile
// 375) e "com 2 ou mais projetos, compacto" (m0XRkz / GoTSo, exemplo de layout). Os
// projetos vêm de content/<lang>/projects/**, nunca do markup (o 2.º projeto do .pen é
// fictício).
// Uma coluna com as margens de layout ($space-layout-margin-narrow/mid/wide).
// - Secção · topo: título $font-size-display ($font-size-display-narrow em mobile),
//   padding [$space-4xl, 0, $space-3xl, 0] em lg e [$space-2xl, 0] abaixo.
// - Secção · projetos: padding-bottom $space-4xl ($space-3xl em mobile). Um projeto:
//   registo largo com Ficha rápida. Dois ou mais: ds/display/projeto-linha, duas colunas
//   em lg com gap $space-xl (nunca 3), empilhadas abaixo.

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

      <main className="flex-1 px-lg md:px-xl lg:px-2xl">
        <div className="mx-auto w-full max-w-[var(--grid-max-width)]">
          <header className="py-2xl lg:pt-4xl lg:pb-3xl">
            <h1 className="font-heading text-[length:var(--font-size-display-narrow)] leading-[var(--line-height-display)] font-bold tracking-[var(--letter-spacing-display)] text-text-primary lg:text-display">
              {t.title}
            </h1>
          </header>

          <section aria-label={t.listLabel} className="pb-3xl lg:pb-4xl">
            {projetos.length === 1 ? (
              <ProjetoRegisto slug={projetos[0].slug} frontmatter={projetos[0].frontmatter} />
            ) : (
              <ul className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-x-xl">
                {projetos.map(({ slug, frontmatter }) => (
                  <ProjetoLinha
                    key={slug}
                    estado={frontmatter.url ? t.statusLive : undefined}
                    nome={frontmatter.title}
                    resumo={frontmatter.summary}
                    stack={frontmatter.stack.join(", ")}
                    href={`/projetos/${slug}`}
                    ligacao={t.viewProjectShort}
                    url={frontmatter.url}
                    host={frontmatter.url ? hostLabel(frontmatter.url) : undefined}
                  />
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
