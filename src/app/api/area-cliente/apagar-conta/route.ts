import { NextResponse } from "next/server";
import { BackendError, backendFetch, clientIpFrom } from "@/lib/area-cliente/backend";
import { respostaDemasiadosPedidos } from "@/lib/area-cliente/erros";
import { getSessionToken } from "@/lib/area-cliente/session";

// Pedido de apagamento da conta (Definições · Segurança · zona de perigo). O Django não
// apaga nada: envia um email à equipa, que trata o pedido à mão (backend
// apps/accounts/views.py, AccountDeleteRequestView). Sem body.
//
//   202 → { status: "pedido_enviado" }
//   401 → { error: "sem_sessao" }           (sem cookie, ou token recusado pelo Django)
//   429 → { error: "demasiados_pedidos" }   (throttle "account", por conta)
//   502 → { error: "indisponivel" }         (email não seguiu, ou backend em baixo)

export async function POST(request: Request) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: "sem_sessao" }, { status: 401 });
  }

  try {
    await backendFetch("/api/me/delete-request/", {
      method: "POST",
      token,
      clientIp: clientIpFrom(request),
    });
    return NextResponse.json({ status: "pedido_enviado" }, { status: 202 });
  } catch (erro) {
    if (erro instanceof BackendError) {
      if (erro.status === 401 || erro.status === 403) {
        return NextResponse.json({ error: "sem_sessao" }, { status: 401 });
      }
      if (erro.status === 429) return respostaDemasiadosPedidos();
    }
    console.error(
      "Falha ao pedir o apagamento da conta:",
      erro instanceof BackendError ? `backend ${erro.status}` : erro,
    );
    return NextResponse.json({ error: "indisponivel" }, { status: 502 });
  }
}
