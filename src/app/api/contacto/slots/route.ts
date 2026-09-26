import { NextResponse } from "next/server";

// Proxy site → backend (PRD-backend.md §4.2), mesmo padrão de ../route.ts.
// O browser nunca fala com o Django nem vê a LEADS_API_KEY: esta rota corre no
// servidor, e é o único sítio onde a chave existe. Passo 2 do wizard de /contacto:
// horários livres para o visitante escolher antes de "Finalizar".

export async function GET(request: Request) {
  const apiUrl = process.env.LEADS_API_URL;
  const apiKey = process.env.LEADS_API_KEY;

  if (!apiUrl || !apiKey) {
    console.error("LEADS_API_URL ou LEADS_API_KEY em falta");
    return NextResponse.json({ error: "indisponivel" }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start") ?? "";
  const end = searchParams.get("end") ?? "";
  const timeZone = searchParams.get("timeZone") ?? "";
  // "digital" (serviços) ou "consultoria" (páginas de consultor); o backend valida.
  const tipo = searchParams.get("tipo") ?? "digital";
  if (!start || !end || !timeZone) {
    return NextResponse.json({ error: "pedido_invalido" }, { status: 400 });
  }

  try {
    const params = new URLSearchParams({ start, end, timezone: timeZone, tipo });
    const resposta = await fetch(`${apiUrl.replace(/\/$/, "")}/api/calcom/slots/?${params}`, {
      headers: { "X-API-Key": apiKey },
      // O visitante não pode ficar à espera indefinidamente se o Cal.com estiver lento.
      signal: AbortSignal.timeout(10_000),
    });

    if (!resposta.ok) {
      console.error("Backend devolveu %s ao buscar horários", resposta.status);
      return NextResponse.json({ data: {} }, { status: 200 });
    }

    const dados = await resposta.json();
    return NextResponse.json(dados, { status: 200 });
  } catch (erro) {
    console.error("Falha a contactar o backend de horários:", erro);
    // Nunca bloqueia o wizard: sem horários, o visitante continua sem reunião.
    return NextResponse.json({ data: {} }, { status: 200 });
  }
}
