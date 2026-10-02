// Resumo dos serviços no idioma do visitante, enviado ao backend como único conhecimento do
// assistente (backend/apps/assistant/prompts.py). Vem do mesmo conteúdo que as páginas de
// /servicos: não há uma segunda cópia do texto. Só corre no servidor (lê `content/`).

import { getAllServices } from "@/lib/content";
import type { Locale } from "@/i18n/config";
import { contacto as contactoPt } from "@/i18n/dictionaries/pt/contacto";
import { contacto as contactoEn } from "@/i18n/dictionaries/en/contacto";
import { contacto as contactoPl } from "@/i18n/dictionaries/pl/contacto";
import { home as homePt } from "@/i18n/dictionaries/pt/home";
import { home as homeEn } from "@/i18n/dictionaries/en/home";
import { home as homePl } from "@/i18n/dictionaries/pl/home";

const CONTACTO = { pt: contactoPt, en: contactoEn, pl: contactoPl } as const;
const HOME = { pt: homePt, en: homeEn, pl: homePl } as const;

const MAX_POR_SERVICO = 1100;
const MAX_TOTAL = 11_500; // o backend corta nos 12 000

const cache = new Map<Locale, string>();

function limitar(texto: string, max: number): string {
  return texto.length <= max ? texto : `${texto.slice(0, max - 1).trimEnd()}…`;
}

export function conhecimentoDoSite(lang: Locale): string {
  const guardado = cache.get(lang);
  if (guardado) return guardado;

  const cabecalho = [
    `Reply time: ${CONTACTO[lang].page.subtitle}`,
  ].join("\n");

  // Resposta geral do site (Home): como trabalhamos e as FAQ sobre preço, prazos e suporte.
  const geral = limitar(
    [
      "HOW WE WORK",
      ...HOME[lang].how.steps.map((passo, i) => `${i + 1}. ${passo}`),
      "GENERAL FAQ",
      ...HOME[lang].faq.items.map((i) => `Q: ${i.question} A: ${i.answer}`),
    ].join("\n"),
    MAX_POR_SERVICO * 2,
  );

  const servicos = getAllServices(lang).map(({ slug, frontmatter: f }) => {
    const linhas = [
      `SERVICE ${f.title} (slug: ${slug})`,
      f.summary,
      ...f.includes.slice(0, 5).map((i) => `- ${i}`),
      ...f.requires.slice(0, 2).map((r) => `Requires: ${r}`),
      ...f.faq.slice(0, 3).map((q) => `Q: ${q.q} A: ${q.a}`),
    ];
    return limitar(linhas.join("\n"), MAX_POR_SERVICO);
  });

  const texto = limitar([cabecalho, geral, ...servicos].join("\n\n"), MAX_TOTAL);
  cache.set(lang, texto);
  return texto;
}
