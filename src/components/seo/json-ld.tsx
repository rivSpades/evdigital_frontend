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

// FAQPage (schema.org) a partir das perguntas frequentes já visíveis na página (home,
// serviços). Reaproveita o texto do dicionário/frontmatter tal como está — nunca inventar
// perguntas ou respostas aqui.
export function FaqPageJsonLd({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }}
    />
  );
}

// BreadcrumbList (schema.org) — trilha de navegação de uma página de detalhe (serviço,
// projeto, artigo de blog). `items` vai da home até à própria página, por ordem.
export function BreadcrumbListJsonLd({ items }: { items: { name: string; url: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}

// Article (schema.org) de um post do blog. Só o que já está no frontmatter revisto
// (PRD §4.3/§7.2) — sem inventar autor nem dados que a página não mostra.
export function ArticleJsonLd({
  lang,
  slug,
  title,
  description,
  publishedAt,
}: {
  lang: string;
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
}) {
  const url = `${SITE_ORIGIN}/${lang}/blog/${slug}`;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${url}#article`,
        headline: title,
        description,
        datePublished: publishedAt,
        url,
        author: { "@id": `${SITE_ORIGIN}/#organization` },
        publisher: { "@id": `${SITE_ORIGIN}/#organization` },
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
