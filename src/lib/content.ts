import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import type { Locale } from "@/i18n/config";

// Camada de conteúdo — PRD.md §7. O build falha se um ficheiro não cumprir o schema:
// preferimos um erro de build a uma ficha incompleta em produção (objetivo O4 do PRD).

const CONTENT_DIR = path.join(process.cwd(), "content");

const testimonialSchema = z.object({
  quote: z.string().max(400, "Testemunho deve caber em ~3 linhas (guardrail §7)"),
  name: z.string(),
  role: z.string(),
  company: z.string().optional(),
});

// Painel "Ficha rápida" da listagem e painel "Stack usada" da ficha (frames S0F6k /
// kNnUB / ArroA / oQ6zT do .pen): rótulos e valores que o desenho mostra e que não se
// deduzem do resto do frontmatter. Opcionais — sem eles as páginas caem no `stack` plano.
const quickFactSchema = z.object({
  label: z.string(),
  value: z.string(),
});

const stackGroupSchema = z.object({
  label: z.string(),
  items: z.array(z.string()).min(1),
});

export const projectSchema = z.object({
  title: z.string(),
  summary: z.string(),
  description: z.string(),
  stack: z.array(z.string()).min(1),
  stackGroups: z.array(stackGroupSchema).default([]),
  quickFacts: z.array(quickFactSchema).default([]),
  url: z.string().url().optional(),
  testimonials: z.array(testimonialSchema).default([]),
  cover: z.string().optional(),
  audience: z.array(z.enum(["A", "B"])).min(1),
});
export type ProjectFrontmatter = z.infer<typeof projectSchema>;

export const blogPostSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishedAt: z.coerce.date(),
  level: z.enum(["simples", "tecnico"]),
  tags: z.array(z.string()).default([]),
  sourceContext: z.string().optional(),
  reviewed: z.boolean(),
});
export type BlogPostFrontmatter = z.infer<typeof blogPostSchema>;

// Catálogo de 7 produtos — PRD-servicos.md §2 e §7.1. Cada serviço tem página própria
// em /servicos/[slug]; este schema é o contrato entre o conteúdo e o template de 12
// blocos (PRD-servicos.md §4). `family` decide o bloco do índice (A = "para quem está a
// começar", B = "para quem quer ir mais longe"); `audience` existe à parte de `family`
// porque o PRD previa poderem divergir um dia, mas hoje são sempre iguais.

const serviceVariantRowSchema = z.object({
  cells: z.array(z.string()).min(2),
  recommended: z.boolean().default(false),
});

const serviceTableSchema = z.object({
  columns: z.array(z.string()).min(2),
  rows: z.array(serviceVariantRowSchema).min(1),
});

// Bloco 3 (Opções) e bloco 7 (específico do produto) do template — PRD-servicos.md §4.
// Cada produto tem uma forma diferente de conteúdo aqui (tabela de opções, lista de
// exemplos, casos de uso), por isso o schema é deliberadamente genérico em vez de um
// campo por produto.
const serviceExtraSectionSchema = z.object({
  title: z.string(),
  intro: z.array(z.string()).default([]),
  items: z.array(z.string()).default([]),
  // true só quando `items` é um processo sequencial (ex. os 5 passos da IA à medida);
  // false (por defeito) para listas simples de exemplos ou explicações, que se leem
  // com marcador, não com número de ordem.
  ordered: z.boolean().default(false),
  table: serviceTableSchema.optional(),
  note: z.string().optional(),
});

const serviceFaqSchema = z.object({
  q: z.string(),
  a: z.string(),
});

const serviceSeoSchema = z.object({
  title: z.string().max(60, "Title de SEO deve caber em ~60 caracteres"),
  description: z.string().max(155, "Description de SEO deve caber em ~155 caracteres"),
  keywords: z.array(z.string()).min(1),
});

export const serviceSchema = z.object({
  title: z.string(),
  family: z.enum(["A", "B"]),
  audience: z.enum(["A", "B"]),
  order: z.number(),
  outcome: z.string(),
  summary: z.string(),
  seo: serviceSeoSchema,
  extraSections: z.array(serviceExtraSectionSchema).default([]),
  showPayments: z.boolean().default(false),
  includes: z.array(z.string()).min(1),
  // Opcionais: um serviço sem estas duas listas não mostra os cartões "O que ganha" e
  // "O que isto exige" (ex.: site-profissional).
  benefits: z.array(z.string()).default([]),
  requires: z.array(z.string()).default([]),
  // Bloco 8 (Como funciona): true reutiliza os 4 passos partilhados
  // (components/servicos/como-funciona.tsx); false só na IA à medida, que tem o seu
  // próprio processo de 5 passos modelado como mais um extraSections.
  genericProcess: z.boolean().default(true),
  faq: z.array(serviceFaqSchema).min(3),
  related: z.array(z.string()).min(1),
  projects: z.array(z.string()).default([]),
  testimonials: z.array(testimonialSchema).default([]),
});
export type ServiceFrontmatter = z.infer<typeof serviceSchema>;

// Conteúdo por idioma: content/<lang>/<colecção>/<slug>.md. O slug é o mesmo em todos os
// idiomas (é o nome do ficheiro) — só o texto muda. `npm run validate-content` confirma
// que nenhum idioma fica com fichas em falta.
function readCollection<T>(
  lang: Locale,
  subdir: string,
  schema: z.ZodType<T>,
  extensions: string[] = [".md", ".mdx"],
) {
  const dir = path.join(CONTENT_DIR, lang, subdir);
  let files: string[];
  try {
    files = readdirSync(dir).filter(
      (f) => extensions.includes(path.extname(f)) && !/^readme/i.test(f),
    );
  } catch {
    return [] as { slug: string; frontmatter: T; content: string }[];
  }

  return files.map((file) => {
    const slug = file.replace(/\.(md|mdx)$/, "");
    const raw = readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);
    const result = schema.safeParse(data);
    if (!result.success) {
      throw new Error(
        `content/${lang}/${subdir}/${file}: frontmatter inválido.\n${result.error.issues
          .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
          .join("\n")}`,
      );
    }
    return { slug, frontmatter: result.data, content };
  });
}

export function getAllProjects(lang: Locale) {
  return readCollection(lang, "projects", projectSchema);
}

export function getProjectBySlug(lang: Locale, slug: string) {
  return getAllProjects(lang).find((p) => p.slug === slug) ?? null;
}

/**
 * Gate de privacidade (PRD §4.3 e §5): um post com `reviewed: false` nunca chega ao
 * build público. O brain nunca é lido em runtime — a curadoria acontece antes, ao
 * escrever o ficheiro em content/blog/.
 */
export function getAllBlogPosts(lang: Locale, { includeUnreviewed = false } = {}) {
  const posts = readCollection(lang, "blog", blogPostSchema);
  const published = posts.filter((p) => includeUnreviewed || p.frontmatter.reviewed);
  return published.sort(
    (a, b) => b.frontmatter.publishedAt.getTime() - a.frontmatter.publishedAt.getTime(),
  );
}

export function getBlogPostBySlug(lang: Locale, slug: string) {
  return getAllBlogPosts(lang).find((p) => p.slug === slug) ?? null;
}

export function getAllServices(lang: Locale) {
  const services = readCollection(lang, "services", serviceSchema).sort(
    (a, b) => a.frontmatter.order - b.frontmatter.order,
  );

  // Validação cruzada (PRD-servicos.md §7.1): `related` só pode apontar para slugs que
  // existem. Falha o build em vez de publicar uma ligação partida.
  const slugs = new Set(services.map((s) => s.slug));
  for (const service of services) {
    for (const relatedSlug of service.frontmatter.related) {
      if (!slugs.has(relatedSlug)) {
        throw new Error(
          `content/${lang}/services/${service.slug}.md: "related" aponta para o slug inexistente "${relatedSlug}".`,
        );
      }
    }
  }

  return services;
}

export function getServiceBySlug(lang: Locale, slug: string) {
  return getAllServices(lang).find((s) => s.slug === slug) ?? null;
}
