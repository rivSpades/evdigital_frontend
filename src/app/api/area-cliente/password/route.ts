import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AC_COOKIE_NAME, BackendError, backendFetch } from "@/lib/area-cliente/backend";
import { cookieOptions, getSessionToken } from "@/lib/area-cliente/session";

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function POST(request: Request) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: "sem_sessao" }, { status: 401 });
  }

  let body: { old_password?: unknown; new_password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "pedido_invalido" }, { status: 400 });
  }

  try {
    const dados = await backendFetch<{ token: string }>("/api/auth/password/", {
      method: "POST",
      token,
      body: {
        old_password: asString(body.old_password),
        new_password: asString(body.new_password),
      },
    });

    // O backend rotaciona o token ao mudar a password (invalida as restantes
    // sessões) — sem actualizar o cookie aqui, a sessão actual ficava "presa" com
    // um token já apagado no Django.
    const store = await cookies();
    store.set(AC_COOKIE_NAME, dados.token, cookieOptions());

    return NextResponse.json({ status: "mudada" });
  } catch (erro) {
    if (erro instanceof BackendError) {
      if (erro.status === 401 || erro.status === 403) {
        return NextResponse.json({ error: "sem_sessao" }, { status: 401 });
      }
      if (erro.status === 400) {
        return NextResponse.json(erro.body, { status: 400 });
      }
    }
    console.error("Falha ao mudar a palavra-passe na Área de Cliente:", erro);
    return NextResponse.json({ error: "indisponivel" }, { status: 502 });
  }
}
