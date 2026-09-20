import { NextResponse } from "next/server";
import { BackendError, backendFetch } from "@/lib/area-cliente/backend";
import { getSessionToken } from "@/lib/area-cliente/session";

type Payload = {
  type?: unknown;
  title?: unknown;
  description?: unknown;
  priority?: unknown;
  project?: unknown;
};

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function POST(request: Request) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: "sem_sessao" }, { status: 401 });
  }

  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "pedido_invalido" }, { status: 400 });
  }

  const projeto = asString(body.project);

  try {
    const dados = await backendFetch("/api/me/requests/", {
      method: "POST",
      token,
      body: {
        type: asString(body.type),
        title: asString(body.title).trim(),
        description: asString(body.description).trim(),
        priority: asString(body.priority) || "quando_possivel",
        project: projeto || null,
      },
    });
    return NextResponse.json(dados, { status: 201 });
  } catch (erro) {
    if (erro instanceof BackendError) {
      if (erro.status === 401 || erro.status === 403) {
        return NextResponse.json({ error: "sem_sessao" }, { status: 401 });
      }
      if (erro.status === 400) {
        return NextResponse.json(erro.body, { status: 400 });
      }
    }
    console.error("Falha ao criar pedido na Área de Cliente:", erro);
    return NextResponse.json({ error: "indisponivel" }, { status: 502 });
  }
}
