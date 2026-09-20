# content/blog/

Pipeline de conteúdo (PRD.md §4.3 e §5): `~/brain` (privado) → rascunho `.mdx` aqui →
**revisão humana obrigatória** → build.

Este diretório está vazio de propósito — ainda não há posts revistos. Um post só entra
aqui com `reviewed: true` no frontmatter; `getAllBlogPosts()` (`src/lib/content.ts`)
filtra qualquer ficheiro com `reviewed: false` fora do build público. Nunca gerar e
publicar um post no mesmo passo.

Frontmatter obrigatório: `title`, `description`, `publishedAt`, `level` (`simples` |
`tecnico`), `tags`, `reviewed`. Ver `blogPostSchema` em `../../src/lib/content.ts`.
