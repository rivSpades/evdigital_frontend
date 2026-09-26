/**
 * Origem pública do site (`SITE_URL`, sem barra final). Fallback para produção quando a
 * variável não existe (build local, previews): sitemap, canonical e Open Graph precisam
 * sempre de URLs absolutos.
 */
export const SITE_ORIGIN = (process.env.SITE_URL ?? "https://www.evdigital.eu").replace(/\/$/, "");
