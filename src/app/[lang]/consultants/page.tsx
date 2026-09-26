import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { ConsultorLinha } from "@/components/ui/consultor-linha";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { listarConsultores } from "@/lib/consultants/backend";
import { iniciais } from "@/lib/consultants/format";

// Lista de consultores migrada de «Consultores · lista» do design-system.pen (WkpH6 desktop
// 1280, C6e9nd tablet 768, tzkFv mobile 375). Página pública e indexável (ligada a partir
// das soluções avançadas em /servicos); sem ligação no Nav nem no Footer.
// - Secção · topo: título «Consultores» em display ($font-size-display-sm em tablet,
//   -narrow em mobile), padding [$space-4xl, 0, $space-3xl, 0] em lg, [$space-3xl, 0,
//   $space-2xl, 0] em tablet e [$space-2xl, 0, $space-xl, 0] em mobile. Sem «Voltar» (o frame
//   não o tem: é a entrada da secção) e sem cue de scroll.
// - Secção · consultores: lista com régua superior $border-default, uma
//   ds/display/consultor-linha por consultor; padding-bottom $space-4xl ($space-3xl abaixo
//   de lg).
// Dados do Django a cada pedido (só publicados); a foto chega pelo proxy do site.

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/consultants">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { consultores: t } = await getDictionary(lang);
  return { title: t.lista.title };
}

export default async function ConsultoresPage({ params }: PageProps<"/[lang]/consultants">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { consultores: t } = await getDictionary(lang);
  const consultores = await listarConsultores(lang);

  return (
    <>
      <Nav />

      <main className="flex-1 px-lg md:px-xl lg:px-2xl">
        <div className="mx-auto w-full max-w-[var(--grid-max-width)]">
          <div className="pt-2xl pb-xl md:pt-3xl md:pb-2xl lg:pt-4xl lg:pb-3xl">
            <h1 className="font-heading text-[length:var(--font-size-display-narrow)] leading-[var(--line-height-display)] font-bold tracking-[var(--letter-spacing-display)] text-text-primary md:text-display-sm lg:text-display">
              {t.lista.title}
            </h1>
          </div>

          <section aria-label={t.lista.title} className="pb-3xl lg:pb-4xl">
            <ul className="flex flex-col border-t border-border-default">
              {consultores.map((consultor) => (
                <ConsultorLinha
                  key={consultor.slug}
                  href={`/consultants/${consultor.slug}`}
                  nome={consultor.name}
                  headline={consultor.headline}
                  foto={
                    consultor.has_photo ? `/api/consultants/${consultor.slug}/photo` : null
                  }
                  iniciais={iniciais(consultor.name)}
                />
              ))}
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
