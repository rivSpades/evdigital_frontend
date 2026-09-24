import { NextResponse } from "next/server";
import { hasLocale, type Locale } from "@/i18n/config";
import { BackendError, backendFetch, clientIpFrom } from "@/lib/area-cliente/backend";
import {
  respostaDemasiadosPedidos,
  respostaErros400,
  respostaPedidoInvalido,
} from "@/lib/area-cliente/erros";

// Proxy site → backend (PRD-backend.md §4.2), mesmo padrão de /api/contacto.

type Payload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  password?: unknown;
  lang?: unknown;
};

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/** Idioma da página que fez o pedido, para a ligação do email; outro valor não segue. */
function langDoPedido(value: unknown): Locale | undefined {
  return typeof value === "string" && hasLocale(value) ? value : undefined;
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return respostaPedidoInvalido();
  }

  try {
    const dados = await backendFetch("/api/auth/register/", {
      method: "POST",
      body: {
        name: asString(body.name).trim(),
        email: asString(body.email).trim(),
        phone: asString(body.phone).trim(),
        password: asString(body.password),
        // A ligação de confirmação do email abre no idioma em que a conta foi criada.
        lang: langDoPedido(body.lang),
      },
      clientIp: clientIpFrom(request),
    });
    return NextResponse.json(dados, { status: 201 });
  } catch (erro) {
    if (erro instanceof BackendError) {
      // O formulário tem erro por campo em nome, email e palavra-passe; telefone e
      // non_field_errors caem em `geral`.
      if (erro.status === 400) return respostaErros400(erro.body, ["name", "email", "password"]);
      if (erro.status === 429) return respostaDemasiadosPedidos();
    }
    console.error("Falha ao registar conta na Área de Cliente:", erro);
    return NextResponse.json({ error: "indisponivel" }, { status: 502 });
  }
}
