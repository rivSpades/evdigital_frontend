import { NextResponse } from "next/server";
import { hasLocale, type Locale } from "@/i18n/config";
import { BackendError, backendFetch, clientIpFrom } from "@/lib/area-cliente/backend";
import {
  respostaDemasiadosPedidos,
  respostaErros400,
  respostaPedidoInvalido,
} from "@/lib/area-cliente/erros";

// Pedir a ligação de reposição de palavra-passe por email. A resposta é sempre a mesma,
// exista ou não conta com esse email (o Django garante-o; aqui não se acrescenta nada que
// o denuncie). Nos logs nunca vai o email.

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/** Idioma da página que fez o pedido, para a ligação do email; outro valor não segue. */
function langDoPedido(value: unknown): Locale | undefined {
  return typeof value === "string" && hasLocale(value) ? value : undefined;
}

export async function POST(request: Request) {
  let body: { email?: unknown; lang?: unknown };
  try {
    body = await request.json();
  } catch {
    return respostaPedidoInvalido();
  }

  try {
    await backendFetch("/api/auth/password-reset/", {
      method: "POST",
      // A ligação de reposição abre no idioma da página em que foi pedida.
      body: { email: asString(body.email).trim(), lang: langDoPedido(body.lang) },
      clientIp: clientIpFrom(request),
    });
    return NextResponse.json({ status: "enviado" }, { status: 202 });
  } catch (erro) {
    if (erro instanceof BackendError) {
      if (erro.status === 400) return respostaErros400(erro.body, ["email"]);
      if (erro.status === 429) return respostaDemasiadosPedidos();
    }
    console.error(
      "Falha ao pedir reposição de palavra-passe:",
      erro instanceof BackendError ? `backend ${erro.status}` : erro,
    );
    return NextResponse.json({ error: "indisponivel" }, { status: 502 });
  }
}
