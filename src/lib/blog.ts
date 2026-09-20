import type { getAllBlogPosts } from "@/lib/content";
import type { BlogPostFrontmatter } from "@/lib/content";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

// Utilitários partilhados pelas duas páginas de blog (listagem e artigo).
// A camada de dados continua em content.ts; aqui só vive a apresentação dos metadados.

export type BlogPost = ReturnType<typeof getAllBlogPosts>[number];
export type BlogLevel = BlogPostFrontmatter["level"];

const DATE_LOCALE: Record<Locale, string> = { pt: "pt-PT", en: "en-GB", pl: "pl-PL" };

export function formatPostDate(lang: Locale, date: Date) {
  return new Intl.DateTimeFormat(DATE_LOCALE[lang], {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function fillCount(template: string, n: number) {
  return template.replace("{n}", String(n));
}

/** "1 artigo" / "N artigos", com as formas plurais do idioma (polaco tem "few"). */
export function articleCount(lang: Locale, blog: Dictionary["blog"], n: number) {
  const category = new Intl.PluralRules(DATE_LOCALE[lang]).select(n);
  if (category === "one") return blog.countOne;
  return fillCount(category === "few" ? blog.countFew : blog.countMany, n);
}

// Estimativa de leitura a 200 palavras por minuto. É um cálculo sobre o texto real do
// artigo, não um número inventado (copy-draft.md §7: nunca prova inventada).
const WORDS_PER_MINUTE = 200;

export function readingMinutes(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function levelLabel(blog: Dictionary["blog"], level: BlogLevel) {
  return level === "simples" ? blog.levelSimple : blog.levelTechnical;
}
