import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { Nav } from "@/components/layout/nav";
import { BarraPagina } from "@/components/layout/barra-pagina";
import { Footer } from "@/components/layout/footer";
import { ProjetoCartao } from "@/components/ui/projeto-cartao";
import { getAllProjects } from "@/lib/content";
import { hostLabel } from "@/lib/url";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";

// Listagem de projetos (redesenho 2026-09-25, pedido do dono: o registo de texto com Ficha
// rápida não escalava para vários projetos). Os projetos vêm de content/<lang>/projects/**;
// cada um é um ds/display/projeto-cartao com capa (frontmatter `cover`, em public/projects).
// - Secção · projetos: padding-bottom $space-4xl ($space-3xl em mobile). Uma coluna em
//   mobile, duas em lg com gap $space-xl (nunca 3). Um só projeto ocupa a largura toda
//   (capa e texto lado a lado), para não deixar uma célula vazia.
// A Ficha rápida vive só na página do projeto.

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
  const { projetos: t, erros } = await getDictionary(lang);
  const projetos = getAllProjects(lang);

  return (
    <>
      <Nav currentPath="/projetos" />

      <main className="flex-1 px-lg md:px-xl lg:px-2xl">
        <BarraPagina titulo={t.title} voltarHref="/" voltarLabel={erros.naoEncontrada.home} />
        <div className="mx-auto w-full max-w-[var(--grid-max-width)] pt-lg lg:pt-xl">
          <section aria-label={t.listLabel} className="pb-3xl lg:pb-4xl">
            <ul className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-x-xl">
              {projetos.map(({ slug, frontmatter }, i) => (
                <ProjetoCartao
                  key={slug}
                  destaque={projetos.length === 1}
                  prioritaria={i < 2}
                  estado={frontmatter.url ? t.statusLive : undefined}
                  nome={frontmatter.title}
                  resumo={frontmatter.summary}
                  stack={frontmatter.stack.join(", ")}
                  href={`/projetos/${slug}`}
                  ligacao={t.viewProjectShort}
                  cover={frontmatter.cover}
                  url={frontmatter.url}
                  host={frontmatter.url ? hostLabel(frontmatter.url) : undefined}
                />
              ))}
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
