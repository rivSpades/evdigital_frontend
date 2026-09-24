import { NextResponse } from "next/server";
import { BackendError, backendFetch, clientIpFrom } from "@/lib/area-cliente/backend";
import {
  respostaDemasiadosPedidos,
  respostaErros400,
  respostaPedidoInvalido,
} from "@/lib/area-cliente/erros";

// Definir a palavra-passe nova a partir da ligação do email (uid + token). Não abre
// sessão: o Django termina todas as sessões da conta e o UI manda para "Entrar". Nos logs
// nunca vão uid, token nem palavra-passe.

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function POST(request: Request) {
  let body: { uid?: unknown; token?: unknown; new_password?: unknown };
  try {
    body = await request.json();
  } catch {
    return respostaPedidoInvalido();
  }

  const uid = asString(body.uid).trim();
  const token = asString(body.token).trim();
  // Sem ligação não vale a pena ir ao Django: mesma resposta que ele daria.
  if (!uid || !token) {
    return respostaErros400({ error: "ligacao_invalida" }, ["new_password"]);
  }

  try {
    await backendFetch("/api/auth/password-reset/confirm/", {
      method: "POST",
      body: { uid, token, new_password: asString(body.new_password) },
      clientIp: clientIpFrom(request),
    });
    return NextResponse.json({ status: "reposta" });
  } catch (erro) {
    if (erro instanceof BackendError) {
      if (erro.status === 400) return respostaErros400(erro.body, ["new_password"]);
      if (erro.status === 429) return respostaDemasiadosPedidos();
    }
    console.error(
      "Falha ao repor a palavra-passe:",
      erro instanceof BackendError ? `backend ${erro.status}` : erro,
    );
    return NextResponse.json({ error: "indisponivel" }, { status: 502 });
  }
}
