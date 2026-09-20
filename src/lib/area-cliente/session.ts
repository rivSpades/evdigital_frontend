import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { localizePath, type Locale } from "@/i18n/config";
import { AC_COOKIE_NAME, BackendError, backendFetch } from "@/lib/area-cliente/backend";

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

export type MeInfo = { id: number; name: string; email: string };

/**
 * Usar no topo de cada página Server Component da Área de Cliente que exige sessão.
 * Redireciona para `/<lang>/area-cliente/entrar` sem sessão válida — nunca deixa a página
 * renderizar dados de outra pessoa nem um ecrã vazio a fingir que está tudo bem.
 */
export async function requireSession(lang: Locale): Promise<{ token: string; me: MeInfo }> {
  const token = await getSessionToken();
  if (!token) redirect(localizePath(lang, "/area-cliente/entrar"));

  try {
    const me = await backendFetch<MeInfo>("/api/me/", { token });
    return { token, me };
  } catch (erro) {
    if (erro instanceof BackendError && (erro.status === 401 || erro.status === 403)) {
      redirect(localizePath(lang, "/area-cliente/entrar"));
    }
    throw erro;
  }
}
