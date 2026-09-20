import type { Metadata } from "next";
import { CircleSlash, LifeBuoy, MessagesSquare } from "lucide-react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getDictionary } from "@/i18n/dictionaries";
import { hasLocale } from "@/i18n/config";
import { pageMetadata } from "@/i18n/metadata";
import { notFound } from "next/navigation";

// Sobre migrada dos frames tJSRH (desktop, 1440) e U24nJG (mobile, 390) do
// design/design-system.pen. Copy do copy-draft.md §4, cinco blocos mais o fecho.
// Mobile first; md:(768) e lg:(1024) correspondem a $bp-mid/$bp-wide do .pen.

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/sobre">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { institucional } = await getDictionary(lang);
  return { ...institucional.sobre.metadata, ...pageMetadata(lang, "/sobre") };
}

const ICONES = [MessagesSquare, CircleSlash, LifeBuoy];

// Título de bloco: $font-size-title-sm no narrow e $font-size-title no wide.
const tituloBloco =
  "font-heading text-title-sm font-semibold tracking-[var(--letter-spacing-title)] text-text-primary lg:text-title";

export default async function Sobre({ params }: PageProps<"/[lang]/sobre">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { institucional } = await getDictionary(lang);
  const t = institucional.sobre;

  return (
    <>
      <Nav currentPath="/sobre" />

      <main className="flex-1 px-lg py-3xl md:px-xl lg:px-2xl lg:py-4xl">
        <div className="mx-auto flex max-w-[var(--grid-max-width)] flex-col gap-3xl lg:gap-4xl">
          {/* Bloco 1 · O que é a EvDigital */}
          <section className="flex flex-col gap-md lg:gap-lg">
            <p className="font-body text-caption font-medium tracking-[var(--letter-spacing-overline)] text-text-accent uppercase">
              {t.eyebrow}
            </p>

            <div className="flex flex-col gap-md lg:max-w-[920px] lg:gap-lg">
              {/* No narrow o .pen usa $font-size-headline-narrow (31), o mesmo valor de
                  --text-title, mas com a entrelinha de headline. */}
              <h1 className="font-heading text-title leading-[var(--line-height-headline)] font-bold tracking-[var(--letter-spacing-headline)] text-text-primary lg:text-display-sm lg:leading-[var(--line-height-display)] lg:tracking-[var(--letter-spacing-display)]">
                {t.title}
              </h1>

              <p className="font-body text-body text-text-secondary lg:max-w-[760px] lg:text-body-lg">
                {t.intro}
              </p>
            </div>
          </section>

          {/* Bloco 2 · Porque existimos */}
          <section aria-labelledby="sobre-porque-titulo" className="flex flex-col gap-lg lg:gap-xl">
            <h2 id="sobre-porque-titulo" className={tituloBloco}>
              {t.whyTitle}
            </h2>

            <Card className="p-lg lg:p-2xl">
              <div className="flex flex-col gap-md lg:max-w-[860px]">
                <span className="h-[3px] w-14 rounded-[var(--radius-pill)] bg-accent-primary" />

                <p className="font-heading text-body-lg leading-[var(--line-height-title)] font-semibold tracking-[var(--letter-spacing-title)] text-text-primary lg:text-title-sm">
                  {t.whyLead}
                </p>

                <p className="font-body text-body text-text-secondary lg:text-body-lg">
                  {t.whyP1}
                </p>

                <p className="font-body text-body text-text-secondary lg:text-body-lg">
                  {t.whyP2}
                </p>
              </div>
            </Card>
          </section>

          {/* Bloco 4 · Como trabalhamos */}
          <section
            aria-labelledby="sobre-como-titulo"
            className="flex flex-col gap-lg lg:gap-xl"
          >
            <h2 id="sobre-como-titulo" className={tituloBloco}>
              {t.howTitle}
            </h2>

            <ul className="flex flex-col">
              {t.how.map((texto, i) => {
                const Icone = ICONES[i];
                return (
                <li
                  key={texto}
                  className="flex items-center gap-md border-t border-border-subtle py-md lg:gap-lg lg:py-lg"
                >
                  <Icone
                    size={20}
                    strokeWidth={2}
                    aria-hidden
                    className="shrink-0 text-text-accent lg:size-6"
                  />
                  <p className="font-heading text-body-lg leading-[var(--line-height-title)] font-semibold tracking-[var(--letter-spacing-title)] text-text-primary lg:text-title-sm">
                    {texto}
                  </p>
                </li>
                );
              })}
            </ul>
          </section>

          {/* Fecho · CTA */}
          <section
            aria-label={t.ctaAria}
            className="flex flex-col items-center gap-md rounded-[var(--radius-xl-ds)] border border-border-subtle bg-bg-surface p-xl text-center lg:gap-lg lg:p-2xl"
          >
            <p className="font-body text-body text-text-secondary lg:max-w-[640px] lg:text-body-lg">
              {t.ctaText}
            </p>

            <ButtonLink href="/contacto" size="lg" className="w-full lg:w-auto">
              {t.ctaButton}
            </ButtonLink>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
