import type { Metadata } from "next";
import Link from "@/i18n/locale-link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { ArticleBody } from "@/components/blog/article-body";
import { LevelBadge } from "@/components/blog/level-badge";
import { PostMeta } from "@/components/blog/post-meta";
import { RelatedPosts } from "@/components/blog/related-posts";
import { Badge } from "@/components/ui/badge";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/content";
import { locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";

// Artigo migrado dos frames U69qD (wide, 1440) e MWtZc (narrow, 390) do
// design/design-system.pen.
//
// Enquanto content/blog/ estiver vazio (gate de privacidade, PRD §4.3) nenhuma rota
// aponta para aqui e qualquer slug cai em notFound(). A página existe para funcionar
// assim que o primeiro artigo revisto for publicado.
//
// O aviso "exemplo de layout" do frame é uma anotação do .pen sobre o conteúdo fictício,
// não faz parte da página.

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

export default async function BlogPostPage({ params }: PageProps<"/[lang]/blog/[slug]">) {
  const { slug, lang } = await params;
  const { blog: t } = await getDictionary(lang as Locale);
  const post = getBlogPostBySlug(lang as Locale, slug);
  if (!post) notFound();

  const { frontmatter } = post;
  const related = getAllBlogPosts(lang as Locale)
    .filter((other) => other.slug !== post.slug)
    .slice(0, 2);

  return (
    <>
      <Nav currentPath="/blog" />

      <main className="flex-1 px-lg pt-md pb-3xl md:px-xl lg:px-2xl lg:pt-xl lg:pb-4xl">
        <div className="mx-auto flex max-w-[var(--grid-max-width)] flex-col items-center gap-xl lg:gap-3xl">
          <article className="flex w-full flex-col gap-md lg:max-w-[760px] lg:gap-lg">
            <Link
              href="/blog"
              className="inline-flex min-h-11 items-center gap-2xs self-start font-body text-body font-medium text-text-link transition-colors hover:text-text-accent"
            >
              <ArrowLeft size={18} strokeWidth={2} aria-hidden />
              {t.backToBlog}
            </Link>

            <div className="flex flex-wrap items-center gap-sm">
              <LevelBadge level={frontmatter.level} />
              <PostMeta post={post} />
            </div>

            <h1 className="font-heading text-title font-bold leading-[var(--line-height-headline)] tracking-[var(--letter-spacing-headline)] text-text-primary lg:text-display-sm lg:tracking-[var(--letter-spacing-display)]">
              {frontmatter.title}
            </h1>

            <div className="flex flex-col gap-xs rounded-[var(--radius-md)] border border-feedback-success-border bg-accent-primary-subtle p-md lg:p-lg">
              <p className="font-body text-caption font-medium tracking-[var(--letter-spacing-overline)] text-text-accent">
                {t.summaryOverline}
              </p>
              <p className="font-body text-body text-text-primary lg:text-body-lg">
                {frontmatter.description}
              </p>
            </div>

            <ArticleBody content={post.content} />

            {frontmatter.tags.length > 0 ? (
              <div className="flex flex-col gap-xs lg:flex-row lg:items-center">
                <span
                  id="etiquetas-do-artigo"
                  className="font-body text-caption font-medium tracking-[var(--letter-spacing-overline)] text-text-tertiary"
                >
                  {t.tagsOverline}
                </span>
                <ul
                  aria-labelledby="etiquetas-do-artigo"
                  className="flex flex-wrap items-center gap-xs"
                >
                  {frontmatter.tags.map((tag) => (
                    <li key={tag}>
                      <Badge tone="outline" size="sm">
                        {tag}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </article>

          <RelatedPosts posts={related} />
        </div>
      </main>

      <Footer />
    </>
  );
}
