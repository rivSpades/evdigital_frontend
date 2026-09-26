import type { NextRequest } from "next/server";
import { fotoDoBackend, slugValido } from "@/lib/consultants/backend";

// Foto do consultor: proxy de stream site → Django (`GET /api/consultants/<slug>/photo/`, com
// X-API-Key). O browser nunca fala com o Django (backend/Context.md, decisão #2). Só
// consultores publicados; qualquer outra coisa é 404.
//
// Cache: a foto muda raramente e a página é escondida; uma hora no browser/CDN e um dia de
// stale-while-revalidate. Trocar a foto no Admin aparece no máximo uma hora depois.

const CACHE = "public, max-age=3600, stale-while-revalidate=86400";

export async function GET(_request: NextRequest, ctx: RouteContext<"/api/consultants/[slug]/photo">) {
  const { slug } = await ctx.params;
  if (!slugValido(slug)) return new Response(null, { status: 404 });

  let resposta: Response;
  try {
    resposta = await fotoDoBackend(slug);
  } catch (erro) {
    console.error("Falha a contactar o backend (foto de consultor):", erro);
    return new Response(null, { status: 502 });
  }

  if (resposta.status === 404) return new Response(null, { status: 404 });
  const tipo = resposta.headers.get("content-type") ?? "";
  if (!resposta.ok || !resposta.body || !tipo.startsWith("image/")) {
    console.error("Backend devolveu %s ao ler a foto de um consultor", resposta.status);
    return new Response(null, { status: 502 });
  }

  const cabecalhos = new Headers({
    "Content-Type": tipo,
    "Cache-Control": CACHE,
    "X-Content-Type-Options": "nosniff",
  });
  const tamanho = resposta.headers.get("content-length");
  if (tamanho) cabecalhos.set("Content-Length", tamanho);
  return new Response(resposta.body, { status: 200, headers: cabecalhos });
}
