# EvDigital — site (Context.md)

> Fonte de verdade deste subprojecto. O repo pai (`../`) guarda os documentos de
> workspace: [`../brainstorm.md`](../brainstorm.md), [`../PRD.md`](../PRD.md),
> [`../copy-draft.md`](../copy-draft.md), [`../design-guardrails.md`](../design-guardrails.md)
> e o design system em [`../design/design-system.pen`](../design/design-system.pen).

## Propósito

Site público da EvDigital — landing page + serviços + portfólio + blog + contacto,
servindo dois públicos com dois níveis de linguagem (ver `../PRD.md` §3 e §5).

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS v4 (config CSS-first via `@theme`, sem
`tailwind.config.js`) + Vercel.

## Estado (ver `../PRD.md` para o plano completo)

- **Fase 4.1 — feito**: scaffold + tokens do `.pen` traduzidos para `src/app/tokens.css`
  (gerado por `scripts/generate-tokens.mjs` a partir de `scripts/tokens.json` — um dump
  manual de `GetVariables()` do `.pen`; re-exportar esse ficheiro sempre que os tokens
  mudarem no `.pen` e correr `npm run generate-tokens`).
- **Fase 4.3 — feito**: camada de conteúdo (`src/lib/content.ts`) com schemas Zod para
  projetos, serviços e blog. Conteúdo semeado: ficha do EvPlanner (`content/projects/`).
  `content/blog/` fica vazio de propósito — gate de privacidade, ver README nesse
  diretório e PRD §4.3/§5.
- **Fase 4.2 — feito para a Home**: primitivas instaladas em `src/components/ui/`
  (`button`, `badge`, `card`, `accordion`, `link-arrow`) e chrome partilhado em
  `src/components/layout/` (`nav`, `footer`), todos derivados dos componentes reusáveis
  do `.pen`. Ícones: `lucide-react` (traço 2px).
- **Fase 4.4a — feito**: Home migrada dos frames `wzYyU` (1440) e `EZ3bZ` (390) para
  `src/app/page.tsx` + `src/components/home/*` (nove secções, uma por ficheiro). Mobile
  first; `md:`(768) e `lg:`(1024) correspondem a `$bp-mid`/`$bp-wide` do `.pen`.
  Server Components por defeito: só `nav.tsx` e `accordion.tsx` são `"use client"`.
- **Catálogo de Serviços (2026-09-05) — feito**: `/servicos` reestruturada de 12
  serviços numa página para 7 produtos com página própria — ver
  [`../PRD-servicos.md`](../PRD-servicos.md) e [`../copy-servicos.md`](../copy-servicos.md).
  - `content/services/*.md`: 7 ficheiros (era 12), schema em `serviceSchema`
    (`src/lib/content.ts`) com `family`, `extraSections`, `includes`, `benefits`,
    `requires`, `faq`, `related`, `seo`. Build falha se `related` apontar para slug
    inexistente.
  - `src/app/servicos/[slug]/page.tsx`: template de 12 blocos, um único ficheiro para
    os 7 produtos — migrado do frame `YSyrf` do `.pen` (ficha da Loja online).
  - `src/lib/payments.ts`: dados dos 8 meios de pagamento (só a ficha da Loja online).
    O PRD previa `content/data/payments.yaml`; sem parser YAML no projecto, ficou como
    módulo TS tipado — mesma informação, sem dependência nova.
  - `ContactoWizard` (`src/components/contacto/contacto-wizard.tsx`) e `/contacto`
    aceitam `?servico=<slug>` e enviam `service` na lead (backend: `Lead.service`,
    `backend/apps/leads/migrations/0002_lead_service.py`).
  - **Por fazer**: versões mobile dos 7 ecrãs do `.pen` (o código já é responsive por
    Tailwind; o `.pen` mobile das fichas ainda não foi desenhado — ver
    `PRD-servicos.md` §10).
- **Área de Cliente — AC1 implementado (2026-09-05).** `src/app/area-cliente/**`
  (entrar, confirmar, projetos, pedidos, pedidos/novo, pedidos/[id]) +
  `src/app/api/area-cliente/**` (proxy ao backend, mesmo padrão de `/api/contacto`) +
  `src/lib/area-cliente/**` (`backend.ts`, `session.ts` — cookie httpOnly `ac_token`,
  `types.ts`). Testado ponta a ponta contra o backend real: registo → confirmação de
  email → login → criar pedido → comentar → terminar sessão. Ver `PRD-servicos.md` §8
  para o que ficou deliberadamente fora (anexos, notas internas, emails de mudança de
  estado — tudo AC2). O `Nav` e o menu mobile já têm a entrada "Área de Cliente", e as
  fichas de produto já têm a terceira via "Já é cliente? Peça na sua área".
  **Por fazer:** versões mobile das 4 páginas (existem, mas não foram desenhadas no
  `.pen` nem verificadas viewport a viewport).
- **Multilingue (2026-09-20) — feito**: pt (origem), en, pl. Rotas `src/app/[lang]/**`;
  `src/proxy.ts` redireciona `/x` para `/<lang>/x` por cookie `NEXT_LOCALE` > `Accept-Language`
  > pt. Textos em `src/i18n/dictionaries/{pt,en,pl}/<namespace>.ts` (pt define o tipo; falta
  de chave em en/pl falha o `tsc`); `getDictionary()`/`getLocale()` só em Server
  Components, `LocaleLink` em vez de `next/link`, `pageMetadata()` para hreflang. Conteúdo em
  `content/<lang>/{services,projects,blog}` (`npm run validate-content` exige as mesmas
  fichas nos 3 idiomas). Seletor de idioma só no rodapé (não na nav, por decisão).
  MB WAY/Multibanco/Payshop só em pt (`src/lib/payments.ts`).
  **Por fazer:** campo `language` no `Lead` do backend (emails em pt); erros de validação do
  Django chegam em pt; texto "Opcional" fixo em `ui/input.tsx`; revisão jurídica das
  traduções de privacidade/termos.
- **Wizard de `/contacto` + CTA "Fale connosco" (2026-09-22) — feito**: CTA
  site-wide renomeada de "Marcar conversa gratuita" para "Fale connosco" (8 chaves ×
  pt/en/pl, ver `../design-guardrails.md` §6). `/contacto` deixou de ter formulário e
  embed do Cal.com lado a lado — passou a `ContactoWizard`
  (`src/components/contacto/contacto-wizard.tsx`) de 3 passos (descrever / reunião
  opcional / resumo), um único "Finalizar" que cria a lead e, se aplicável, a
  marcação no Cal.com no mesmo pedido (`src/app/api/contacto/route.ts` estendida +
  novo `src/app/api/contacto/slots/route.ts`, proxy para
  `backend/apps/leads/calcom.py`). `calendario-embed.tsx` foi removido.
  **Por fazer**: os 3 ecrãs do wizard não foram desenhados no `.pen` antes do código
  — excepção pontual (decisão do Ricardo, 2026-09-22), tokens e componentes
  reutilizados de `components/ui`, sem primitivo novo. Passar pelo `.pen` fica como
  dívida de design, tal como a versão mobile das fichas de serviço acima.
- **Fase 4.4b — pendente**: restantes páginas (Projetos, Blog, Sobre) à espera do gate
  de validação com utilizador real (PRD Fase 3.4).

## Tema

Um só tema: **dark** (`data-theme="dark"` no `<html>`, ver `layout.tsx`). Sem toggle
light/dark nesta fase — "Page Theme Lock" das guardrails anti-slop.

## Fontes

Carregadas via `next/font/google` em `layout.tsx` (nunca `<link>`): Sora (`--font-sora`,
usado por `--font-heading`), Inter (`--font-inter`, usado por `--font-body`), JetBrains
Mono (`--font-jetbrains-mono`, usado por `--font-mono`).

## Comandos

```bash
npm run dev              # servidor de desenvolvimento
npm run build             # build de produção
npm run validate-content  # valida frontmatter de content/** contra os schemas Zod
npm run generate-tokens   # regenera src/app/tokens.css a partir de scripts/tokens.json
```

## Regras do projecto (precedência sobre guias genéricos do brain)

- Design é sempre `.pen` → código, nunca o inverso (ver `~/brain/skills/pen/SKILL.md`).
- Guardrails anti-slop (`../design-guardrails.md`) aplicam-se a qualquer ecrã migrado.
- Zero travessão em copy visível ao utilizador (título, botão, label, mensagem de erro).
- Commits só quando o utilizador pedir explicitamente.
