import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/layout/nav";
import { BarraPagina } from "@/components/layout/barra-pagina";
import { Footer } from "@/components/layout/footer";
import { FechoPagina } from "@/components/ui/fecho-pagina";
import { LinhaTexto, ListaTexto } from "@/components/ui/linha-texto";
import { getDictionary } from "@/i18n/dictionaries";
import { hasLocale } from "@/i18n/config";
import { pageMetadata } from "@/i18n/metadata";

// Sobre migrada do grupo "Ecrã · Sobre" de "v2 · A vez" (flhgP) do
// design/design-system.pen: "Sobre · desktop 1280" (H19Dt) e "Sobre · mobile 375" (rlACb).
// Uma coluna com as margens de layout; sem cartões nem traço de cor.
// - O que é a EvDigital: sobretítulo $font-mono caption $text-tertiary com
//   $letter-spacing-overline (o único da página), título $font-size-display
//   ($font-size-display-narrow em mobile) e introdução body-lg (680 em lg). Padding
//   [$space-4xl, 0] e gap $space-lg em lg; [$space-2xl, 0, $space-3xl, 0] e gap $space-md
//   abaixo.
// - Porque existimos: em lg, título na Margem (colunas 1 a 3, $font-size-title-sm
//   $text-secondary) e a coluna principal (afirmação $font-size-headline de 680 e os dois
//   parágrafos body-lg de 760); abaixo empilham com gap $space-md e o título em
//   $font-size-title.
// - Como trabalhamos: título $font-size-title e as três afirmações como
//   ds/display/linha-texto na variante afirmação, com a régua superior no contentor.
// - Fecho: ds/layout/fecho-pagina sem título, na coluna principal.

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/sobre">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { institucional } = await getDictionary(lang);
  return { ...institucional.sobre.metadata, ...pageMetadata(lang, "/sobre") };
}

export default async function Sobre({ params }: PageProps<"/[lang]/sobre">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { institucional, erros } = await getDictionary(lang);
  const t = institucional.sobre;

  return (
    <>
      <Nav currentPath="/sobre" />

      <main className="flex-1 px-lg md:px-xl lg:px-2xl">
        <BarraPagina titulo={t.eyebrow} voltarHref="/" voltarLabel={erros.naoEncontrada.home} />
        <div className="mx-auto w-full max-w-[var(--grid-max-width)]">
          <section className="flex flex-col gap-md pt-lg pb-3xl lg:gap-lg lg:pt-xl lg:pb-4xl">
            <p className="font-heading text-[length:var(--font-size-display-narrow)] leading-[var(--line-height-display)] font-bold tracking-[var(--letter-spacing-display)] text-text-primary lg:text-display">
              {t.title}
            </p>
            <p className="font-body text-body text-text-secondary lg:max-w-[680px] lg:text-body-lg">
              {t.intro}
            </p>
          </section>

          <section
            aria-labelledby="sobre-porque-titulo"
            className="flex flex-col gap-md pb-3xl lg:grid lg:grid-cols-12 lg:gap-x-lg lg:gap-y-0 lg:pb-4xl"
          >
            <h2
              id="sobre-porque-titulo"
              className="font-heading text-title leading-[var(--line-height-title)] font-semibold tracking-[var(--letter-spacing-title)] text-text-secondary lg:col-span-3 lg:text-title-sm"
            >
              {t.whyTitle}
            </h2>
            <div className="flex flex-col gap-md lg:col-span-9">
              <p className="font-heading text-title leading-[var(--line-height-title)] font-semibold tracking-[var(--letter-spacing-title)] text-text-primary lg:max-w-[680px] lg:text-headline lg:leading-[var(--line-height-headline)] lg:tracking-[var(--letter-spacing-headline)]">
                {t.whyLead}
              </p>
              <p className="font-body text-body text-text-secondary lg:max-w-[760px] lg:text-body-lg">
                {t.whyP1}
              </p>
              <p className="font-body text-body text-text-secondary lg:max-w-[760px] lg:text-body-lg">
                {t.whyP2}
              </p>
            </div>
          </section>

          <section
            aria-labelledby="sobre-como-titulo"
            className="flex flex-col gap-md pb-2xl lg:pb-3xl"
          >
            <h2
              id="sobre-como-titulo"
              className="font-heading text-title leading-[var(--line-height-title)] font-semibold tracking-[var(--letter-spacing-title)] text-text-primary"
            >
              {t.howTitle}
            </h2>
            <ListaTexto>
              {t.how.map((texto) => (
                <LinhaTexto key={texto} variante="afirmacao">
                  {texto}
                </LinhaTexto>
              ))}
            </ListaTexto>
          </section>

          <section
            aria-label={t.ctaAria}
            className="pb-2xl lg:grid lg:grid-cols-12 lg:gap-x-lg lg:pb-3xl"
          >
            <FechoPagina
              texto={t.ctaText}
              acao={t.ctaButton}
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
