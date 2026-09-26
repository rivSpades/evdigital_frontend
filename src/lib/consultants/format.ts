// Formatação partilhada pela página do consultor e pelo CV em PDF (mesmos textos nos dois).
// Módulo puro: sem copy própria, as frases vêm do dicionário `consultores`.

import { intlLocale, type Locale } from "@/i18n/config";
import type { EtapaPercurso } from "./backend";

const ano = (iso: string) => iso.slice(0, 4);

/** "2012 a 2015" / "Desde 2024" (etapa actual, sem fim), no idioma da página. */
export function periodoEtapa(
  etapa: Pick<EtapaPercurso, "period_start" | "period_end">,
  t: { periodo: string; desde: string },
): string {
  const inicio = ano(etapa.period_start);
  if (!etapa.period_end) return t.desde.replace("{inicio}", inicio);
  const fim = ano(etapa.period_end);
  // Etapa dentro do mesmo ano: só o ano, sem "2020 a 2020".
  if (fim === inicio) return inicio;
  return t.periodo.replace("{inicio}", inicio).replace("{fim}", fim);
}

export const anoInicio = (etapa: Pick<EtapaPercurso, "period_start">) => ano(etapa.period_start);

/**
 * Valor em euros como no .pen ("3 500 €", mono): separador de milhares sempre (o pt-PT do
 * Intl não agrupa 4 dígitos), sem casas decimais quando o valor é inteiro. `null` ou texto
 * inválido devolve `null` (a linha não aparece, ds/display/linha-salario).
 */
export function formatarEuros(valor: string | null, lang: Locale): string | null {
  if (valor === null) return null;
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return null;
  const inteiro = Number.isInteger(numero);
  return new Intl.NumberFormat(intlLocale[lang], {
    style: "currency",
    currency: "EUR",
    useGrouping: "always",
    minimumFractionDigits: inteiro ? 0 : 2,
    maximumFractionDigits: inteiro ? 0 : 2,
  }).format(numero);
}

/** Iniciais do retrato sem foto (ds/display/retrato, camada Iniciais). */
export function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  const letras = partes.length > 1 ? [partes[0], partes[partes.length - 1]] : partes;
  return letras.map((parte) => parte.charAt(0).toUpperCase()).join("");
}

/**
 * Competências do CV (ds/cv/facto): cada entrada do Admin é "Área: a, b, c" (termo + valor)
 * ou só "a, b, c" (só valor). O Admin guarda uma lista de textos (`Consultant.skills`).
 */
export function competencias(skills: string[]): { area?: string; itens: string }[] {
  return skills
    .map((entrada) => entrada.trim())
    .filter(Boolean)
    .map((entrada) => {
      const separador = entrada.indexOf(":");
      if (separador <= 0) return { itens: entrada };
      return {
        area: entrada.slice(0, separador).trim(),
        itens: entrada.slice(separador + 1).trim(),
      };
    });
}
