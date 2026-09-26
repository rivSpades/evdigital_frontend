import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ConsultorWizard, type OpcaoConsultor } from "@/components/consultores/consultor-wizard";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { hasLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { lerConsultor } from "@/lib/consultants/backend";

// Assistente «Vamos conversar» de um consultor (frames «Consultores · assistente» do
// design-system.pen; ver consultor-wizard.tsx). Página escondida como a do consultor: noindex,
// sem ligação no Nav nem no Footer; só se chega pelas acções «Marcar hora» / «Enviar
// mensagem» da página do consultor (`?opcao=hora|mensagem`). Consultor não publicado: 404.
// Margens como o /contacto: $space-layout-margin-narrow (24) em mobile, -mid (32) em tablet e
// -wide (48) em lg.

const consultor = cache((slug: string, lang: Locale) => lerConsultor(slug, lang));

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/consultants/[slug]/contacto">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const [dados, { contacto }] = await Promise.all([consultor(slug, lang), getDictionary(lang)]);
  return {
    title: dados ? `${contacto.page.title} · ${dados.name}` : contacto.page.title,
    robots: { index: false, follow: false },
  };
}

export default async function ConsultorContactoPage({
  params,
  searchParams,
}: PageProps<"/[lang]/consultants/[slug]/contacto">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const dados = await consultor(slug, lang);
  if (!dados) notFound();

  const { opcao } = await searchParams;
  const opcaoInicial: OpcaoConsultor | undefined =
    opcao === "hora" || opcao === "mensagem" ? opcao : undefined;

  const { contacto, consultores, institucional, areaCliente, erros } = await getDictionary(lang);

  return (
    <>
      <Nav />

      <main className="flex-1 px-lg md:px-xl lg:px-2xl">
        <div className="mx-auto flex max-w-[var(--grid-max-width)] flex-col">
          <ConsultorWizard
            key={opcaoInicial ?? "escolha"}
            lang={lang}
            t={contacto}
            tc={consultores}
            consultor={{ slug: dados.slug, nome: dados.name, headline: dados.headline }}
            opcaoInicial={opcaoInicial}
            privacyLinkLabel={institucional.termos.form.privacyLinkLabel}
            optionalLabel={areaCliente.definicoes.perfil.optional}
            retryLabel={erros.pagina.retry}
            homeLabel={erros.naoEncontrada.home}
          />
        </div>
      </main>

      <Footer />
    </>
  );
}
