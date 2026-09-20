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
 * `token` é o token de sessão da Área de Cliente (guardado no cookie httpOnly
 * `ac_token`), não a chave de API do site — as duas viajam sempre juntas.
 */
export async function backendFetch<T>(
  path: string,
  {
    method = "GET",
    body,
    token,
  }: { method?: string; body?: unknown; token?: string } = {},
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
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  const texto = await resposta.text();
  const dados = texto ? JSON.parse(texto) : null;

  if (!resposta.ok) {
    throw new BackendError(resposta.status, dados);
  }
  return dados as T;
}
