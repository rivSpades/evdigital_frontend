// Fluxo OAuth 2.0 (authorization code + PKCE) com o Google, do lado do servidor do site.
// O browser só é redirecionado; o `client_secret` e a troca do código nunca lhe chegam, e
// o Django só recebe o `id_token` para validar (apps/accounts/google.py).

import { createHash, randomBytes } from "node:crypto";
import { LOCALE_COOKIE, hasLocale, matchLocale, type Locale } from "@/i18n/config";

export const GOOGLE_STATE_COOKIE = "ac_google_oauth";

export function googleConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

/**
 * Origem pública da Área de Cliente (o fluxo Google corre nela, onde nasce o cookie de
 * sessão). `CLIENTES_URL` em produção — atrás de proxy o `request.url` mente.
 */
export function siteOrigin(request: Request): string {
  return (process.env.CLIENTES_URL ?? process.env.SITE_URL ?? new URL(request.url).origin).replace(
    /\/$/,
    "",
  );
}

export function redirectUri(request: Request): string {
  return `${siteOrigin(request)}/api/area-cliente/google/callback`;
}

export function newOAuthState() {
  const state = randomBytes(24).toString("base64url");
  const verifier = randomBytes(48).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  return { state, verifier, challenge };
}

export function readCookie(request: Request, name: string): string | undefined {
  return request.headers
    .get("cookie")
    ?.split(/;\s*/)
    .find((c) => c.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

/**
 * Idioma de um Route Handler (não há `[lang]` nem root-params aqui): `?lang=` explícito >
 * cookie do seletor de idioma > Accept-Language > pt. Só aceita idiomas suportados.
 */
export function requestLocale(request: Request): Locale {
  const fromQuery = new URL(request.url).searchParams.get("lang");
  if (hasLocale(fromQuery)) return fromQuery;
  const fromCookie = readCookie(request, LOCALE_COOKIE);
  if (hasLocale(fromCookie)) return fromCookie;
  return matchLocale(request.headers.get("accept-language"));
}
