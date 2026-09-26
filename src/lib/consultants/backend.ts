// Consultores (`/consultants`): leitura do backend Django a partir do servidor do site,
// nunca do browser (backend/Context.md, decisão #2). O JSON passa por `backendFetch` da
// Área de Cliente (mesma `LEADS_API_URL`/`LEADS_API_KEY`, `X-API-Key`); a foto é binária e
// usa `fotoDoBackend`, com a mesma chave.
//
// Server-only por convenção (usa `LEADS_API_KEY`): só Server Components e Route Handlers.
//
// Contrato (apps/consultants/serializers.py): só consultores publicados; textos já no
// idioma pedido (`?lang=`, en/pl vazios caem em pt); salários em string decimal ou `null`.

import { BackendError, backendFetch } from "@/lib/area-cliente/backend";
import type { Locale } from "@/i18n/config";

export type ConsultorResumo = {
  slug: string;
  name: string;
  headline: string;
  has_photo: boolean;
};

export type EtapaPercurso = {
  /** ISO (AAAA-MM-DD). */
  period_start: string;
  /** ISO, ou `null` se é a etapa actual. */
  period_end: string | null;
  organisation: string;
  role: string;
  story: string;
};

/**
 * Linha de Idiomas (`label` = língua, `value` = nível) ou de Habilitações (`label` = curso,
 * `value` = instituição e anos). `value` pode vir vazio de propósito (ex. «Carta de condução»).
 */
export type ItemPerfil = {
  label: string;
  value: string;
};

export type Consultor = ConsultorResumo & {
  /** Parágrafos separados por uma linha vazia. */
  bio: string;
  location: string;
  email: string;
  phone: string;
  skills: string[];
  contract_monthly_eur: string | null;
  freelance_hourly_eur: string | null;
  /** Do mais antigo ao mais recente. */
  steps: EtapaPercurso[];
  languages: ItemPerfil[];
  qualifications: ItemPerfil[];
};

/** Slugs do Django (`<slug:slug>`): evita pedir ao backend caminhos que nunca existem. */
export function slugValido(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug) && slug.length <= 50;
}

export async function listarConsultores(lang: Locale): Promise<ConsultorResumo[]> {
  const resposta = await backendFetch<{ data: ConsultorResumo[] }>(
    `/api/consultants/?lang=${lang}`,
  );
  return resposta.data;
}

/** `null` se não existe ou não está publicado (404 do Django). */
export async function lerConsultor(slug: string, lang: Locale): Promise<Consultor | null> {
  if (!slugValido(slug)) return null;
  try {
    const resposta = await backendFetch<{ data: Consultor }>(
      `/api/consultants/${encodeURIComponent(slug)}/?lang=${lang}`,
    );
    return resposta.data;
  } catch (erro) {
    if (erro instanceof BackendError && erro.status === 404) return null;
    throw erro;
  }
}

/** Resposta crua do Django para a foto (stream). O chamador trata 404 e o corpo. */
export async function fotoDoBackend(slug: string): Promise<Response> {
  const apiUrl = process.env.LEADS_API_URL;
  const apiKey = process.env.LEADS_API_KEY;
  if (!apiUrl || !apiKey) throw new Error("LEADS_API_URL ou LEADS_API_KEY em falta");
  return fetch(`${apiUrl.replace(/\/$/, "")}/api/consultants/${encodeURIComponent(slug)}/photo/`, {
    headers: { "X-API-Key": apiKey },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
}
