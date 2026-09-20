import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { CtaFinal } from "@/components/home/cta-final";
import { BlocoInicial } from "@/components/servicos/bloco-inicial";
import { BlocoAvancado } from "@/components/servicos/bloco-avancado";
import { getDictionary } from "@/i18n/dictionaries";
import { hasLocale } from "@/i18n/config";
import { pageMetadata } from "@/i18n/metadata";

// Serviços migrada dos frames Czc80 (wide, 1440) e K1MKs (narrow, 390) do
// design/design-system.pen. Dois blocos, do mais simples ao mais avançado, e o mesmo
// CTA final da Home (o .pen desenha a secção igual nas duas páginas).

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { meta } = (await getDictionary(lang)).servicos;
  return { title: meta.title, description: meta.description, ...pageMetadata(lang, "/servicos") };
}

export default async function Servicos({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return (
    <>
      <Nav currentPath="/servicos" />

      <main className="flex-1">
        {/* O .pen não deixa margem inferior no corpo: o espaço antes do CTA vem do
            padding da própria secção de CTA. */}
        <div className="px-lg pt-2xl md:px-xl lg:px-2xl lg:pt-[80px]">
          <div className="mx-auto flex max-w-[var(--grid-max-width)] flex-col gap-3xl lg:gap-4xl">
            <BlocoInicial lang={lang} />
            <BlocoAvancado lang={lang} />
          </div>
        </div>

        <CtaFinal />
      </main>

      <Footer />
    </>
  );
}
