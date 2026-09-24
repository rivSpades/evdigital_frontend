import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { BackLink } from "@/components/area-cliente/back-link";
import { EstadoTexto } from "@/components/ui/estado-texto";
import { Facto, Factos } from "@/components/ui/facto";
import { FechoPagina } from "@/components/ui/fecho-pagina";
import { LigacaoExterna } from "@/components/ui/ligacao-externa";
import { getAllProjects, getProjectBySlug } from "@/lib/content";
import { hostLabel } from "@/lib/url";
import { locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";

// Ficha de projeto migrada do grupo "Ecrã · Projetos" de "v2 · A vez" (flhgP) do
// design/design-system.pen: "Projeto · EvPlanner (ficha)" (BWPLE desktop 1280, P2PlNZ
// mobile 375). Rota dinâmica: um ficheiro por projeto em content/<lang>/projects/**.
// - Secção · topo: ds/navigation/voltar ("Projetos") como primeira linha a seguir à barra
//   de topo, alinhado à margem; depois estado (só a palavra), título $font-size-display
//   ($font-size-display-narrow em mobile) e descrição (body-lg, 720, em lg). Padding
//   [$space-xl, 0, $space-4xl, 0] e gap $space-lg em lg; [$space-lg, 0, $space-2xl, 0] e
//   gap $space-md abaixo.
// - Secção · corpo: em lg, Margem · ficha (colunas 1 a 3: "Stack usada" em
//   ds/display/facto e "Ver o projeto") e a coluna principal "O que é" (4 a 12, parágrafos
//   body-lg de 760). Abaixo: "O que é" primeiro, a ficha depois, gap $space-2xl.
// - Secção · fecho: ds/layout/fecho-pagina sem título, na coluna principal.
//
// Os testemunhos existem no schema mas estão vazios, por isso não há secção de
// testemunhos nesta página (decisão do PRD D7: nada de "em breve").

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    getAllProjects(lang).map((projeto) => ({ lang, slug: projeto.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/projetos/[slug]">): Promise<Metadata> {
  const { slug, lang } = await params;
  const projeto = getProjectBySlug(lang as Locale, slug);
  if (!projeto) return {};

  return {
    title: projeto.frontmatter.title,
    description: projeto.frontmatter.description,
    ...pageMetadata(lang as Locale, `/projetos/${slug}`),
  };
}

// Rótulo de secção da margem: caption $text-tertiary.
const rotuloMargem = "font-body text-caption text-text-tertiary";

export default async function ProjetoPage({ params }: PageProps<"/[lang]/projetos/[slug]">) {
  const { slug, lang } = await params;
  const { projetos: t } = await getDictionary(lang as Locale);
  const projeto = getProjectBySlug(lang as Locale, slug);
  if (!projeto) notFound();

  const { frontmatter, content } = projeto;
  const { title, description, stack, stackGroups, url } = frontmatter;

  const paragrafos = content
    .trim()
    .split(/\n{2,}/)
    .map((paragrafo) => paragrafo.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  return (
    <>
      <Nav currentPath="/projetos" />

      <main className="flex-1 px-lg md:px-xl lg:px-2xl">
        <div className="mx-auto w-full max-w-[var(--grid-max-width)]">
          <div className="flex flex-col gap-md pt-lg pb-2xl lg:gap-lg lg:pt-xl lg:pb-4xl">
            <BackLink href="/projetos" label={t.backToList} />

            <div className="flex flex-col gap-sm lg:gap-md">
              {url ? <EstadoTexto tom="primario">{t.statusLive}</EstadoTexto> : null}
              <h1 className="font-heading text-[length:var(--font-size-display-narrow)] leading-[var(--line-height-display)] font-bold tracking-[var(--letter-spacing-display)] text-text-primary lg:text-display">
                {title}
              </h1>
              <p className="font-body text-body text-text-secondary lg:max-w-[720px] lg:text-body-lg">
                {description}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2xl pb-xl lg:grid lg:grid-cols-12 lg:gap-x-lg lg:gap-y-0 lg:pb-3xl">
            <section
              aria-labelledby="o-que-e"
              className="flex flex-col gap-md lg:col-span-9 lg:col-start-4 lg:row-start-1"
            >
              <h2
                id="o-que-e"
                className="font-heading text-title leading-[var(--line-height-title)] font-semibold tracking-[var(--letter-spacing-title)] text-text-primary lg:text-title-sm"
              >
                {t.about}
              </h2>
              {paragrafos.map((paragrafo) => (
                <p
                  key={paragrafo}
                  className="font-body text-body text-text-secondary lg:max-w-[760px] lg:text-body-lg"
                >
                  {paragrafo}
                </p>
              ))}
            </section>

            <aside className="flex flex-col gap-xl lg:col-span-3 lg:col-start-1 lg:row-start-1">
              <div className="flex flex-col gap-sm">
                <h2 className={rotuloMargem}>{t.stackUsed}</h2>
                <Factos>
                  {stackGroups.length > 0
                    ? stackGroups.map((grupo) => (
                        <Facto
                          key={grupo.label}
                          termo={grupo.label}
                          valor={grupo.items.join(", ")}
                          valorTexto
                        />
                      ))
                    : stack.map((item) => <Facto key={item} valor={item} valorTexto />)}
                </Factos>
              </div>

              {url ? (
                <div className="flex flex-col gap-2xs">
                  <h2 className={rotuloMargem}>{t.visitTitle}</h2>
                  <p className="font-body text-body text-text-secondary">{t.visitText}</p>
                  <LigacaoExterna href={url} tom="link">
                    {hostLabel(url)}
                  </LigacaoExterna>
                </div>
              ) : null}
            </aside>
          </div>

          <section
            aria-label={t.ctaLabel}
            className="pb-2xl lg:grid lg:grid-cols-12 lg:gap-x-lg lg:pb-3xl"
          >
            <FechoPagina
              texto={t.ctaText}
              acao={t.ctaLabel}
              href="/contacto"
              className="lg:col-span-9 lg:col-start-4"
            />
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
