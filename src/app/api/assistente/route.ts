import { NextResponse } from "next/server";
import { defaultLocale, hasLocale, type Locale } from "@/i18n/config";
import { assistente as assistentePt } from "@/i18n/dictionaries/pt/assistente";
import { assistente as assistenteEn } from "@/i18n/dictionaries/en/assistente";
import { assistente as assistentePl } from "@/i18n/dictionaries/pl/assistente";
import { conhecimentoDoSite } from "@/lib/assistente/conhecimento";

// Proxy site → backend do assistente (PRD-backend.md §4.2): o browser nunca fala com o
// Django nem vê a LEADS_API_KEY. O Groq só é chamado pelo backend (a chave dele não existe aqui).
// Sem estado: o cliente reenvia o histórico a cada mensagem; nada é gravado neste servidor.

const MESSAGES: Record<Locale, typeof assistentePt> = {
  pt: assistentePt,
  en: assistenteEn,
  pl: assistentePl,
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_CHARS = 1000;
const MAX_HISTORICO = 12;

type Mensagem = { role: "user" | "assistant"; content: string };

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function mensagensValidas(valor: unknown): Mensagem[] | null {
  if (!Array.isArray(valor) || valor.length === 0) return null;
  const limpas: Mensagem[] = [];
  for (const item of valor.slice(-MAX_HISTORICO)) {
    const role = item && typeof item === "object" ? (item as Record<string, unknown>).role : null;
    const content = asString((item as Record<string, unknown>)?.content).trim();
    if ((role !== "user" && role !== "assistant") || !content || content.length > MAX_CHARS) {
      return null;
    }
    limpas.push({ role, content });
  }
  return limpas[limpas.length - 1].role === "user" ? limpas : null;
}

// O backend já validou o rascunho; aqui só se garante a forma e se descartam campos a mais.
function rascunhoValido(valor: unknown) {
  if (!valor || typeof valor !== "object") return null;
  const r = valor as Record<string, unknown>;
  return {
    name: asString(r.name),
    email: asString(r.email),
    phone: asString(r.phone),
    need: asString(r.need),
    service: asString(r.service),
    message: asString(r.message),
  };
}

export async function POST(request: Request) {
  const apiUrl = process.env.LEADS_API_URL;
  const apiKey = process.env.LEADS_API_KEY;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "pedido_invalido", message: MESSAGES[defaultLocale].errors.invalidRequest },
      { status: 400 },
    );
  }

  const langValue = asString(body.lang);
  const lang: Locale = hasLocale(langValue) ? langValue : defaultLocale;
  const t = MESSAGES[lang];

  const messages = mensagensValidas(body.messages);
  if (!messages) {
    return NextResponse.json(
      { error: "pedido_invalido", message: t.errors.invalidRequest },
      { status: 400 },
    );
  }

  if (!apiUrl || !apiKey) {
    console.error("LEADS_API_URL ou LEADS_API_KEY em falta");
    return NextResponse.json(
      { error: "indisponivel", message: t.errors.unavailable },
      { status: 503 },
    );
  }

  // IP real do visitante (ver /api/contacto): sem ele o limite do backend seria global.
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip")?.trim() ??
    "";

  try {
    const resposta = await fetch(`${apiUrl.replace(/\/$/, "")}/api/assistant/chat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
        ...(clientIp ? { "X-Forwarded-For": clientIp } : {}),
      },
      body: JSON.stringify({
        messages,
        lang,
        browser_lang: asString(body.browserLang).slice(0, 16),
        knowledge: conhecimentoDoSite(lang),
        lead_sent: body.leadSent === true,
        // Id da conversa (UUID do browser): o backend grava a troca nesta conversa.
        ...(UUID.test(asString(body.conversationId))
          ? { conversation_id: asString(body.conversationId) }
          : {}),
      }),
      // Groq (até 20 s por chamada, com tool calling pode haver duas) + margem.
      signal: AbortSignal.timeout(45_000),
    });

    if (resposta.status === 429) {
      return NextResponse.json(
        { error: "demasiados_pedidos", message: t.errors.tooManyRequests },
        { status: 429 },
      );
    }
    if (resposta.status === 400) {
      return NextResponse.json(
        { error: "pedido_invalido", message: t.errors.invalidRequest },
        { status: 400 },
      );
    }
    if (!resposta.ok) {
      console.error("Backend do assistente devolveu %s", resposta.status);
      return NextResponse.json(
        { error: "indisponivel", message: t.errors.unavailable },
        { status: 502 },
      );
    }

    const dados: { answer?: string; lead_draft?: Record<string, unknown> | null } =
      await resposta.json();
    return NextResponse.json({ answer: dados.answer ?? "", leadDraft: rascunhoValido(dados.lead_draft) });
  } catch (erro) {
    // Nunca registar o corpo do pedido: contém a conversa (dados pessoais).
    console.error("Falha a contactar o backend do assistente:", erro);
    return NextResponse.json(
      { error: "indisponivel", message: t.errors.unavailable },
      { status: 502 },
    );
  }
}
