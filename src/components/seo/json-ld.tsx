import { SITE_ORIGIN } from "@/lib/site-origin";

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
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
