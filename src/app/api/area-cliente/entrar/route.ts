import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AC_COOKIE_NAME, BackendError, backendFetch } from "@/lib/area-cliente/backend";
import { cookieOptions } from "@/lib/area-cliente/session";
import type { MeInfo } from "@/lib/area-cliente/session";

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function POST(request: Request) {
  let body: { email?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "pedido_invalido" }, { status: 400 });
  }

  try {
    const dados = await backendFetch<{ token: string; user: MeInfo }>("/api/auth/login/", {
      method: "POST",
      body: { email: asString(body.email).trim(), password: asString(body.password) },
    });

    const store = await cookies();
    store.set(AC_COOKIE_NAME, dados.token, cookieOptions());

    return NextResponse.json({ user: dados.user }, { status: 200 });
  } catch (erro) {
    if (erro instanceof BackendError && (erro.status === 400 || erro.status === 403)) {
      return NextResponse.json(erro.body, { status: erro.status });
    }
    console.error("Falha ao entrar na Área de Cliente:", erro);
    return NextResponse.json({ error: "indisponivel" }, { status: 502 });
  }
}
