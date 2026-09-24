import { PostList } from "@/components/blog/post-list";
import { Ligacao } from "@/components/ui/ligacao";
import type { BlogPost } from "@/lib/blog";
import { getDictionary } from "@/i18n/dictionaries";

// Frames "v2 · A vez" / Ecrã · Blog: "Secção · continuar a ler" do artigo (HPbU7 desktop,
// ebHXa mobile; exemplo de layout). Na coluna principal (4 a 12 em lg), gap $space-md.
// Cabeçalho: título ($font-size-title-sm em lg, body-lg abaixo) e a ds/action/ligacao
// "acao" "Ver todos os artigos", lado a lado em lg e empilhados abaixo. Depois os
// relacionados como ds/display/artigo-linha na variante relacionado.

export async function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;
  const { blog: t } = await getDictionary();

  return (
    <section
      aria-labelledby="continuar-a-ler"
      className="pb-2xl lg:grid lg:grid-cols-12 lg:gap-x-lg lg:pb-4xl"
    >
      <div className="flex flex-col gap-md lg:col-span-9 lg:col-start-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-md">
          <h2
            id="continuar-a-ler"
            className="font-heading text-body-lg leading-[var(--line-height-title)] font-semibold tracking-[var(--letter-spacing-title)] text-text-primary lg:text-title-sm"
          >
            {t.relatedTitle}
          </h2>
          <Ligacao href="/blog" variant="acao">
            {t.relatedAll}
          </Ligacao>
        </div>
        <PostList posts={posts} variante="relacionado" tituloAs="h3" />
      </div>
    </section>
  );
}
