import { NextResponse } from "next/server";
import { BackendError, backendFetch } from "@/lib/area-cliente/backend";

// Proxy site → backend (PRD-backend.md §4.2), mesmo padrão de /api/contacto.

type Payload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  password?: unknown;
};

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "pedido_invalido" }, { status: 400 });
  }

  try {
    const dados = await backendFetch("/api/auth/register/", {
      method: "POST",
      body: {
        name: asString(body.name).trim(),
        email: asString(body.email).trim(),
        phone: asString(body.phone).trim(),
        password: asString(body.password),
      },
    });
    return NextResponse.json(dados, { status: 201 });
  } catch (erro) {
    if (erro instanceof BackendError && erro.status === 400) {
      return NextResponse.json(erro.body, { status: 400 });
    }
    console.error("Falha ao registar conta na Área de Cliente:", erro);
    return NextResponse.json({ error: "indisponivel" }, { status: 502 });
  }
}
