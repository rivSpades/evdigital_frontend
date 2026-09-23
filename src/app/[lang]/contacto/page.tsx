import type { Metadata } from "next";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { ContactoWizard } from "@/components/contacto/contacto-wizard";
import { getServiceBySlug } from "@/lib/content";
import { getDictionary } from "@/i18n/dictionaries";
import { hasLocale } from "@/i18n/config";
import { pageMetadata } from "@/i18n/metadata";
import { notFound } from "next/navigation";

// Contacto migrada dos frames M9S6m (desktop, 1440) e uhCIg (mobile, 390) do
// design/design-system.pen. Copy do copy-draft.md §5. O wizard de 3 passos (descrever
// / reunião / resumo) ainda não tem frames próprios no .pen — excepção pontual, ver
// nota em site/Context.md. A página é Server Component; só o wizard é cliente.
//
// `?servico=<slug>` chega da CTA "Pedir uma proposta" das fichas de /servicos/[slug]
// (PRD-servicos.md §6). Um slug desconhecido ou ausente é tratado como "sem produto
// pré-selecionado" — nunca um erro 404 nesta página.

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/contacto">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { contacto } = await getDictionary(lang);
  return { ...contacto.metadata, ...pageMetadata(lang, "/contacto") };
}

export default async function Contacto({
  params,
  searchParams,
}: PageProps<"/[lang]/contacto">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { contacto: t } = await getDictionary(lang);
  const { servico: servicoSlug } = await searchParams;
  const slug = typeof servicoSlug === "string" ? servicoSlug : undefined;
  const servico = slug ? getServiceBySlug(lang, slug) : null;
  const servicoInicial = servico
    ? { slug: servico.slug, titulo: servico.frontmatter.title }
    : undefined;

  return (
    <>
      <Nav />

      <main className="flex-1 px-lg py-3xl md:px-xl lg:px-2xl lg:py-4xl">
        <div className="mx-auto flex max-w-[var(--grid-max-width)] flex-col gap-2xl lg:gap-3xl">
          <header className="flex flex-col gap-md lg:gap-lg">
            {/* No narrow o .pen usa $font-size-display-sm-narrow (39), o mesmo valor de
                --text-headline, com a entrelinha de display. */}
            <h1 className="font-heading text-headline leading-[var(--line-height-display)] font-bold tracking-[var(--letter-spacing-headline)] text-text-primary lg:text-display-sm lg:leading-[var(--line-height-display)] lg:tracking-[var(--letter-spacing-display)]">
              {t.page.title}
            </h1>

            <p className="font-body text-body text-text-secondary lg:max-w-[720px] lg:text-body-lg">
              {t.page.intro}
            </p>
          </header>

          <div className="max-w-[640px]">
            <ContactoWizard lang={lang} t={t} servicoInicial={servicoInicial} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
