import type { Metadata } from "next";
import Link from "@/i18n/locale-link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LinkArrow } from "@/components/ui/link-arrow";
import { ComoFunciona } from "@/components/servicos/como-funciona";
import { GanhaExige } from "@/components/servicos/ganha-exige";
import { IconeServico } from "@/components/servicos/icones";
import { ListaVerificada } from "@/components/servicos/lista-verificada";
import { Pagamentos } from "@/components/servicos/pagamentos";
import { Tabela } from "@/components/servicos/tabela";
import { getAllServices, getServiceBySlug } from "@/lib/content";
import { getDictionary } from "@/i18n/dictionaries";
import { hasLocale } from "@/i18n/config";
import { pageMetadata } from "@/i18n/metadata";

type Props = { params: Promise<{ lang: string; slug: string }> };

// Ficha de produto migrada do frame "Página · Serviço · Loja online (desktop)" (YSyrf)
// do design/design-system.pen — o template partilhado pelos 7 produtos do catálogo
// (PRD-servicos.md §4). Rota dinâmica: um ficheiro por produto em content/services/**.
//
// Blocos condicionais do PRD (§4) que ficam de fora enquanto não houver conteúdo real:
// projetos relacionados e testemunhos (`frontmatter.projects`/`testimonials` vazios na
// V1 — decisão D7 do PRD.md, nunca uma secção "em breve").

export function generateStaticParams({ params }: { params: { lang: string } }) {
  if (!hasLocale(params.lang)) return [];
  return getAllServices(params.lang).map((servico) => ({ slug: servico.slug }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
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

  return (
    <>
      <Nav currentPath="/servicos" />

      <main className="flex-1 px-lg pt-lg pb-3xl md:px-xl lg:px-2xl lg:pt-xl lg:pb-4xl">
        <div className="mx-auto flex max-w-[var(--grid-max-width)] flex-col gap-3xl lg:gap-4xl">
          {/* Cabeçalho do produto */}
          <div className="flex flex-col gap-lg">
            <nav aria-label={t.ficha.breadcrumbAria} className="flex items-center gap-xs">
              <Link
                href="/servicos"
                className="font-body text-caption font-medium text-text-link transition-colors hover:text-text-accent"
              >
                {t.ficha.breadcrumbServicos}
              </Link>
              <ChevronRight size={16} strokeWidth={2} aria-hidden className="text-text-tertiary" />
              <span className="font-body text-caption text-text-tertiary">{title}</span>
            </nav>

            <div className="flex items-start gap-lg">
              <span className="hidden size-16 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-accent-primary-subtle lg:flex">
                <IconeServico slug={servico.slug} size={32} className="text-text-accent" />
              </span>
              <div className="flex flex-col gap-md">
                <h1 className="font-heading text-headline font-bold tracking-[var(--letter-spacing-headline)] text-text-primary lg:text-display-sm lg:tracking-[var(--letter-spacing-display)]">
                  {title}
                </h1>
                {outcome ? (
                  <p className="font-body text-body-lg text-text-secondary lg:max-w-[760px]">
                    {outcome}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-sm lg:flex-row lg:items-center">
              <ButtonLink href="/contacto" size="lg" className="w-full lg:w-auto">
                {t.ficha.marcarConversa}
              </ButtonLink>
              <ButtonLink
                href={`/contacto?servico=${servico.slug}`}
                variant="secondary"
                size="lg"
                className="w-full lg:w-auto"
              >
                {t.ficha.pedirProposta}
              </ButtonLink>
              <ButtonLink
                href="/area-cliente/pedidos/novo"
                variant="tertiary"
                size="lg"
                className="w-full lg:w-auto"
              >
                {t.ficha.jaCliente}
              </ButtonLink>
            </div>
          </div>

          {/* O que é e para quem: só aparece se o serviço tiver texto no corpo do .md */}
          {blocos.length > 0 ? (
          <section aria-labelledby="o-que-e-titulo" className="flex flex-col gap-md">
            <h2
              id="o-que-e-titulo"
              className="font-heading text-headline font-bold tracking-[var(--letter-spacing-headline)] text-text-primary"
            >
              {t.ficha.oQueEParaQuem}
            </h2>
            <div className="flex flex-col gap-md lg:max-w-[860px]">
              {blocos.map((bloco) =>
                bloco.tipo === "lista" ? (
                  <ul key={bloco.itens[0]} className="flex flex-col gap-sm">
                    {bloco.itens.map((item) => (
                      <li key={item} className="flex gap-sm">
                        <span
                          aria-hidden
                          className="mt-[13px] size-1.5 shrink-0 rounded-full bg-text-accent"
                        />
                        <span className="font-body text-body-lg text-text-secondary">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p key={bloco.texto} className="font-body text-body-lg text-text-secondary">
                    {bloco.texto}
                  </p>
                )
              )}
            </div>
          </section>
          ) : null}

          {/* Blocos 3 e 7: opções e conteúdo específico do produto */}
          {extraSections.map((secao) => (
            <section key={secao.title} className="flex flex-col gap-lg">
              <h2 className="font-heading text-headline font-bold tracking-[var(--letter-spacing-headline)] text-text-primary">
                {secao.title}
              </h2>

              {secao.intro.length > 0 ? (
                <div className="flex flex-col gap-md lg:max-w-[860px]">
                  {secao.intro.map((p) => (
                    <p key={p} className="font-body text-body-lg text-text-secondary">
                      {p}
                    </p>
                  ))}
                </div>
              ) : null}

              {secao.table ? <Tabela
                  columns={secao.table.columns}
                  rows={secao.table.rows}
                  recommendedLabel={t.tabela.recomendacao}
                /> : null}

              {secao.items.length > 0 && !secao.table ? (
                secao.ordered ? (
                  <ol className="flex flex-col gap-md">
                    {secao.items.map((item, i) => (
                      <li key={item} className="flex gap-md">
                        <span
                          aria-hidden
                          className="w-8 shrink-0 font-mono text-body-lg font-semibold text-text-accent"
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p className="font-body text-body text-text-secondary">{item}</p>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <ul className="flex flex-col gap-sm">
                    {secao.items.map((item) => (
                      <li key={item} className="flex gap-sm">
                        <span
                          aria-hidden
                          className="mt-[11px] size-1.5 shrink-0 rounded-full bg-text-tertiary"
                        />
                        <p className="font-body text-body text-text-secondary">{item}</p>
                      </li>
                    ))}
                  </ul>
                )
              ) : null}

              {secao.note ? (
                <p className="font-body text-body text-text-tertiary italic">{secao.note}</p>
              ) : null}
            </section>
          ))}

          {showPayments ? <Pagamentos lang={lang} /> : null}

          {/* O que está incluído */}
          <section aria-labelledby="incluido-titulo" className="flex flex-col gap-lg">
            <h2
              id="incluido-titulo"
              className="font-heading text-headline font-bold tracking-[var(--letter-spacing-headline)] text-text-primary"
            >
              {t.ficha.oQuePodeIncluir}
            </h2>
            <ListaVerificada items={includes} />
          </section>

          {/* O que ganha / o que isto exige */}
          {benefits.length > 0 && requires.length > 0 ? (
            <GanhaExige lang={lang} beneficios={benefits} exigencias={requires} tratamento={tratamento} />
          ) : null}

          {genericProcess ? <ComoFunciona lang={lang} /> : null}

          {/* Perguntas frequentes */}
          <section aria-labelledby="faq-titulo" className="flex flex-col gap-lg">
            <h2
              id="faq-titulo"
              className="font-heading text-headline font-bold tracking-[var(--letter-spacing-headline)] text-text-primary"
            >
              {t.ficha.perguntasFrequentes}
            </h2>
            <Accordion
              items={faq.map((f) => ({ question: f.q, answer: f.a }))}
              className="lg:max-w-[880px]"
            />
          </section>

          {/* Serviços relacionados — liga a ficha a outras, exigido pelo PRD (§3: nada
              de páginas órfãs). */}
          {relacionados.length > 0 ? (
            <section aria-labelledby="relacionados-titulo" className="flex flex-col gap-md">
              <h2
                id="relacionados-titulo"
                className="font-heading text-title-sm font-semibold tracking-[var(--letter-spacing-title)] text-text-primary"
              >
                {t.ficha.tambemInteressar}
              </h2>
              <div className="flex flex-wrap gap-lg">
                {relacionados.map((r) => (
                  <LinkArrow key={r.slug} href={`/servicos/${r.slug}`}>
                    {r.frontmatter.title}
                  </LinkArrow>
                ))}
              </div>
            </section>
          ) : null}

          <Card className="flex flex-col gap-md p-lg lg:flex-row lg:items-center lg:justify-between lg:gap-2xl lg:p-2xl">
            <div className="flex flex-col gap-md lg:gap-xs">
              <h2 className="font-heading text-title-sm font-semibold tracking-[var(--letter-spacing-title)] text-text-primary lg:text-title">
                {t.ficha.ctaTitulo}
              </h2>
              <p className="font-body text-body text-text-secondary">
                {t.ficha.ctaTexto}
              </p>
            </div>

            <ButtonLink href="/contacto" size="lg" className="w-full lg:w-auto">
              {t.ficha.marcarConversa}
            </ButtonLink>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  );
}
