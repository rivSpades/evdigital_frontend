import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PaginaLegal, Acordeao } from "@/components/legal/pagina-legal";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";

// RASCUNHO — PRD-backend.md §8 e D-B3.
// Descreve com rigor o que o sistema faz hoje (os campos do formulário, para onde
// vão, quanto tempo ficam). Os pontos marcados como POR CONFIRMAR dependem de
// dados que só o dono do negócio tem, ou de validação jurídica.

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
        atualizado={`${institucional.legal.updatedPrefix} ${t.updatedAt}.`}
        intro={t.intro}
      >
        <Acordeao titulo={t.controller.title}>
          <p>{t.controller.p1}</p>
          <p className="text-text-tertiary">{t.controller.pending}</p>
        </Acordeao>

        <Acordeao titulo={t.data.title}>
          <p>{t.data.intro}</p>
          <ul>
            {t.data.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>{t.data.outro}</p>
        </Acordeao>

        <Acordeao titulo={t.purpose.title}>
          <p>{t.purpose.p1}</p>
          <p>
            <strong>{t.purpose.p2Bold}</strong>
            {t.purpose.p2Rest}
          </p>
        </Acordeao>

        <Acordeao titulo={t.basis.title}>
          <p>{t.basis.text}</p>
        </Acordeao>

        <Acordeao titulo={t.retention.title}>
          <p>{t.retention.p1}</p>
          <p>{t.retention.p2}</p>
        </Acordeao>

        <Acordeao titulo={t.access.title}>
          <p>{t.access.p1}</p>
          <p className="text-text-tertiary">{t.access.pending}</p>
        </Acordeao>

        <Acordeao titulo={t.rights.title}>
          <p>{t.rights.p1}</p>
          <p>
            {t.rights.p2Before}
            <a
              href={t.rights.authorityUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-link underline underline-offset-4"
            >
              {t.rights.authorityLinkLabel}
            </a>
            {t.rights.p2After}
          </p>
        </Acordeao>

        <Acordeao titulo={t.security.title}>
          <p>{t.security.text}</p>
        </Acordeao>
      </PaginaLegal>
      <Footer />
    </>
  );
}
