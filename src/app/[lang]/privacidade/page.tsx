import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PaginaLegal, SubtituloLegal } from "@/components/legal/pagina-legal";
import { LinhaTexto, ListaTexto } from "@/components/ui/linha-texto";
import { SecaoLeitura } from "@/components/ui/secao-leitura";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";

// Casca e secções do grupo "Ecrã · Páginas legais" de "v2 · A vez" do .pen (ver
// components/legal/pagina-legal.tsx). RASCUNHO, PRD-backend.md §8 e D-B3.
// Descreve com rigor o que o sistema faz hoje (formulário de contacto, Área de Cliente,
// login Google, Cal.com, cookies: que dados, para onde vão, quanto tempo ficam).

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/privacidade">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { institucional } = await getDictionary(lang);
  return { ...institucional.privacidade.metadata, ...pageMetadata(lang, "/privacidade") };
}

export default async function Privacidade({ params }: PageProps<"/[lang]/privacidade">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { institucional } = await getDictionary(lang);
  const t = institucional.privacidade;

  return (
    <>
      <Nav />
      <PaginaLegal
        titulo={t.title}
        atualizadoRotulo={institucional.legal.updatedPrefix}
        atualizadoData={t.updatedAt}
        intro={t.intro}
      >
        <SecaoLeitura titulo={t.controller.title}>
          <p>{t.controller.p1}</p>
        </SecaoLeitura>

        <SecaoLeitura titulo={t.data.title}>
          <p>{t.data.intro}</p>
          {t.data.groups.map((grupo) => (
            <div key={grupo.title} className="flex flex-col gap-xs">
              <SubtituloLegal>{grupo.title}</SubtituloLegal>
              <ListaTexto>
                {grupo.items.map((item) => (
                  <LinhaTexto key={item} compacta>
                    {item}
                  </LinhaTexto>
                ))}
              </ListaTexto>
            </div>
          ))}
          <div className="flex flex-col gap-xs">
            <SubtituloLegal>{t.data.google.title}</SubtituloLegal>
            <p>{t.data.google.text}</p>
          </div>
          <p>{t.data.outro}</p>
        </SecaoLeitura>

        <SecaoLeitura titulo={t.cookies.title}>
          <p>{t.cookies.p1}</p>
        </SecaoLeitura>

        <SecaoLeitura titulo={t.purpose.title}>
          <p>{t.purpose.p1}</p>
          <p>
            <strong>{t.purpose.p2Bold}</strong>
            {t.purpose.p2Rest}
          </p>
        </SecaoLeitura>

        <SecaoLeitura titulo={t.basis.title}>
          <p>{t.basis.text}</p>
        </SecaoLeitura>

        <SecaoLeitura titulo={t.retention.title}>
          <p>{t.retention.p1}</p>
          <p>{t.retention.p2}</p>
          <p>{t.retention.p3}</p>
        </SecaoLeitura>

        <SecaoLeitura titulo={t.access.title}>
          <p>{t.access.p1}</p>
        </SecaoLeitura>

        <SecaoLeitura titulo={t.rights.title}>
          <p>{t.rights.p1}</p>
          <p>
            {t.rights.p2Before}
            <a
              href={t.rights.authorityUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.rights.authorityLinkLabel}
            </a>
            {t.rights.p2After}
          </p>
        </SecaoLeitura>

        <SecaoLeitura titulo={t.security.title}>
          <p>{t.security.text}</p>
        </SecaoLeitura>
      </PaginaLegal>
      <Footer />
    </>
  );
}
