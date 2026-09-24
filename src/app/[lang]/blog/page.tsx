import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { BlogEmptyState } from "@/components/blog/empty-state";
import { BlogClosingCta } from "@/components/blog/closing-cta";
import { LevelFilter, type BlogLevelFilter } from "@/components/blog/level-filter";
import { PorNivel } from "@/components/blog/por-nivel";
import { PostList } from "@/components/blog/post-list";
import { getAllBlogPosts } from "@/lib/content";

// Listagem migrada do grupo "Ecrã · Blog" de "v2 · A vez" (flhgP) do
// design/design-system.pen, desktop 1280 e mobile 375:
// - "sem artigos (estado real)" (xV2O2, jdOuF): content/blog/ está vazio por decisão de
//   produto (gate de privacidade, PRD §4.3), por isso é o que a página renderiza hoje.
// - "com artigos" (Ky0bn, sqVy8) e "filtro sem resultados" (KigTl, G7B2i): exemplos de
//   layout com artigos fictícios; a ramificação existe para o dia em que houver um
//   primeiro artigo revisto, com os dados reais de content/<lang>/blog/**.
// Secção · topo: título $font-size-display ($font-size-display-narrow em mobile), padding
// [$space-4xl, 0, $space-2xl, 0] em lg e [$space-2xl, 0, $space-xl, 0] abaixo.
// Secção · artigos: em lg a Margem com o filtro por nível (colunas 1 a 3) e o registo na
// coluna principal (4 a 12); abaixo empilham com gap $space-md.

export async function generateMetadata({ params }: PageProps<"/[lang]/blog">): Promise<Metadata> {
  const { lang } = await params;
  const { blog: t } = await getDictionary(lang as Locale);
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    ...pageMetadata(lang as Locale, "/blog"),
  };
}

// O filtro `?nivel=` escolhe-se no cliente (`PorNivel`) para a página continuar estática:
// as três variantes da secção renderizam-se aqui, no build.

export default async function BlogPage({ params }: PageProps<"/[lang]/blog">) {
  const lang = (await params).lang as Locale;
  const { blog: t } = await getDictionary(lang);

  const posts = getAllBlogPosts(lang);

  const secao = (level: BlogLevelFilter) => {
    const visible = level === "todos" ? posts : posts.filter((p) => p.frontmatter.level === level);
    return (
      <section
        aria-label={t.title}
        className="flex flex-col gap-md pb-xl lg:grid lg:grid-cols-12 lg:gap-x-lg lg:gap-y-0 lg:pb-2xl"
      >
        <LevelFilter current={level} total={visible.length} className="lg:col-span-3" />

        <div className="lg:col-span-9">
          {visible.length > 0 ? (
            <PostList posts={visible} destacarPrimeiro />
          ) : (
            <p className="font-body text-body text-text-secondary lg:max-w-[704px]">
              {t.filterEmpty}
            </p>
          )}
        </div>
      </section>
    );
  };

  return (
    <>
      <Nav currentPath="/blog" />

      <main className="flex-1 px-lg md:px-xl lg:px-2xl">
        <div className="mx-auto w-full max-w-[var(--grid-max-width)]">
          <header className="pt-2xl pb-xl lg:pt-4xl lg:pb-2xl">
            <h1 className="font-heading text-[length:var(--font-size-display-narrow)] leading-[var(--line-height-display)] font-bold tracking-[var(--letter-spacing-display)] text-text-primary lg:text-display">
              {t.title}
            </h1>
          </header>

          {posts.length === 0 ? (
            <section aria-label={t.title} className="pb-4xl lg:pb-5xl">
              <BlogEmptyState />
            </section>
          ) : (
            <>
              <PorNivel
                variantes={{ todos: secao("todos"), simples: secao("simples"), tecnico: secao("tecnico") }}
              />

              <BlogClosingCta />
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
