import { NextResponse } from "next/server";

// Formato único dos erros que os route handlers da Área de Cliente devolvem ao browser.
//
//   400 → { errors: { <campo>: string[], geral?: string[] }, error?: string }
//   429 → { error: "demasiados_pedidos" }
//
// `errors.<campo>` só leva os campos que o formulário sabe mostrar ao lado do input
// (`campos`); tudo o resto (non_field_errors, campos que o formulário não tem, códigos
// como `ligacao_invalida`) cai em `errors.geral`. Assim um 400 do Django nunca fica
// sem nada visível no formulário. O conteúdo de `geral` é informativo (mensagem do
// backend, em português, ou o código): o formulário mostra a sua própria frase genérica.

export type ErrosNormalizados = { errors: Record<string, string[]>; error?: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mensagens(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.filter((m): m is string => typeof m === "string");
  return [];
}

export function normalizarErros400(body: unknown, campos: readonly string[]): ErrosNormalizados {
  const dados = isRecord(body) ? body : {};
  const codigo = typeof dados.error === "string" ? dados.error : undefined;
  const doBackend = isRecord(dados.errors) ? dados.errors : {};

  const errors: Record<string, string[]> = {};
  const geral: string[] = [];
  let haOutros = false;

  for (const [campo, valor] of Object.entries(doBackend)) {
    const lista = mensagens(valor);
    if (campos.includes(campo)) {
      errors[campo] = lista.length > 0 ? lista : ["invalido"];
    } else {
      haOutros = true;
      geral.push(...lista);
    }
  }

  if (haOutros || Object.keys(errors).length === 0) {
    errors.geral = geral.length > 0 ? geral : [codigo ?? "invalido"];
  }

  return codigo ? { errors, error: codigo } : { errors };
}

export function respostaErros400(body: unknown, campos: readonly string[]) {
  return NextResponse.json(normalizarErros400(body, campos), { status: 400 });
}

/** JSON do browser mal formado: mesmo formato, para o formulário ter o que mostrar. */
export function respostaPedidoInvalido() {
  return NextResponse.json(
    { error: "pedido_invalido", errors: { geral: ["pedido_invalido"] } },
    { status: 400 },
  );
}

/** Rate limit do Django (`throttle_scope = "auth"`). Sem frase: o formulário decide. */
export function respostaDemasiadosPedidos() {
  return NextResponse.json({ error: "demasiados_pedidos" }, { status: 429 });
}
