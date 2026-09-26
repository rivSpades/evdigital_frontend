import type { Metadata } from "next";
import { getDictionary } from "@/i18n/dictionaries";
import { defaultLocale, hasLocale } from "@/i18n/config";
import { pageMetadata } from "@/i18n/metadata";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { DuasPortas } from "@/components/home/duas-portas";
import { Problema } from "@/components/home/problema";
import { ComoTrabalhamos } from "@/components/home/como-trabalhamos";
import { Faq } from "@/components/home/faq";
import { CtaFinal } from "@/components/home/cta-final";
import { OrganizationJsonLd } from "@/components/seo/json-ld";
import { RevealScope } from "@/components/ui/reveal";

// Início migrada do grupo "Ecrã · Início" de "v2 · A vez" (flhgP) do
// design/design-system.pen: frames "Início · desktop 1280" (BuYwz) e "Início · mobile 375"
// (MGl6H). Uma só coluna com as margens de layout ($space-layout-margin-narrow/mid/wide)
// e as seis secções pela ordem do .pen. O <main> é o RevealScope do scroll reveal
// (storyboard "Movimento · Storyboard da Início", Ix1bn); cabeçalho e rodapé ficam fora
// e não animam (R16).

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : defaultLocale;
  const { home } = await getDictionary(locale);
  return {
    ...pageMetadata(locale, "/"),
    title: { absolute: home.metaTitle },
    description: home.metaDescription,
  };
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const { common } = await getDictionary(hasLocale(lang) ? lang : defaultLocale);
  return (
    <>
      <OrganizationJsonLd description={common.siteDescription} />
      <Nav currentPath="/" />

      <RevealScope className="flex-1 px-lg md:px-xl lg:px-2xl">
        <div className="mx-auto w-full max-w-[var(--grid-max-width)]">
          <Hero />
          <DuasPortas />
          <Problema />
          <ComoTrabalhamos />
          <Faq />
          <CtaFinal />
        </div>
      </RevealScope>

      <Footer />
    </>
  );
}
