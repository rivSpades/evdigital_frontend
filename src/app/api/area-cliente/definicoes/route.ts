import { NextResponse } from "next/server";
import { BackendError, backendFetch } from "@/lib/area-cliente/backend";
import { getSessionToken } from "@/lib/area-cliente/session";
import type { Perfil } from "@/lib/area-cliente/types";

type Payload = {
  name?: unknown;
  phone?: unknown;
  company?: unknown;
  nif?: unknown;
};

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function PATCH(request: Request) {
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

  try {
    const dados = await backendFetch<Perfil>("/api/me/", {
      method: "PATCH",
      token,
      body: {
        name: asString(body.name).trim(),
        phone: asString(body.phone).trim(),
        company: asString(body.company).trim(),
        nif: asString(body.nif).trim(),
      },
    });
    return NextResponse.json(dados);
  } catch (erro) {
    if (erro instanceof BackendError) {
      if (erro.status === 401 || erro.status === 403) {
        return NextResponse.json({ error: "sem_sessao" }, { status: 401 });
      }
      if (erro.status === 400) {
        return NextResponse.json(erro.body, { status: 400 });
      }
    }
    console.error("Falha ao actualizar o perfil na Área de Cliente:", erro);
    return NextResponse.json({ error: "indisponivel" }, { status: 502 });
  }
}
