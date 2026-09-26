import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/site-origin";

// A Área de Cliente (subdomínio) e o contacto de consultor saem com `noindex`
// (proxy.ts e `robots` da metadata); aqui só se declara o sitemap e se protege a API.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
  };
}
