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

// Home migrada dos frames wzYyU (wide, 1440) e EZ3bZ (narrow, 390) do
// design/design-system.pen. Ordem das seis secções tal como no .pen.

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

export default function Home() {
  return (
    <>
      <Nav currentPath="/" />

      <main className="flex-1">
        <Hero />

        <div className="px-lg py-3xl md:px-xl lg:px-2xl lg:py-4xl">
          <div className="mx-auto flex max-w-[var(--grid-max-width)] flex-col gap-3xl lg:gap-4xl">
            <DuasPortas />
            <Problema />
            <ComoTrabalhamos />
            <Faq />
          </div>
        </div>

        <CtaFinal />
      </main>

      <Footer />
    </>
  );
}
