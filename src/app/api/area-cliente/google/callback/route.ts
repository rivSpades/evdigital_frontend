import { NextResponse } from "next/server";
import { AC_COOKIE_NAME, backendFetch, clientIpFrom } from "@/lib/area-cliente/backend";
import {
  GOOGLE_STATE_COOKIE,
  googleConfig,
  readCookie,
  redirectUri,
  requestLocale,
  siteOrigin,
} from "@/lib/area-cliente/google";
import { hasLocale } from "@/i18n/config";
import { caminhoAreaCliente } from "@/i18n/area-cliente-href";
import { cookieOptions } from "@/lib/area-cliente/session";

// Regresso do Google: valida state, troca o código por tokens, entrega o id_token ao
// Django (que o valida e cria/liga a conta) e guarda o token de sessão no cookie próprio.

export async function GET(request: Request) {
  const origem = siteOrigin(request);
  const [cookieState, verifier, cookieLang] = (readCookie(request, GOOGLE_STATE_COOKIE) ?? "").split(".");
  // O idioma foi guardado junto ao state no início do fluxo; sem ele, recorre ao cookie do
  // seletor / Accept-Language.
  const lang = hasLocale(cookieLang) ? cookieLang : requestLocale(request);
  const falha = () => {
    const r = NextResponse.redirect(`${origem}${caminhoAreaCliente(lang, "/area-cliente/entrar?erro=google")}`);
    r.cookies.delete({ name: GOOGLE_STATE_COOKIE, path: "/api/area-cliente/google" });
    return r;
  };

  const config = googleConfig();
  const params = new URL(request.url).searchParams;
  const code = params.get("code");
  const state = params.get("state");

  if (!config || !code || !state || !cookieState || !verifier || state !== cookieState) {
    return falha();
  }

  try {
    const troca = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: redirectUri(request),
        grant_type: "authorization_code",
        code_verifier: verifier,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!troca.ok) return falha();
    const { id_token } = (await troca.json()) as { id_token?: string };
    if (!id_token) return falha();

    const dados = await backendFetch<{ token: string }>("/api/auth/google/", {
      method: "POST",
      body: { id_token, lang },
      clientIp: clientIpFrom(request),
    });

    const resposta = NextResponse.redirect(`${origem}${caminhoAreaCliente(lang, "/area-cliente/projetos")}`);
    resposta.cookies.set(AC_COOKIE_NAME, dados.token, cookieOptions());
    resposta.cookies.delete({ name: GOOGLE_STATE_COOKIE, path: "/api/area-cliente/google" });
    return resposta;
  } catch (erro) {
    console.error("Falha no login com Google:", erro);
    return falha();
  }
}
