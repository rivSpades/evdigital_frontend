import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { BackLink } from "@/components/area-cliente/back-link";
import { ArticleBody } from "@/components/blog/article-body";
import { RelatedPosts } from "@/components/blog/related-posts";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/content";
import { fillCount, formatPostDate, levelLabel, readingMinutes } from "@/lib/blog";
import { locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";

// Artigo migrado do grupo "Ecrã · Blog" de "v2 · A vez" (flhgP) do
// design/design-system.pen: "Blog · artigo" (HPbU7 desktop 1280, ebHXa mobile 375; exemplo
// de layout, o artigo do .pen é fictício).
// - Secção · topo: ds/navigation/voltar ("Voltar ao blog") como primeira linha a seguir à
//   barra de topo, alinhado à margem. Cabeçalho do artigo: em lg, a Margem · factos
//   (colunas 1 a 3, padding-top $space-sm: nível caption $text-secondary, data e leitura
//   $font-mono caption $text-tertiary, empilhados) e a coluna principal (título
//   $font-size-display-sm e "Em resumo": rótulo caption $text-tertiary e resumo body-lg
//   $text-primary de 760). Abaixo: factos numa linha (leitura curta), depois o título
//   ($font-size-display-sm-narrow) e o resumo em body.
// - Secção · corpo: ds/display/secao-leitura por secção, na coluna principal (760).
// - Secção · continuar a ler: RelatedPosts.
//
// Enquanto content/blog/ estiver vazio (gate de privacidade, PRD §4.3) nenhuma rota aponta
// para aqui e qualquer slug cai em notFound().

export async function generateStaticParams() {
  return locales.flatMap((lang) =>
    getAllBlogPosts(lang).map((post) => ({ lang, slug: post.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/blog/[slug]">): Promise<Metadata> {
  const { slug, lang } = await params;
  const post = getBlogPostBySlug(lang as Locale, slug);
  if (!post) return {};

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    ...pageMetadata(lang as Locale, `/blog/${slug}`),
  };
}

// Colunas da grelha de 12 em lg: Margem (1 a 3) e coluna principal (4 a 12, 760 de leitura).
const grelha = "lg:grid lg:grid-cols-12 lg:gap-x-lg lg:gap-y-0";
const colunaPrincipal = "lg:col-span-9 lg:col-start-4 lg:row-start-1 lg:max-w-[760px]";

export default async function BlogPostPage({ params }: PageProps<"/[lang]/blog/[slug]">) {
  const { slug, lang } = await params;
  const locale = lang as Locale;
  const { blog: t } = await getDictionary(locale);
  const post = getBlogPostBySlug(locale, slug);
  if (!post) notFound();

  const { frontmatter } = post;
  const minutes = readingMinutes(post.content);
  const related = getAllBlogPosts(locale)
    .filter((other) => other.slug !== post.slug)
    .slice(0, 2);

  return (
    <>
      <Nav currentPath="/blog" />

      <main className="flex-1 px-lg md:px-xl lg:px-2xl">
        <div className="mx-auto w-full max-w-[var(--grid-max-width)]">
          <article>
            <header className="flex flex-col gap-md pt-lg pb-xl lg:gap-lg lg:pt-xl lg:pb-2xl">
              <BackLink href="/blog" label={t.backToBlog} />

              <div className={`flex flex-col gap-sm ${grelha}`}>
                <div className={`flex flex-col gap-lg ${colunaPrincipal}`}>
                  <h1 className="font-heading text-[length:var(--font-size-display-sm-narrow)] leading-[var(--line-height-display)] font-bold tracking-[var(--letter-spacing-display)] text-text-primary lg:text-display-sm">
                    {frontmatter.title}
                  </h1>
                  <div className="flex flex-col gap-2xs">
                    <p className="font-body text-caption text-text-tertiary">{t.summaryOverline}</p>
                    <p className="font-body text-body text-text-primary lg:text-body-lg">
                      {frontmatter.description}
                    </p>
                  </div>
                </div>

                <p className="order-first flex flex-wrap gap-x-sm gap-y-2xs text-caption lg:order-none lg:col-span-3 lg:col-start-1 lg:row-start-1 lg:flex-col lg:gap-2xs lg:pt-sm">
                  <span className="font-body tracking-[var(--letter-spacing-caption)] text-text-secondary">
                    {levelLabel(t, frontmatter.level)}
                  </span>
                  <span className="font-mono text-text-tertiary">
                    {formatPostDate(locale, frontmatter.publishedAt)}
                  </span>
                  <span className="font-mono text-text-tertiary">
                    <span className="lg:hidden">{fillCount(t.readingShort, minutes)}</span>
                    <span className="hidden lg:inline">{fillCount(t.readingLong, minutes)}</span>
                  </span>
                </p>
              </div>
            </header>

            <div className={`pb-2xl lg:pb-4xl ${grelha}`}>
              <div className={`flex flex-col gap-lg lg:gap-xl ${colunaPrincipal}`}>
                <ArticleBody content={post.content} />

                {frontmatter.tags.length > 0 ? (
                  <div className="flex flex-col gap-2xs">
                    <p id="etiquetas-do-artigo" className="font-body text-caption text-text-tertiary">
                      {t.tagsOverline}
                    </p>
                    <ul
                      aria-labelledby="etiquetas-do-artigo"
                      className="flex flex-wrap gap-x-sm gap-y-2xs font-mono text-caption text-text-secondary"
                    >
                      {frontmatter.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </article>

          <RelatedPosts posts={related} />
        </div>
      </main>

      <Footer />
    </>
  );
}
