import { Fragment } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceJsonLd } from "@/components/seo/json-ld";
import { Nav } from "@/components/layout/nav";
import { BarraPagina } from "@/components/layout/barra-pagina";
import { Footer } from "@/components/layout/footer";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { FechoPagina } from "@/components/ui/fecho-pagina";
import { Ligacao } from "@/components/ui/ligacao";
import { LinhaTexto, ListaTexto } from "@/components/ui/linha-texto";
import { ComoFunciona } from "@/components/servicos/como-funciona";
import { GanhaExige } from "@/components/servicos/ganha-exige";
import { Pagamentos } from "@/components/servicos/pagamentos";
import { Tabela } from "@/components/servicos/tabela";
import { getAllServices, getServiceBySlug } from "@/lib/content";
import { getDictionary } from "@/i18n/dictionaries";
import { hasLocale } from "@/i18n/config";
import { pageMetadata } from "@/i18n/metadata";
import { cn } from "@/lib/cn";

type Props = { params: Promise<{ lang: string; slug: string }> };

// Ficha de serviço migrada do grupo "Ecrã · Serviço (ficha)" de "v2 · A vez" (flhgP) do
// design/design-system.pen: "Serviço · Loja online" (etpw3 desktop 1280, t85bq mobile 375)
// e "Serviço · Automação e integrações (avançado)" (w4tfa, O4HUF). Uma rota para os
// serviços de content/<lang>/services/**; os blocos aparecem conforme o frontmatter.
//
// Uma coluna com as margens de layout; em lg as secções com Margem usam a grelha de 12
// (Margem = colunas 1 a 3, 278 no .pen; coluna principal = 4 a 12). Por secção:
// - topo: ds/navigation/voltar ("Serviços") como primeira linha, título $font-size-display
//   ($font-size-display-narrow em mobile), resultado body-lg (body) com 760 de largura, e as
//   acções a $space-xs: botão primário (56) e ligações. Padding [$space-xl, 0, $space-4xl,
//   0] ([$space-lg, 0, $space-3xl, 0] em mobile), gap $space-lg ($space-md).
// - pagamentos (só Loja online) e "como funciona" (só `genericProcess`): componentes
//   próprios em components/servicos/.
// - "O que poderá incluir": família A como a Loja online (título $font-size-title e duas
//   colunas de registo, gap $space-2xl); família B como a Automação (título na Margem e o
//   registo na coluna principal). Em mobile, uma lista.
// - perguntas frequentes: ds/disclosure/accordion-item "vez" (override da ficha); família A
//   com o título na Margem, família B com o título por cima da lista na coluna principal.
// - "Também pode interessar" e o fecho (ds/layout/fecho-pagina) na coluna principal.
//
// Blocos sem conteúdo real ficam de fora (nunca uma secção "em breve"): corpo do .md,
// extraSections, "o que ganha / o que exige", projetos relacionados e testemunhos
// (decisão D7 do PRD.md). Sem scroll reveal.

const tituloSeccao =
  "font-heading text-title font-semibold tracking-[var(--letter-spacing-title)] text-text-primary";

export function generateStaticParams({ params }: { params: { lang: string } }) {
  if (!hasLocale(params.lang)) return [];
  return getAllServices(params.lang).map((servico) => ({ slug: servico.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const servico = getServiceBySlug(lang, slug);
  if (!servico) return {};

  return {
    title: servico.frontmatter.seo.title,
    description: servico.frontmatter.seo.description,
    keywords: servico.frontmatter.seo.keywords,
    ...pageMetadata(lang, `/servicos/${slug}`),
  };
}

export default async function ServicoPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const servico = getServiceBySlug(lang, slug);
  if (!servico) notFound();
  const t = (await getDictionary(lang)).servicos;

  const { frontmatter, content } = servico;
  const {
    title,
    family,
    outcome,
    audience,
    extraSections,
    showPayments,
    includes,
    benefits,
    requires,
    genericProcess,
    faq,
    related,
  } = frontmatter;
  const avancado = family === "B";

  // O corpo do .md é texto simples separado por linhas em branco. Um bloco em que todas
  // as linhas começam por "- " é uma lista; qualquer outro é um parágrafo.
  const blocos = content
    .trim()
    .split(/\n{2,}/)
    .map((bloco) => {
      const linhas = bloco
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      if (linhas.length > 0 && linhas.every((l) => l.startsWith("- "))) {
        return { tipo: "lista" as const, itens: linhas.map((l) => l.slice(2)) };
      }
      return { tipo: "paragrafo" as const, texto: linhas.join(" ") };
    })
    .filter((b) => (b.tipo === "lista" ? b.itens.length > 0 : b.texto.length > 0));

  const tratamento = audience === "A" ? "voce" : "voces";
  const relacionados = related
    .map((relatedSlug) => getServiceBySlug(lang, relatedSlug))
    .filter((s): s is NonNullable<typeof s> => s !== null);

  const meio = Math.ceil(includes.length / 2);
  const colunasIncluir = [includes.slice(0, meio), includes.slice(meio)].filter(
    (coluna) => coluna.length > 0,
  );

  return (
    <>
      <ServiceJsonLd
        lang={lang}
        slug={slug}
        name={title}
        description={frontmatter.seo.description}
        faq={faq}
      />
      <Nav currentPath="/servicos" />

      <main className="flex-1 px-lg md:px-xl lg:px-2xl">
        <BarraPagina
          titulo={title.split("/").map((parte, i) => (
            <Fragment key={parte}>
              {i > 0 ? (
                <>
                  /<wbr />
                </>
              ) : null}
              {parte}
            </Fragment>
          ))}
          voltarHref="/servicos"
          voltarLabel={t.ficha.breadcrumbServicos}
        />
        <div className="mx-auto w-full max-w-[var(--grid-max-width)]">
          {/* Secção · topo (o título e o «voltar» vivem na BarraPagina) */}
          <div className="flex flex-col gap-md pt-lg pb-3xl lg:gap-lg lg:pt-xl lg:pb-4xl">
            {outcome ? (
              <p className="font-body text-body text-text-secondary lg:max-w-[760px] lg:text-body-lg">
                {outcome}
              </p>
            ) : null}

            <div className="flex flex-col items-start gap-xs pt-xs lg:flex-row lg:items-center lg:gap-lg">
              <ButtonLink
                href={`/contacto?servico=${servico.slug}`}
                size="action"
                className="w-full tracking-[var(--letter-spacing-label)] md:w-auto"
              >
                {t.ficha.marcarConversa}
              </ButtonLink>
            </div>
          </div>

          {/* O que é e para quem: só com texto no corpo do .md */}
          {blocos.length > 0 ? (
            <section
              aria-labelledby="o-que-e-titulo"
              className="flex flex-col gap-md pb-3xl lg:gap-lg lg:pb-4xl"
            >
              <h2 id="o-que-e-titulo" className={tituloSeccao}>
                {t.ficha.oQueEParaQuem}
              </h2>
              {blocos.map((bloco) =>
                bloco.tipo === "lista" ? (
                  <ListaTexto key={bloco.itens[0]}>
                    {bloco.itens.map((item) => (
                      <LinhaTexto key={item}>{item}</LinhaTexto>
                    ))}
                  </ListaTexto>
                ) : (
                  <p
                    key={bloco.texto}
                    className="font-body text-body text-text-secondary lg:max-w-[760px] lg:text-body-lg"
                  >
                    {bloco.texto}
                  </p>
                ),
              )}
            </section>
          ) : null}

          {/* Opções e conteúdo específico do produto (PRD-servicos.md §4, blocos 3 e 7) */}
          {extraSections.map((secao) => (
            <section key={secao.title} className="flex flex-col gap-md pb-3xl lg:gap-lg lg:pb-4xl">
              <h2 className={tituloSeccao}>{secao.title}</h2>

              {secao.intro.map((p) => (
                <p
                  key={p}
                  className="font-body text-body text-text-secondary lg:max-w-[760px] lg:text-body-lg"
                >
                  {p}
                </p>
              ))}

              {secao.table ? (
                <Tabela
                  columns={secao.table.columns}
                  rows={secao.table.rows}
                  recommendedLabel={t.tabela.recomendacao}
                />
              ) : null}

              {secao.items.length > 0 && !secao.table ? (
                secao.ordered ? (
                  <ol className="flex flex-col border-t border-border-default">
                    {secao.items.map((item, i) => (
                      <LinhaTexto key={item}>
                        <span className="flex gap-md">
                          <span aria-hidden className="w-8 shrink-0 font-mono text-text-tertiary">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span>{item}</span>
                        </span>
                      </LinhaTexto>
                    ))}
                  </ol>
                ) : (
                  <ListaTexto>
                    {secao.items.map((item) => (
                      <LinhaTexto key={item}>{item}</LinhaTexto>
                    ))}
                  </ListaTexto>
                )
              ) : null}

              {secao.note ? (
                <p className="font-body text-body text-text-tertiary">{secao.note}</p>
              ) : null}
            </section>
          ))}

          {showPayments ? <Pagamentos lang={lang} /> : null}

          {/* Secção · o que poderá incluir */}
          <section
            aria-labelledby="incluido-titulo"
            className={cn(
              "flex flex-col gap-md pb-3xl lg:pb-4xl",
              avancado ? "lg:grid lg:grid-cols-12 lg:gap-x-lg lg:gap-y-0" : "lg:gap-lg",
            )}
          >
            <h2 id="incluido-titulo" className={cn(tituloSeccao, avancado && "lg:col-span-3")}>
              {t.ficha.oQuePodeIncluir}
            </h2>
            {avancado ? (
              <ListaTexto className="lg:col-span-9">
                {includes.map((item) => (
                  <LinhaTexto key={item} grande>
                    {item}
                  </LinhaTexto>
                ))}
              </ListaTexto>
            ) : (
              <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-2xl">
                {colunasIncluir.map((coluna, i) => (
                  <ul
                    key={coluna[0]}
                    className={cn(
                      "flex flex-col border-border-default",
                      // Em mobile é uma só lista: a segunda coluna não repete a régua de cima.
                      i === 0 ? "border-t" : "lg:border-t",
                    )}
                  >
                    {coluna.map((item) => (
                      <LinhaTexto key={item}>{item}</LinhaTexto>
                    ))}
                  </ul>
                ))}
              </div>
            )}
          </section>

          {benefits.length > 0 && requires.length > 0 ? (
            <GanhaExige
              lang={lang}
              beneficios={benefits}
              exigencias={requires}
              tratamento={tratamento}
            />
          ) : null}

          {genericProcess ? <ComoFunciona lang={lang} /> : null}

          {/* Secção · perguntas frequentes */}
          <section
            aria-labelledby="faq-titulo"
            className={cn(
              "flex flex-col gap-md pb-2xl lg:grid lg:grid-cols-12 lg:gap-x-lg lg:gap-y-0 lg:pb-3xl",
              !avancado && "lg:pt-2xl",
            )}
          >
            <div
              className={cn(
                "flex flex-col gap-md",
                avancado ? "lg:col-span-9 lg:col-start-4" : "lg:contents",
              )}
            >
              <h2 id="faq-titulo" className={cn(tituloSeccao, !avancado && "lg:col-span-3")}>
                {t.ficha.perguntasFrequentes}
              </h2>
              <Accordion
                items={faq.map((f) => ({ question: f.q, answer: f.a }))}
                variant="vez-ficha"
                className={cn("border-t border-border-default", !avancado && "lg:col-span-9")}
              />
            </div>
          </section>

          {/* Secção · também pode interessar: liga a ficha a outras (PRD §3, sem órfãs) */}
          {relacionados.length > 0 ? (
            <section
              aria-labelledby="relacionados-titulo"
              className="pb-lg lg:grid lg:grid-cols-12 lg:gap-x-lg lg:py-xl"
            >
              <div className="flex flex-col gap-2xs lg:col-span-9 lg:col-start-4">
                <h2
                  id="relacionados-titulo"
                  className="font-heading text-title-sm font-semibold tracking-[var(--letter-spacing-title)] text-text-primary"
                >
                  {t.ficha.tambemInteressar}
                </h2>
                <ul className="flex flex-col lg:flex-row lg:flex-wrap lg:gap-x-lg">
                  {relacionados.map((r) => (
                    <li key={r.slug}>
                      <Ligacao href={`/servicos/${r.slug}`} variant="acao">
                        {r.frontmatter.title}
                      </Ligacao>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ) : null}

          {/* Secção · fecho */}
          <section
            aria-labelledby="fecho-titulo"
            className="pb-2xl lg:grid lg:grid-cols-12 lg:gap-x-lg lg:pb-3xl"
          >
            <FechoPagina
              titulo={t.ficha.ctaTitulo}
              tituloId="fecho-titulo"
              texto={t.ficha.ctaTexto}
              acao={t.ficha.marcarConversa}
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
