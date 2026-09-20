import { fillCount, formatPostDate, readingMinutes, type BlogPost } from "@/lib/blog";
import { cn } from "@/lib/cn";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

// Linha de metadados do .pen ("data · N min de leitura", em $font-size-caption e
// $text-tertiary). Os frames narrow encurtam para "N min", por isso o sufixo só aparece
// a partir de lg.

export async function PostMeta({ post, className }: { post: BlogPost; className?: string }) {
  const lang = await getLocale();
  const { blog: t } = await getDictionary(lang);
  const minutes = readingMinutes(post.content);

  return (
    <span
      className={cn(
        "font-body text-caption tracking-[var(--letter-spacing-caption)] text-text-tertiary",
        className,
      )}
    >
      {formatPostDate(lang, post.frontmatter.publishedAt)} ·{" "}
      <span className="lg:hidden">{fillCount(t.readingShort, minutes)}</span>
      <span className="hidden lg:inline">{fillCount(t.readingLong, minutes)}</span>
    </span>
  );
}
