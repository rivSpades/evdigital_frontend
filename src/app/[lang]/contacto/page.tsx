import type { Metadata } from "next";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { ContactoWizardUrl } from "@/components/contacto/contacto-wizard-url";
import { getAllServices } from "@/lib/content";
import { getDictionary } from "@/i18n/dictionaries";
import { hasLocale } from "@/i18n/config";
import { pageMetadata } from "@/i18n/metadata";
import { notFound } from "next/navigation";

// Contacto migrada do grupo "Ecrã · Contacto" de "v2 · A vez" (flhgP) do
// design/design-system.pen (frames 1280 e 375 de cada passo e estado; ver
// contacto-wizard.tsx). A página é Server Component; só o wizard é cliente.
//
// `?servico=<slug>` chega da CTA "Pedir uma proposta" das fichas de /servicos/[slug]
// (PRD-servicos.md §6) e lê-se no cliente (`ContactoWizardUrl`): a página não lê
// `searchParams` para continuar estática. Um slug desconhecido ou ausente é tratado como
// "sem produto pré-selecionado" — nunca um erro 404 nesta página.

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/contacto">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { contacto } = await getDictionary(lang);
  return { ...contacto.metadata, ...pageMetadata(lang, "/contacto") };
}

export default async function Contacto({ params }: PageProps<"/[lang]/contacto">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const {
    contacto: t,
    institucional,
    areaCliente,
    erros,
    home,
    servicos: servicosT,
  } = await getDictionary(lang);

  // Ordem do "O que precisa" (contacto-wizard.tsx): família A antes de B, mesma leitura
  // simples → avançado do catálogo em /servicos.
  const todosOsServicos = getAllServices(lang);
  const servicos = [
    ...todosOsServicos.filter((s) => s.frontmatter.family === "A"),
    ...todosOsServicos.filter((s) => s.frontmatter.family === "B"),
  ].map((s) => ({ slug: s.slug, titulo: s.frontmatter.title, familia: s.frontmatter.family }));

  return (
    <>
      <Nav />

      {/* Margens do .pen: $space-layout-margin-narrow (24) em mobile e -wide (48) em lg;
          padding inferior $space-4xl da secção do assistente. O topo é do wizard (o Voltar
          dos passos 2 e 3 é a primeira linha da página, antes do título). */}
      <main className="flex-1 px-lg pb-4xl md:px-xl lg:px-2xl">
        <div className="mx-auto flex max-w-[var(--grid-max-width)] flex-col">
          <ContactoWizardUrl
            lang={lang}
            t={t}
            titulo={t.page.title}
            servicos={servicos}
            grupos={{ A: servicosT.inicial.titulo, B: servicosT.avancado.titulo }}
            privacyLinkLabel={institucional.termos.form.privacyLinkLabel}
            optionalLabel={areaCliente.definicoes.perfil.optional}
            retryLabel={erros.pagina.retry}
            homeLabel={erros.naoEncontrada.home}
            servicesLinkLabel={home.hero.secondaryCta}
          />
        </div>
      </main>

      <Footer />
    </>
  );
}
