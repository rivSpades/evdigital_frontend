import { NextResponse } from "next/server";
import {
  GOOGLE_STATE_COOKIE,
  googleConfig,
  newOAuthState,
  redirectUri,
  requestLocale,
  siteOrigin,
} from "@/lib/area-cliente/google";
import { localizePath } from "@/i18n/config";

// Início do "Continuar com Google": guarda state + PKCE verifier + idioma num cookie httpOnly de
// vida curta e redireciona para o Google. O regresso é em ./callback.

export async function GET(request: Request) {
  const lang = requestLocale(request);
  const config = googleConfig();
  if (!config) {
    return NextResponse.redirect(
      `${siteOrigin(request)}${localizePath(lang, "/area-cliente/entrar?erro=google")}`,
    );
  }

  const { state, verifier, challenge } = newOAuthState();
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: redirectUri(request),
    response_type: "code",
    scope: "openid email profile",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
    prompt: "select_account",
  }).toString();

  const resposta = NextResponse.redirect(url);
  resposta.cookies.set(GOOGLE_STATE_COOKIE, `${state}.${verifier}.${lang}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/area-cliente/google",
    maxAge: 600,
  });
  return resposta;
}
