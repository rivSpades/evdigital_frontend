import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { BlogEmptyState } from "@/components/blog/empty-state";
import { BlogClosingCta } from "@/components/blog/closing-cta";
import { LevelFilter, type BlogLevelFilter } from "@/components/blog/level-filter";
import { FeaturedPost, PostList } from "@/components/blog/post-list";
import { getAllBlogPosts } from "@/lib/content";

// Listagem migrada dos frames nLVYM (wide, 1440) e jz9WK (narrow, 390) do
// design/design-system.pen.
//
// O .pen desenha dois estados no mesmo frame: "com artigos" e "sem artigos". Hoje
// content/blog/ está vazio por decisão de produto (gate de privacidade, PRD §4.3), por
// isso o que a página renderiza é o estado vazio. A ramificação existe para o dia em que
// houver um primeiro artigo revisto, sem precisar de reescrever o ecrã.
//
// O aviso "exemplo de layout" que aparece no frame com artigos é uma anotação do .pen
// (marca o conteúdo de exemplo como fictício), não faz parte da página.

export async function generateMetadata({ params }: PageProps<"/[lang]/blog">): Promise<Metadata> {
  const { lang } = await params;
  const { blog: t } = await getDictionary(lang as Locale);
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    ...pageMetadata(lang as Locale, "/blog"),
  };
}

function parseLevel(value: string | string[] | undefined): BlogLevelFilter {
  if (value === "simples" || value === "tecnico") return value;
  return "todos";
}

export default async function BlogPage({ params, searchParams }: PageProps<"/[lang]/blog">) {
  const lang = (await params).lang as Locale;
  const { blog: t } = await getDictionary(lang);
  const { nivel } = await searchParams;
  const level = parseLevel(nivel);

  const posts = getAllBlogPosts(lang);
  const visible = level === "todos" ? posts : posts.filter((p) => p.frontmatter.level === level);
  const [featured, ...rest] = visible;

  return (
    <>
      <Nav currentPath="/blog" />

      <main className="flex-1 px-lg pt-xl pb-3xl md:px-xl lg:px-2xl lg:pt-3xl lg:pb-4xl">
        <div className="mx-auto flex max-w-[var(--grid-max-width)] flex-col gap-xl lg:gap-2xl">
          <header>
            <h1 className="font-heading text-title font-bold leading-[var(--line-height-headline)] tracking-[var(--letter-spacing-headline)] text-text-primary lg:text-display-sm lg:tracking-[var(--letter-spacing-display)]">
              {t.title}
            </h1>
          </header>

          {posts.length === 0 ? (
            <BlogEmptyState />
          ) : (
            <>
              <LevelFilter current={level} total={visible.length} />

              <div className="flex flex-col gap-xl">
                {featured ? (
                  <>
                    <FeaturedPost post={featured} />
                    <PostList posts={rest} />
                  </>
                ) : (
                  // Filtro sem resultados. O .pen ainda não desenha este estado (só
                  // "com artigos" e "sem artigos"), por isso fica na linguagem mais
                  // sóbria possível até haver frame.
                  <p className="font-body text-body text-text-secondary">
                    {t.filterEmpty}
                  </p>
                )}
              </div>

              <BlogClosingCta />
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
