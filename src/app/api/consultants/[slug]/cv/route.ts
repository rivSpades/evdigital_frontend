import { renderToBuffer } from "@react-pdf/renderer";
import type { NextRequest } from "next/server";
import { createElement, type ReactElement } from "react";
import { defaultLocale, hasLocale, type Locale } from "@/i18n/config";
import { consultores as consultoresPt } from "@/i18n/dictionaries/pt/consultores";
import { consultores as consultoresEn } from "@/i18n/dictionaries/en/consultores";
import { consultores as consultoresPl } from "@/i18n/dictionaries/pl/consultores";
import { fotoDoBackend, lerConsultor, type Consultor } from "@/lib/consultants/backend";
import { CvDocumento, type Foto } from "@/lib/consultants/cv-document";

// CV do consultor em PDF (A4, frames ZMWy6/AoWpt do design-system.pen; desenho em
// src/lib/consultants/cv-document.tsx). `?lang=pt|en|pl` (por omissão pt). Descarrega como
// anexo (`Content-Disposition: attachment`). Dados e foto vêm do Django pelo servidor do
// site (X-API-Key), nunca do browser; consultor não publicado dá 404.
//
// Runtime Node (@react-pdf/renderer lê as fontes do disco e está na lista de pacotes
// externos do Next). Os route handlers não têm root-params: o dicionário importa-se aqui.

export const runtime = "nodejs";

const TEXTOS: Record<Locale, typeof consultoresPt> = {
  pt: consultoresPt,
  en: consultoresEn,
  pl: consultoresPl,
};

async function lerFoto(consultor: Consultor): Promise<Foto> {
  if (!consultor.has_photo) return null;
  try {
    const resposta = await fotoDoBackend(consultor.slug);
    if (!resposta.ok) return null;
    const tipo = resposta.headers.get("content-type") ?? "";
    // O @react-pdf só desenha JPEG e PNG; outro formato fica com as iniciais.
    const format = tipo.includes("png") ? "png" : /jpe?g/.test(tipo) ? "jpg" : null;
    if (!format) return null;
    return { data: Buffer.from(await resposta.arrayBuffer()), format };
  } catch (erro) {
    console.error("Falha a ler a foto do consultor para o CV:", erro);
    return null;
  }
}

export async function GET(request: NextRequest, ctx: RouteContext<"/api/consultants/[slug]/cv">) {
  const { slug } = await ctx.params;
  const pedido = request.nextUrl.searchParams.get("lang");
  const lang: Locale = hasLocale(pedido) ? pedido : defaultLocale;

  let consultor: Consultor | null;
  try {
    consultor = await lerConsultor(slug, lang);
  } catch (erro) {
    console.error("Falha a contactar o backend (CV de consultor):", erro);
    return new Response(null, { status: 502 });
  }
  if (!consultor) return new Response(null, { status: 404 });

  const t = TEXTOS[lang];
  const foto = await lerFoto(consultor);
  const documento = createElement(CvDocumento, {
    consultor,
    foto,
    lang,
    t,
  }) as unknown as ReactElement<Parameters<typeof renderToBuffer>[0]["props"]>;
  const pdf = await renderToBuffer(documento);

  const nome = `${t.cv.ficheiro}-${consultor.slug}-${lang}.pdf`;
  return new Response(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${nome}"`,
      "Content-Length": String(pdf.length),
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
