import { ArtigoLinha, type ArtigoLinhaVariante } from "@/components/ui/artigo-linha";
import { fillCount, formatPostDate, levelLabel, readingMinutes, type BlogPost } from "@/lib/blog";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

// Frames "v2 · A vez" / Ecrã · Blog: "Registo · artigos" (Ky0bn desktop 1280, sqVy8 mobile
// 375; exemplo de layout, os artigos do .pen são fictícios). Os artigos como
// ds/display/artigo-linha, com a régua superior no contentor. O primeiro artigo da lista
// usa a variante destaque; nos relacionados do artigo, a variante relacionado.

export async function PostList({
  posts,
  destacarPrimeiro = false,
  variante = "normal",
  tituloAs = "h2",
}: {
  posts: BlogPost[];
  destacarPrimeiro?: boolean;
  variante?: ArtigoLinhaVariante;
  tituloAs?: "h2" | "h3";
}) {
  if (posts.length === 0) return null;
  const lang = await getLocale();
  const { blog: t } = await getDictionary(lang);

  return (
    <ul className="flex flex-col border-t border-border-default">
      {posts.map((post, i) => {
        const minutes = readingMinutes(post.content);
        return (
          <ArtigoLinha
            key={post.slug}
            nivel={levelLabel(t, post.frontmatter.level)}
            data={formatPostDate(lang, post.frontmatter.publishedAt)}
            leituraCurta={fillCount(t.readingShort, minutes)}
            leituraLonga={fillCount(t.readingLong, minutes)}
            titulo={post.frontmatter.title}
            tituloAs={tituloAs}
            descricao={post.frontmatter.description}
            href={`/blog/${post.slug}`}
            ligacao={t.readArticle}
            variante={destacarPrimeiro && i === 0 ? "destaque" : variante}
          />
        );
      })}
    </ul>
  );
}
