import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { FamiliaAvancada, FamiliaInicial } from "@/components/servicos/familia-servicos";
import { FechoPagina } from "@/components/ui/fecho-pagina";
import { getDictionary } from "@/i18n/dictionaries";
import { hasLocale } from "@/i18n/config";
import { pageMetadata } from "@/i18n/metadata";

// Serviços migrada do grupo "Ecrã · Serviços" de "v2 · A vez" (flhgP) do
// design/design-system.pen: frames "Serviços · desktop 1280" (CEY4K) e "Serviços · mobile
// 375" (hgNkr). Uma coluna com as margens de layout ($space-layout-margin-narrow/mid/wide):
// - Secção · topo: o título da página, $font-size-display ($font-size-display-narrow em
//   mobile), padding [$space-4xl, 0, $space-3xl, 0] ([$space-2xl, 0] em mobile);
// - as duas famílias (components/servicos/familia-servicos.tsx);
// - Secção · fecho: ds/layout/fecho-pagina sem título, nas colunas 4 a 12 em lg (a Margem
//   vazia), padding-bottom $space-3xl ($space-2xl em mobile). O texto é o do fecho da
//   Início (home.finalCta.body), o mesmo que o .pen usa aqui.
// Sem scroll reveal (só a Início anima).

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
  const { common, home, servicos } = await getDictionary(lang);
  return (
    <>
      <Nav currentPath="/servicos" />

      <main className="flex-1 px-lg md:px-xl lg:px-2xl">
        <div className="mx-auto w-full max-w-[var(--grid-max-width)]">
          <div className="py-2xl lg:pt-4xl lg:pb-3xl">
            <h1 className="font-heading text-[length:var(--font-size-display-narrow)] leading-[var(--line-height-display)] font-bold tracking-[var(--letter-spacing-display)] text-text-primary lg:text-display">
              {servicos.meta.title}
            </h1>
          </div>

          <FamiliaInicial lang={lang} />
          <FamiliaAvancada lang={lang} />

          <section
            aria-label={common.cta}
            className="pb-2xl lg:grid lg:grid-cols-12 lg:gap-x-lg lg:pb-3xl"
          >
            <FechoPagina
              texto={home.finalCta.body}
              acao={common.cta}
              href="/contacto"
              compactoMobile
              className="lg:col-span-9 lg:col-start-4"
            />
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
