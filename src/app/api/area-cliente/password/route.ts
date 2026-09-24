import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AC_COOKIE_NAME, BackendError, backendFetch, clientIpFrom } from "@/lib/area-cliente/backend";
import {
  respostaDemasiadosPedidos,
  respostaErros400,
  respostaPedidoInvalido,
} from "@/lib/area-cliente/erros";
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
    return respostaPedidoInvalido();
  }

  // `old_password` só é obrigatória para contas que já têm palavra-passe utilizável
  // (`has_usable_password` em /api/me/). Conta criada com Google define a primeira sem
  // ela. Quem decide é o Django, que sabe o estado real da conta: aqui não se exige nada
  // e, vazia, nem se envia (para conta normal o Django responde "obrigatória" em
  // `errors.old_password`, igual a antes).
  const oldPassword = asString(body.old_password);

  try {
    const dados = await backendFetch<{ token: string }>("/api/auth/password/", {
      method: "POST",
      token,
      body: {
        ...(oldPassword ? { old_password: oldPassword } : {}),
        new_password: asString(body.new_password),
      },
      clientIp: clientIpFrom(request),
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
      if (erro.status === 400) return respostaErros400(erro.body, ["old_password", "new_password"]);
      if (erro.status === 429) return respostaDemasiadosPedidos();
    }
    console.error("Falha ao mudar a palavra-passe na Área de Cliente:", erro);
    return NextResponse.json({ error: "indisponivel" }, { status: 502 });
  }
}
