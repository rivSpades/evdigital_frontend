import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { BackLink } from "@/components/area-cliente/back-link";
import { ButtonLink } from "@/components/ui/button";
import { Percurso } from "@/components/consultores/percurso";
import {
  Apresentacao,
  Competencias,
  IdiomasHabilitacoes,
} from "@/components/consultores/secoes-detalhe";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { LinhaAccao } from "@/components/ui/linha-accao";
import { LinhaSalario } from "@/components/ui/linha-salario";
import { Retrato } from "@/components/ui/retrato";
import { RevealScope } from "@/components/ui/reveal";
import { hasLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { lerConsultor } from "@/lib/consultants/backend";
import {
  anoInicio,
  competencias,
  formatarEuros,
  iniciais,
  itensPerfil,
  paragrafos,
  periodoEtapa,
} from "@/lib/consultants/format";

// Detalhe do consultor migrado de «Consultores · detalhe» do design-system.pen: K5am3W
// (desktop 1280, dois salários, etapa 3 em destaque), P1Q4VK (só uma linha de salário),
// x88y6j (tablet 768) e l81Qkh (mobile 375). Página escondida: sem ligação no Nav nem no
// Footer, noindex, sem cue de scroll.
// - Secção · hero: ds/navigation/voltar (só a seta, para a lista) e depois o Hero. Padding
//   [$space-xl, 0, $space-4xl, 0] ([$space-lg, 0, $space-3xl, 0] em mobile), gap $space-lg
//   em lg e $space-xl abaixo.
//   · lg: retrato 278x348 à esquerda; coluna de texto (gap $space-2xl) com Identidade (nome
//     em display, headline body-lg de 600, gap $space-md), Salário esperado (420) e Acções.
//   · tablet: retrato 200x250 com a Identidade ao lado, alinhada em baixo (nome em
//     display-sm); Salário e Acções por baixo, a toda a largura da página.
//   · mobile: tudo empilhado, retrato 120x150, nome em display-narrow, headline body;
//     botões a toda a largura (gap $space-sm) e «Descarregar CV» por baixo.
// - Secção · apresentação (NSclt/BRPBt/w0ws7), competências (fS6QZ/e7iCjq/szjje) e idiomas e
//   habilitações (mOu9k/pVlac/SCHqf): components/consultores/secoes-detalhe.tsx.
// - Secção · percurso: components/consultores/percurso.tsx (movimento da nota t395ry).
// - Hero: sem botões. «Descarregar CV» é a última linha do registo «Salário esperado»
//   (components/ui/linha-accao.tsx). o único botão «Entre em contacto» vive apenas no fecho, que em
//   mobile é uma barra sticky ao fundo do ecrã (decisão do dono, sobrepõe os frames do hero).
// - Secção · fecho: ds/layout/fecho-pagina só com as duas acções (título e texto desligados
//   no .pen), régua superior, padding-bottom $space-4xl ($space-3xl em mobile).
// Salário: cada linha só aparece com valor (ds/display/linha-salario); sem nenhum, o bloco
// inteiro desaparece. Ordem: Hero, Apresentação, Competências, Percurso, Idiomas e
// Habilitações, fecho; cada secção sem dados não se desenha.

const consultor = cache((slug: string, lang: Locale) => lerConsultor(slug, lang));

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/consultants/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const dados = await consultor(slug, lang);
  if (!dados) return { robots: { index: false, follow: false } };
  // Pré-visualização de ligação (LinkedIn, WhatsApp, etc.): precisa de og:title, og:description
  // e og:image com URL absoluto. A página continua `noindex` (não há marketing de consultores).
  const base = (process.env.SITE_URL ?? "https://www.evdigital.eu").replace(/\/$/, "");
  return {
    title: dados.name,
    description: dados.headline,
    robots: { index: false, follow: false },
    openGraph: {
      type: "profile",
      siteName: "EvDigital",
      title: dados.name,
      description: dados.headline,
      url: `${base}/${lang}/consultants/${dados.slug}`,
      images: dados.has_photo
        ? [{ url: `${base}/api/consultants/${dados.slug}/photo`, alt: dados.name }]
        : undefined,
    },
    twitter: { card: "summary", title: dados.name, description: dados.headline },
  };
}

export default async function ConsultorPage({ params }: PageProps<"/[lang]/consultants/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const dados = await consultor(slug, lang);
  if (!dados) notFound();

  const { consultores: t } = await getDictionary(lang);
  const d = t.detalhe;

  const salarios = [
    { termo: d.contrato, valor: formatarEuros(dados.contract_monthly_eur, lang) },
    { termo: d.freelancer, valor: formatarEuros(dados.freelance_hourly_eur, lang) },
  ].filter((linha): linha is { termo: string; valor: string } => linha.valor !== null);

  const etapas = dados.steps.map((etapa) => ({
    periodo: periodoEtapa(etapa, d),
    ano: anoInicio(etapa),
    funcao: etapa.role,
    organizacao: etapa.organisation,
    historia: etapa.story,
  }));

  // Sem ?opcao: o wizard abre no passo de escolha (mensagem ou reunião).
  const contacto = `/consultants/${dados.slug}/contacto`;

  return (
    <>
      <Nav />

      <RevealScope className="flex-1 px-lg md:px-xl lg:px-2xl">
        <div className="mx-auto w-full max-w-[var(--grid-max-width)]">
          <section className="flex flex-col gap-xl pt-lg pb-3xl md:pt-xl md:pb-4xl lg:gap-lg">
            <BackLink href="/consultants" label={d.backToList} />

            <div className="grid grid-cols-1 gap-y-xl md:grid-cols-[200px_minmax(0,1fr)] md:gap-x-lg lg:grid-cols-[278px_minmax(0,1fr)] lg:grid-rows-[auto_auto_auto_1fr] lg:gap-y-2xl">
              <Retrato
                src={dados.has_photo ? `/api/consultants/${dados.slug}/photo` : null}
                nome={dados.name}
                iniciais={iniciais(dados.name)}
                prioritaria
                sizes="(min-width: 1024px) 278px, (min-width: 768px) 200px, 120px"
                className="h-[150px] w-[120px] md:col-start-1 md:row-start-1 md:h-[250px] md:w-[200px] lg:row-span-4 lg:h-[348px] lg:w-[278px]"
              />

              <div className="-mt-xs flex flex-col gap-sm md:col-start-2 md:row-start-1 md:mt-0 md:self-end lg:gap-md lg:self-start">
                <h1 className="font-heading text-[length:var(--font-size-display-narrow)] leading-[var(--line-height-display)] font-bold tracking-[var(--letter-spacing-display)] text-text-primary md:text-display-sm lg:text-display">
                  {dados.name}
                </h1>
                <p className="font-body text-body text-text-secondary md:text-body-lg lg:max-w-[600px]">
                  {dados.headline}
                </p>
              </div>

              <div className="flex w-full flex-col gap-sm md:col-span-2 md:max-w-[420px] lg:col-span-1 lg:col-start-2">
                {salarios.length > 0 ? (
                  <p className="font-body text-body leading-[var(--line-height-label)] font-medium text-text-primary">
                    {d.salario}
                  </p>
                ) : null}
                <div className="flex flex-col border-t border-border-default">
                  {salarios.length > 0 ? (
                    <dl className="flex flex-col">
                      {salarios.map((linha) => (
                        <LinhaSalario key={linha.termo} termo={linha.termo} valor={linha.valor} />
                      ))}
                    </dl>
                  ) : null}
                  <LinhaAccao
                    href={`/api/consultants/${dados.slug}/cv?lang=${lang}`}
                    rotulo={d.descarregarCv}
                  />
                </div>
              </div>
            </div>
          </section>

          <Apresentacao titulo={t.cv.apresentacao} paragrafos={paragrafos(dados.bio)} />

          <Competencias titulo={t.cv.competencias} grupos={competencias(dados.skills)} />

          <Percurso titulo={d.percurso} etapas={etapas} />

          <IdiomasHabilitacoes
            tituloIdiomas={d.idiomas}
            tituloHabilitacoes={d.habilitacoes}
            idiomas={itensPerfil(dados.languages)}
            habilitacoes={itensPerfil(dados.qualifications)}
          />

          {/* Só aqui há o botão «Entre em contacto» (abre o wizard). Em mobile a barra fica colada ao
              fundo do ecrã (sticky) enquanto o fecho não chega; a partir de md é o fecho normal. */}
          <section data-barra-fixa className="sticky bottom-0 z-10 -mx-lg border-t border-border-default bg-bg-base px-lg py-md md:static md:mx-0 md:bg-transparent md:px-0 md:py-0 md:pb-4xl">
            <ButtonLink
              href={contacto}
              size="action"
              className="w-full tracking-[var(--letter-spacing-label)] md:my-2xl md:w-auto"
            >
              {d.contactar}
            </ButtonLink>
          </section>
        </div>
      </RevealScope>

      <Footer />
    </>
  );
}
