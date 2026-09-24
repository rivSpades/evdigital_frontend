import type { Locale } from "@/i18n/config";

/**
 * Início do site PÚBLICO no idioma dado, para ligações que saem da Área de Cliente
 * ("Voltar ao site"). Com a Área de Cliente num subdomínio (`CLIENTES_URL`, ver
 * `src/proxy.ts`), um "/" relativo ficava no host da Área de Cliente: é preciso o URL
 * absoluto de `SITE_URL` (a mesma variável que o proxy usa). Sem `SITE_URL` (previews,
 * tudo num só host) o caminho relativo "/" chega: `LocaleLink` prefixa o idioma.
 *
 * Só no servidor (lê `process.env`); passa-se o resultado aos componentes.
 */
export function publicSiteHref(lang: Locale): string {
  const base = process.env.SITE_URL?.replace(/\/$/, "");
  return base ? `${base}/${lang}` : "/";
}
