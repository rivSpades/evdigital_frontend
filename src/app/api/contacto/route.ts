import { NextResponse } from "next/server";
import { defaultLocale, hasLocale, type Locale } from "@/i18n/config";
import { contacto as contactoPt } from "@/i18n/dictionaries/pt/contacto";
import { contacto as contactoEn } from "@/i18n/dictionaries/en/contacto";
import { contacto as contactoPl } from "@/i18n/dictionaries/pl/contacto";

// Este route handler não tem acesso a root-params, por isso importa os slices do
// dicionário diretamente e escolhe pelo `lang` enviado no corpo do POST.
const MESSAGES: Record<Locale, typeof contactoPt> = {
  pt: contactoPt,
  en: contactoEn,
  pl: contactoPl,
};
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Proxy site → backend (PRD-backend.md §4.2).
// O browser nunca fala com o Django nem vê a LEADS_API_KEY: esta rota corre no
// servidor, e é o único sítio onde a chave existe.

const NEEDS = ["site", "melhorar", "avancado", "nao_sei"] as const;

// Os 7 slugs do catálogo (PRD-servicos.md §2), mais "não sei" — têm de coincidir com
// `Service` em backend/apps/leads/models.py e com os ficheiros em content/services/.
const SERVICES = [
  "site-profissional",
  "loja-online",
  "marcacoes-e-reservas",
  "negocio-no-google",
  "ferramentas-a-medida",
  "automacao-e-integracoes",
  "assistentes-ia",
  "auditoria-mvp-ia",
  "microsoft-365-azure",
  "nao_sei",
] as const;

type Payload = {
  lang?: unknown;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  need?: unknown;
  service?: unknown;
  message?: unknown;
  website?: unknown;
  elapsedSeconds?: unknown;
  meeting?: { start?: unknown; timeZone?: unknown } | unknown;
};

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function POST(request: Request) {
  const apiUrl = process.env.LEADS_API_URL;
  const apiKey = process.env.LEADS_API_KEY;

  if (!apiUrl || !apiKey) {
    console.error("LEADS_API_URL ou LEADS_API_KEY em falta");
    return NextResponse.json(
      { error: "indisponivel", message: MESSAGES[defaultLocale].api.unavailable },
      { status: 503 },
    );
  }

  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "pedido_invalido", message: MESSAGES[defaultLocale].api.invalidRequest },
      { status: 400 },
    );
  }

  const langValue = asString(body.lang);
  const lang: Locale = hasLocale(langValue) ? langValue : defaultLocale;
  const t = MESSAGES[lang];

  const need = asString(body.need);
  const service = asString(body.service);

  // Passo 2 do wizard (opcional): horário escolhido no calendário. Um valor mal
  // formado é tratado como "sem reunião" — o backend valida outra vez de qualquer
  // forma, e a lead nunca pode ficar bloqueada por isto.
  const meetingRaw =
    body.meeting && typeof body.meeting === "object" ? (body.meeting as Record<string, unknown>) : null;
  const meetingStart = meetingRaw ? asString(meetingRaw.start) : "";
  const meetingTimeZone = meetingRaw ? asString(meetingRaw.timeZone) : "";
  const meeting = meetingStart && meetingTimeZone ? { start: meetingStart, timezone: meetingTimeZone } : undefined;

  // Validação própria, com mensagens no idioma do visitante. O backend valida outra vez.
  const v = t.form.validation;
  const campos: Record<string, string[]> = {};
  if (!asString(body.name).trim()) campos.name = [v.nameRequired];
  if (!asString(body.email).trim()) campos.email = [v.emailRequired];
  else if (!EMAIL_PATTERN.test(asString(body.email).trim())) campos.email = [v.emailInvalid];
  if (!(NEEDS as readonly string[]).includes(need)) campos.need = [v.needRequired];
  if (!asString(body.message).trim()) campos.message = [v.messageRequired];
  if (Object.keys(campos).length > 0) {
    return NextResponse.json({ errors: campos }, { status: 400 });
  }

  // IP real do visitante. Em produção (Vercel) vem em x-forwarded-for; o primeiro
  // endereço da lista é o cliente. Em local costuma não existir.
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip")?.trim() ??
    "";

  try {
    const resposta = await fetch(`${apiUrl.replace(/\/$/, "")}/api/leads/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
        // Sem isto, o backend veria o IP deste servidor em todos os pedidos e o
        // rate limit passaria a ser global em vez de por visitante — bloqueando
        // leads verdadeiras assim que alguém enviasse algumas.
        ...(clientIp ? { "X-Forwarded-For": clientIp } : {}),
      },
      body: JSON.stringify({
        name: asString(body.name).trim(),
        email: asString(body.email).trim(),
        phone: asString(body.phone).trim(),
        need: (NEEDS as readonly string[]).includes(need) ? need : "",
        service: (SERVICES as readonly string[]).includes(service) ? service : "",
        message: asString(body.message).trim(),
        source: "site-contacto",
        website: asString(body.website),
        elapsed_seconds:
          typeof body.elapsedSeconds === "number" ? body.elapsedSeconds : undefined,
        meeting,
      }),
      // O visitante não pode ficar à espera indefinidamente se o backend estiver em baixo.
      signal: AbortSignal.timeout(10_000),
    });

    if (resposta.status === 429) {
      return NextResponse.json(
        { error: "demasiados_pedidos", message: t.api.tooManyRequests },
        { status: 429 },
      );
    }

    if (resposta.status === 400) {
      // As mensagens do backend estão em português: devolvemos as do idioma do visitante
      // para os campos que o backend rejeitou.
      const dados = await resposta.json();
      const doBackend: Record<string, unknown> = dados.errors ?? {};
      const mensagens: Record<string, string> = {
        name: v.nameRequired,
        email: v.emailInvalid,
        need: v.needRequired,
        message: v.messageRequired,
      };
      const errors: Record<string, string[]> = {};
      for (const campo of Object.keys(doBackend)) {
        errors[campo] = [mensagens[campo] ?? t.api.invalidRequest];
      }
      return NextResponse.json({ errors }, { status: 400 });
    }

    if (!resposta.ok) {
      console.error("Backend devolveu %s ao criar lead", resposta.status);
      return NextResponse.json(
        { error: "indisponivel", message: t.api.unavailable },
        { status: 502 },
      );
    }

    const dados: { meeting_confirmed?: boolean } = await resposta.json().catch(() => ({}));
    return NextResponse.json(
      { status: "recebida", meeting_confirmed: Boolean(dados.meeting_confirmed) },
      { status: 201 },
    );
  } catch (erro) {
    // Nunca registar o corpo do pedido: contém dados pessoais (PRD-backend.md §8).
    console.error("Falha a contactar o backend de leads:", erro);
    return NextResponse.json(
      { error: "indisponivel", message: t.api.unavailable },
      { status: 502 },
    );
  }
}
