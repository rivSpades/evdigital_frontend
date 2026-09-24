// Chamadas ao backend Django a partir do servidor do site — nunca do browser
// (PRD-backend.md §4.2). Reutiliza as mesmas `LEADS_API_URL`/`LEADS_API_KEY` do domínio
// de leads: é o mesmo backend, com o mesmo canal partilhado (`HasApiKey` no Django).
//
// Ficheiro server-only por convenção (usa `LEADS_API_KEY`, que nunca pode chegar ao
// browser): só é importado de Server Components, Route Handlers e Server Actions.
// Não há o pacote `server-only` instalado para o impor em build; não o importar de um
// ficheiro `"use client"`.

export const AC_COOKIE_NAME = "ac_token";

export class BackendError extends Error {
  constructor(
    public status: number,
    public body: unknown,
  ) {
    super(`Backend devolveu ${status}`);
  }
}

/**
 * IP real do visitante, para reenviar ao Django em `X-Forwarded-For`. Os endpoints de
 * autenticação têm rate limit por IP (`throttle_scope = "auth"`, `NUM_PROXIES`): sem isto
 * o Django veria sempre o IP deste servidor e o limite passaria a ser global, e bastariam
 * uns quantos pedidos de uma só pessoa para bloquear a Área de Cliente a toda a gente.
 * Mesma lógica de `src/app/api/contacto/route.ts`.
 */
export function clientIpFrom(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip")?.trim() ??
    ""
  );
}

/**
 * `token` é o token de sessão da Área de Cliente (guardado no cookie httpOnly
 * `ac_token`), não a chave de API do site — as duas viajam sempre juntas.
 */
export async function backendFetch<T>(
  path: string,
  {
    method = "GET",
    body,
    token,
    clientIp,
  }: { method?: string; body?: unknown; token?: string; clientIp?: string } = {},
): Promise<T> {
  const apiUrl = process.env.LEADS_API_URL;
  const apiKey = process.env.LEADS_API_KEY;
  if (!apiUrl || !apiKey) {
    throw new Error("LEADS_API_URL ou LEADS_API_KEY em falta");
  }

  const resposta = await fetch(`${apiUrl.replace(/\/$/, "")}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
      ...(token ? { Authorization: `Token ${token}` } : {}),
      ...(clientIp ? { "X-Forwarded-For": clientIp } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  // Só se faz parse de JSON: um 404 de rota do Django (ex. /api/me/requests/nao-e-uuid/,
  // que não casa com o <uuid:pk> do URLconf) vem em HTML, e o JSON.parse rebentava com
  // "SyntaxError: Unexpected token <" em vez de chegar ao `notFound()` das páginas.
  const texto = await resposta.text();
  const eJson = resposta.headers.get("content-type")?.includes("json") ?? false;
  let dados: unknown = null;
  if (texto && eJson) {
    try {
      dados = JSON.parse(texto);
    } catch {
      if (resposta.ok) throw new BackendError(502, null);
    }
  }

  if (!resposta.ok) {
    throw new BackendError(resposta.status, dados);
  }
  if (texto && !eJson) {
    // 2xx que não é JSON: resposta inesperada do backend (proxy, página de manutenção).
    throw new BackendError(502, null);
  }
  return dados as T;
}
