import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AC_COOKIE_NAME, BackendError, backendFetch, clientIpFrom } from "@/lib/area-cliente/backend";
import { respostaDemasiadosPedidos } from "@/lib/area-cliente/erros";
import { hasLocale, type Locale } from "@/i18n/config";
import { cookieOptions } from "@/lib/area-cliente/session";
import type { MeInfo } from "@/lib/area-cliente/session";

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/** Idioma da página que fez o pedido, para a ligação do email; outro valor não segue. */
function langDoPedido(value: unknown): Locale | undefined {
  return typeof value === "string" && hasLocale(value) ? value : undefined;
}

export async function POST(request: Request) {
  let body: { email?: unknown; password?: unknown; lang?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "pedido_invalido" }, { status: 400 });
  }

  try {
    const dados = await backendFetch<{ token: string; user: MeInfo }>("/api/auth/login/", {
      method: "POST",
      body: {
        email: asString(body.email).trim(),
        password: asString(body.password),
        // Conta por confirmar: o Django reenvia a ligação, que abre neste idioma.
        lang: langDoPedido(body.lang),
      },
      clientIp: clientIpFrom(request),
    });

    const store = await cookies();
    store.set(AC_COOKIE_NAME, dados.token, cookieOptions());

    return NextResponse.json({ user: dados.user }, { status: 200 });
  } catch (erro) {
    // 400 passa tal como vem: o formulário de entrar já recorre a `errCredentials` para
    // qualquer 400 (usa `non_field_errors`/`email` do Django só em pt).
    if (erro instanceof BackendError && (erro.status === 400 || erro.status === 403)) {
      return NextResponse.json(erro.body, { status: erro.status });
    }
    if (erro instanceof BackendError && erro.status === 429) return respostaDemasiadosPedidos();
    console.error("Falha ao entrar na Área de Cliente:", erro);
    return NextResponse.json({ error: "indisponivel" }, { status: 502 });
  }
}
