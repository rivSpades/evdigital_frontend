import Link from "@/i18n/locale-link";
import { ArrowRight } from "lucide-react";
import { LevelBadge } from "@/components/blog/level-badge";
import { PostMeta } from "@/components/blog/post-meta";
import { Card } from "@/components/ui/card";
import type { BlogPost } from "@/lib/blog";
import { cn } from "@/lib/cn";
import { getDictionary } from "@/i18n/dictionaries";

// Frames: "Artigos" (q6EKY no wide, L2SZA no narrow) da página de listagem.
// O primeiro artigo aparece como cartão em destaque; os restantes como linhas separadas
// por divisores $border-subtle. Cada item é uma única ligação (o .pen desenha o alvo de
// 44 como seta circular no wide e como "Ler artigo" no narrow, mas é a mesma acção).

async function ReadLink({ className }: { className?: string }) {
  const { blog: t } = await getDictionary();

  return (
    <span
      className={cn(
        "inline-flex min-h-11 items-center gap-2xs font-body text-body font-medium",
        "text-text-link transition-colors group-hover:text-text-accent",
        className,
      )}
    >
      {t.readArticle}
      <ArrowRight size={18} strokeWidth={2} aria-hidden />
    </span>
  );
}

export function FeaturedPost({ post }: { post: BlogPost }) {
  const { frontmatter, slug } = post;

  return (
    <Card highlight>
      <Link
        href={`/blog/${slug}`}
        className="group flex flex-col gap-sm rounded-[var(--card-radius)] p-lg transition-colors hover:bg-bg-surface-hover lg:gap-md lg:p-xl"
      >
        <div className="flex flex-col items-start gap-sm lg:flex-row-reverse lg:items-center lg:gap-sm">
          <LevelBadge level={frontmatter.level} />
          <h2 className="font-heading text-title-sm font-semibold tracking-[var(--letter-spacing-title)] text-text-primary lg:flex-1 lg:text-title">
            {frontmatter.title}
          </h2>
        </div>

        <p className="font-body text-body text-text-secondary lg:text-body-lg">
          {frontmatter.description}
        </p>

        <div className="flex min-h-11 flex-col justify-center gap-2xs lg:flex-row-reverse lg:items-center lg:justify-between lg:gap-md">
          <PostMeta post={post} />
          <ReadLink />
        </div>
      </Link>
    </Card>
  );
}

function PostRow({ post }: { post: BlogPost }) {
  const { frontmatter, slug } = post;

  return (
    <li className="border-t border-border-subtle last:border-b">
      <Link
        href={`/blog/${slug}`}
        className="group flex flex-col gap-xs py-lg lg:flex-row lg:items-center lg:gap-xl"
      >
        <div className="flex flex-col gap-xs lg:flex-1">
          <div className="flex flex-wrap items-center gap-sm">
            <LevelBadge level={frontmatter.level} />
            <PostMeta post={post} />
          </div>

          <h2 className="font-heading text-body-lg font-semibold tracking-[var(--letter-spacing-title)] text-text-primary lg:text-title-sm">
            {frontmatter.title}
          </h2>

          <p className="font-body text-body text-text-secondary">
            {frontmatter.description}
          </p>

          <ReadLink className="lg:hidden" />
        </div>

        <span className="hidden size-11 shrink-0 items-center justify-center rounded-[var(--radius-pill)] border border-border-subtle bg-bg-surface text-text-secondary transition-colors group-hover:border-border-interactive group-hover:text-text-accent lg:flex">
          <ArrowRight size={20} strokeWidth={2} aria-hidden />
        </span>
      </Link>
    </li>
  );
}

export function PostList({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <ul className="flex flex-col">
      {posts.map((post) => (
        <PostRow key={post.slug} post={post} />
      ))}
    </ul>
  );
}
