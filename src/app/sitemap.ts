import type { MetadataRoute } from "next";
import { locales, localizePath, htmlLang, type Locale } from "@/i18n/config";
import { getAllBlogPosts, getAllProjects, getAllServices } from "@/lib/content";
import { listarConsultores } from "@/lib/consultants/backend";
import { SITE_ORIGIN } from "@/lib/site-origin";

// Só páginas públicas indexáveis. Área de Cliente e contacto de consultor ficam de fora (noindex).
const PAGINAS_FIXAS = [
  "/",
  "/servicos",
  "/projetos",
  "/blog",
  "/consultants",
  "/sobre",
  "/contacto",
  "/privacidade",
  "/termos",
];

function entrada(path: string, lastModified?: Date): MetadataRoute.Sitemap {
  const languages = {
    ...Object.fromEntries(
      locales.map((l) => [
        htmlLang[l],
        `${SITE_ORIGIN}${localizePath(l, path)}`,
      ]),
    ),
    "x-default": `${SITE_ORIGIN}${localizePath("pt", path)}`,
  };
  return locales.map((l) => ({
    url: `${SITE_ORIGIN}${localizePath(l, path)}`,
    lastModified,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Um caminho por idioma só entra se o conteúdo existir nesse idioma (slugs podem diferir).
  const porIdioma = (lang: Locale) => [
    ...getAllServices(lang).map((s) => `/servicos/${s.slug}`),
    ...getAllProjects(lang).map((p) => `/projetos/${p.slug}`),
  ];
  const conteudo = new Set(porIdioma("pt"));
  const posts = getAllBlogPosts("pt");
  // Se o Django estiver em baixo no build/pedido, o sitemap sai sem fichas em vez de falhar.
  const consultores = await listarConsultores("pt").catch(() => []);

  return [
    ...PAGINAS_FIXAS.flatMap((p) => entrada(p)),
    ...[...conteudo].flatMap((p) => entrada(p)),
    ...consultores.flatMap((c) => entrada(`/consultants/${c.slug}`)),
    ...posts.flatMap((post) =>
      entrada(`/blog/${post.slug}`, post.frontmatter.publishedAt),
    ),
  ];
}
