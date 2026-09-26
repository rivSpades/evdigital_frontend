import { SITE_ORIGIN } from "@/lib/site-origin";

function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

// Serviço (schema.org/Service) + FAQPage das perguntas frequentes da página. Só o que está
// visível na página: nome, resumo e perguntas/respostas. Sem preços nem áreas geográficas
// que o site não publique.
export function ServiceJsonLd({
  lang,
  slug,
  name,
  description,
  faq,
}: {
  lang: string;
  slug: string;
  name: string;
  description: string;
  faq: { q: string; a: string }[];
}) {
  const url = `${SITE_ORIGIN}/${lang}/servicos/${slug}`;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Service",
            "@id": `${url}#service`,
            name,
            description,
            url,
            provider: { "@id": `${SITE_ORIGIN}/#organization` },
          },
          {
            "@type": "FAQPage",
            mainEntity: faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ],
      }}
    />
  );
}

// Dados estruturados (schema.org) da organização. Só factos já públicos no site; sem
// morada nem contactos que não estejam publicados.
export function OrganizationJsonLd({ description }: { description: string }) {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_ORIGIN}/#organization`,
        name: "EvDigital",
        url: SITE_ORIGIN,
        logo: `${SITE_ORIGIN}/email/logo.png`,
        description,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_ORIGIN}/#website`,
        name: "EvDigital",
        url: SITE_ORIGIN,
        publisher: { "@id": `${SITE_ORIGIN}/#organization` },
        inLanguage: ["pt-PT", "en", "pl"],
      },
    ],
  };
  return <JsonLd data={data} />;
}
