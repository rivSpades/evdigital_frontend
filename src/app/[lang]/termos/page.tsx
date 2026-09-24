import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PaginaLegal } from "@/components/legal/pagina-legal";
import { SecaoLeitura } from "@/components/ui/secao-leitura";
import LocaleLink from "@/i18n/locale-link";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";

// Casca e secções do grupo "Ecrã · Páginas legais" de "v2 · A vez" do .pen (ver
// components/legal/pagina-legal.tsx). RASCUNHO, precisa de validação antes de publicar (PRD-backend.md D-B3).
// Cobre o que é verdade hoje: um site informativo com um formulário de contacto e
// uma Área de Cliente com conta.
// Não inventa condições comerciais (preços, prazos, garantias), que dependem de
// cada proposta e não devem ser fixadas aqui sem validação.

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/termos">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { institucional } = await getDictionary(lang);
  return { ...institucional.termos.metadata, ...pageMetadata(lang, "/termos") };
}

export default async function Termos({ params }: PageProps<"/[lang]/termos">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { institucional } = await getDictionary(lang);
  const t = institucional.termos;

  return (
    <>
      <Nav />
      <PaginaLegal
        titulo={t.title}
        atualizadoRotulo={institucional.legal.updatedPrefix}
        atualizadoData={t.updatedAt}
        intro={t.intro}
      >
        <SecaoLeitura titulo={t.about.title}>
          <p>{t.about.p1}</p>
        </SecaoLeitura>

        <SecaoLeitura titulo={t.content.title}>
          <p>{t.content.p1}</p>
          <p>{t.content.p2}</p>
        </SecaoLeitura>

        <SecaoLeitura titulo={t.form.title}>
          <p>
            {t.form.p1Before}
            <LocaleLink href="/privacidade">
              {t.form.privacyLinkLabel}
            </LocaleLink>
            {t.form.p1After}
          </p>
          <p>{t.form.p2}</p>
        </SecaoLeitura>

        <SecaoLeitura titulo={t.conta.title}>
          <p>{t.conta.p1}</p>
          <p>{t.conta.p2}</p>
          <p>{t.conta.p3}</p>
        </SecaoLeitura>

        <SecaoLeitura titulo={t.ownership.title}>
          <p>{t.ownership.text}</p>
        </SecaoLeitura>

        <SecaoLeitura titulo={t.availability.title}>
          <p>{t.availability.text}</p>
        </SecaoLeitura>

        <SecaoLeitura titulo={t.law.title}>
          <p>{t.law.p1}</p>
        </SecaoLeitura>
      </PaginaLegal>
      <Footer />
    </>
  );
}
