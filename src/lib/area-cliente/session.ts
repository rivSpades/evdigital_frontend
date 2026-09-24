import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { caminhoAreaCliente } from "@/i18n/area-cliente-href";
import type { Locale } from "@/i18n/config";
import { AC_COOKIE_NAME, BackendError, backendFetch } from "@/lib/area-cliente/backend";
import type { Perfil } from "@/lib/area-cliente/types";

// Um mês. Os tokens do DRF não expiram sozinhos (PRD-servicos.md §8) — quem termina a
// sessão fá-lo por "Terminar sessão", que apaga o token no Django e o cookie aqui.
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  };
}

export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(AC_COOKIE_NAME)?.value ?? null;
}

export type MeInfo = {
  id: number;
  name: string;
  email: string;
  /** `false` numa conta criada com Google: define a primeira palavra-passe sem a atual. */
  has_usable_password: boolean;
};

/**
 * GET /api/me/ uma só vez por pedido (`cache` do React), partilhado por `requireSession` e
 * pelo 404 da Área de Cliente (`[lang]/area-cliente/not-found.tsx`), que o Next renderiza
 * em cada carregamento do segmento (é o fallback da fronteira de 404, não só quando há um
 * 404): sem partilha, cada página pedia /api/me/ duas vezes.
 */
export const lerPerfil = cache((token: string) => backendFetch<Perfil>("/api/me/", { token }));

function paraEntrar(lang: Locale): never {
  redirect(caminhoAreaCliente(lang, "/area-cliente/entrar"));
}

/**
 * Token do cookie, sem ir ao backend (redirecciona para Entrar se não houver cookie). Para as
 * páginas que já pedem dados da conta com o token: o próprio pedido de dados valida a sessão
 * (`daConta` redirecciona num 401/403), e um /api/me/ antes dele seria um pedido a mais, em
 * série, a cada navegação. A casca `(conta)/layout.tsx` continua a validar com
 * `requireSession` em cada carregamento completo.
 */
export async function requireToken(lang: Locale): Promise<string> {
  const token = await getSessionToken();
  if (!token) paraEntrar(lang);
  return token;
}

/** Espera uma leitura do backend feita com o token da sessão; 401/403 → Entrar. */
export async function daConta<T>(lang: Locale, leitura: Promise<T>): Promise<T> {
  try {
    return await leitura;
  } catch (erro) {
    if (erro instanceof BackendError && (erro.status === 401 || erro.status === 403)) {
      paraEntrar(lang);
    }
    throw erro;
  }
}

/**
 * Valida a sessão com /api/me/ e devolve o perfil. Usar na casca `(conta)/layout.tsx` (barra
 * de topo) e onde o perfil é o próprio dado da página (Definições). Redireciona para Entrar
 * sem sessão válida: nunca deixa a página renderizar dados de outra pessoa nem um ecrã vazio
 * a fingir que está tudo bem. As outras páginas usam `requireToken` + `daConta`.
 *
 * `cache` (React): no mesmo pedido, o layout e a página partilham uma única chamada a
 * /api/me/. Numa navegação dentro da Área de Cliente o layout não volta a renderizar.
 */
export const requireSession = cache(async function requireSession(
  lang: Locale,
): Promise<{ token: string; me: Perfil }> {
  const token = await getSessionToken();
  if (!token) paraEntrar(lang);
  // /api/me/ devolve o perfil completo (Definições usa-o sem voltar a pedir).
  const me = await daConta(lang, lerPerfil(token));
  return { token, me };
});
