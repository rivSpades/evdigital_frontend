import { NextResponse } from "next/server";
import { BackendError, backendFetch } from "@/lib/area-cliente/backend";
import { getSessionToken } from "@/lib/area-cliente/session";

export async function POST(request: Request, { params }: RouteContext<"/api/area-cliente/pedidos/[id]/comentarios">) {
  const { id } = await params;
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: "sem_sessao" }, { status: 401 });
  }

  let body: { body?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "pedido_invalido" }, { status: 400 });
  }

  const texto = typeof body.body === "string" ? body.body.trim() : "";

  try {
    const dados = await backendFetch(`/api/me/requests/${id}/comments/`, {
      method: "POST",
      token,
      body: { body: texto },
    });
    return NextResponse.json(dados, { status: 201 });
  } catch (erro) {
    if (erro instanceof BackendError) {
      if (erro.status === 401 || erro.status === 403) {
        return NextResponse.json({ error: "sem_sessao" }, { status: 401 });
      }
      if (erro.status === 404) {
        return NextResponse.json({ error: "nao_encontrado" }, { status: 404 });
      }
      if (erro.status === 400) {
        return NextResponse.json(erro.body, { status: 400 });
      }
    }
    console.error("Falha ao comentar pedido na Área de Cliente:", erro);
    return NextResponse.json({ error: "indisponivel" }, { status: 502 });
  }
}
