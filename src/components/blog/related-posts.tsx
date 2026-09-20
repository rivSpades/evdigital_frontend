import Link from "@/i18n/locale-link";
import { ArrowRight } from "lucide-react";
import { LevelBadge } from "@/components/blog/level-badge";
import { PostMeta } from "@/components/blog/post-meta";
import { Card } from "@/components/ui/card";
import { LinkArrow } from "@/components/ui/link-arrow";
import type { BlogPost } from "@/lib/blog";
import { getDictionary } from "@/i18n/dictionaries";

// Frames: "Continuar a ler" (E4kdha no wide, W396hI no narrow).
// No wide a ligação "Ver todos os artigos" fica à direita do título e os cartões ocupam
// a linha de baixo; no narrow a ligação fecha o bloco. A grelha explícita dá as duas
// leituras com uma só ligação no markup.

async function RelatedCard({ post }: { post: BlogPost }) {
  const { blog: t } = await getDictionary();

  return (
    <Card highlight>
      <Link
        href={`/blog/${post.slug}`}
        className="group flex h-full flex-col gap-sm rounded-[var(--card-radius)] p-lg transition-colors hover:bg-bg-surface-hover"
      >
        <div className="flex flex-col items-start gap-sm">
          <LevelBadge level={post.frontmatter.level} />
          <h3 className="font-heading text-body-lg font-semibold tracking-[var(--letter-spacing-title)] text-text-primary">
            {post.frontmatter.title}
          </h3>
        </div>

        <p className="font-body text-body text-text-secondary">
          {post.frontmatter.description}
        </p>

        <div className="mt-auto flex min-h-11 flex-col justify-center gap-2xs lg:flex-row-reverse lg:items-center lg:justify-between lg:gap-md">
          <PostMeta post={post} />
          <span className="inline-flex items-center gap-2xs font-body text-body font-medium text-text-link transition-colors group-hover:text-text-accent">
            {t.readArticle}
            <ArrowRight size={18} strokeWidth={2} aria-hidden />
          </span>
        </div>
      </Link>
    </Card>
  );
}

export async function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;
  const { blog: t } = await getDictionary();

  return (
    <section
      aria-labelledby="continuar-a-ler"
      className="grid w-full gap-md border-t border-border-subtle pt-md lg:grid-cols-[1fr_auto] lg:items-center lg:gap-lg lg:pt-lg"
    >
      <h2
        id="continuar-a-ler"
        className="font-heading text-body-lg font-semibold tracking-[var(--letter-spacing-title)] text-text-primary lg:col-start-1 lg:row-start-1 lg:text-title-sm"
      >
        {t.relatedTitle}
      </h2>

      <div className="grid gap-md lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:grid-cols-2 lg:gap-lg">
        {posts.map((post) => (
          <RelatedCard key={post.slug} post={post} />
        ))}
      </div>

      <LinkArrow href="/blog" className="lg:col-start-2 lg:row-start-1 lg:justify-self-end">
        {t.relatedAll}
      </LinkArrow>
    </section>
  );
}
