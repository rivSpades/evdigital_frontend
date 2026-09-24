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
  do `.pen`. Ícones: `lucide-react` (traço 2px). Com o redesenho «A vez» (ver secção
  própria abaixo) `badge` e `tabs` foram removidos, e `card` e `link-arrow` ficaram sem
  nenhum import (órfãos, por limpar).
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
  - Versões mobile: resolvido no `.pen` «A vez» (grupos «Serviços» e «Serviço (ficha)»,
    frames 1280 e 375). A ficha passou a usar o design «A vez» em 2026-09-24.
- **Área de Cliente — AC1 implementado (2026-09-05).** `src/app/area-cliente/**`
  (entrar, confirmar, projetos, pedidos, pedidos/novo, pedidos/[id]) +
  `src/app/api/area-cliente/**` (proxy ao backend, mesmo padrão de `/api/contacto`) +
  `src/lib/area-cliente/**` (`backend.ts`, `session.ts` — cookie httpOnly `ac_token`,
  `types.ts`). Testado ponta a ponta contra o backend real: registo → confirmação de
  email → login → criar pedido → comentar → terminar sessão. Ver `PRD-servicos.md` §8
  para o que ficou deliberadamente fora (anexos, notas internas, emails de mudança de
  estado — tudo AC2). O `Nav` e o menu mobile já têm a entrada "Área de Cliente". A
  terceira via das fichas ("Já é cliente? Peça na sua área") foi retirada pelo dono em
  2026-09-24 e não volta (ver «Copy: o React manda»). As rotas actuais estão na secção
  «Área de Cliente (estado 2026-09-24)».
- **Área de Cliente em subdomínio (2026-09-23).** Mesma app Next, dois hosts:
  `SITE_URL` (site público) e `CLIENTES_URL` (ex. `clientes.evdigital.eu`). `src/proxy.ts`
  separa por host: em `clientes.*` faz rewrite `/pt/entrar` → `/pt/area-cliente/entrar`,
  redireciona páginas públicas (`servicos`, `blog`, `contacto`, `sobre`, `privacidade`,
  `termos`) para o site, reescreve qualquer outro caminho para `area-cliente/**` (os
  desconhecidos dão o 404 da Área de Cliente, HTTP 404, sem sair do subdomínio) e só deixa
  passar `/api/area-cliente/*`; no site
  público redireciona `/…/area-cliente/*` (308) para o subdomínio e dá 404 a
  `/api/area-cliente/*` (o cookie `ac_token` só nasce no subdomínio, host-only). Sem
  `CLIENTES_URL` a separação fica desligada. Dev: `www.localhost:3001` +
  `clientes.localhost:3001` — nunca `localhost` nu como `SITE_URL` (o Next relativiza o
  redirect e fica no mesmo host). Backend: `CLIENTES_BASE_URL` (link do email de confirmação).
  Versões mobile: desenhadas no `.pen` «A vez» (frames 375) e migradas em 2026-09-24.
- **Multilingue (2026-09-20) — feito**: pt (origem), en, pl. Rotas `src/app/[lang]/**`;
  `src/proxy.ts` redireciona `/x` para `/<lang>/x` por cookie `NEXT_LOCALE` > `Accept-Language`
  > pt. Textos em `src/i18n/dictionaries/{pt,en,pl}/<namespace>.ts` (pt define o tipo; falta
  de chave em en/pl falha o `tsc`); `getDictionary()`/`getLocale()` só em Server
  Components, `LocaleLink` em vez de `next/link`, `pageMetadata()` para hreflang. Conteúdo em
  `content/<lang>/{services,projects,blog}` (`npm run validate-content` exige as mesmas
  fichas nos 3 idiomas). Seletor de idioma só no rodapé (não na nav, por decisão).
  MB WAY/Multibanco/Payshop só em pt (`src/lib/payments.ts`).
  Resolvido em 2026-09-24: "Opcional" vem do dicionário (`optionalLabel` em `ui/input.tsx`,
  chave `areaCliente.definicoes.perfil.optional`); as mensagens de validação do Django
  (em pt) só se mostram em pt, em en/pl o formulário usa a sua frase do dicionário
  (`lang === "pt"` nos formulários da Área de Cliente e no `ContactoWizard`); os links
  dos emails de confirmação e de reposição levam o prefixo do idioma da página (`lang`).
  **Por fazer:** campo `language` no `Lead` do backend (o corpo dos emails continua em pt,
  tanto das leads como da conta); revisão jurídica das traduções de privacidade/termos.
- **Wizard de `/contacto` + CTA "Fale connosco" (2026-09-22) — feito**: CTA
  site-wide renomeada de "Marcar conversa gratuita" para "Fale connosco" (8 chaves ×
  pt/en/pl, ver `../design-guardrails.md` §6). `/contacto` deixou de ter formulário e
  embed do Cal.com lado a lado — passou a `ContactoWizard`
  (`src/components/contacto/contacto-wizard.tsx`) de 3 passos (descrever / reunião
  opcional / resumo), um único "Finalizar" que cria a lead e, se aplicável, a
  marcação no Cal.com no mesmo pedido (`src/app/api/contacto/route.ts` estendida +
  novo `src/app/api/contacto/slots/route.ts`, proxy para
  `backend/apps/leads/calcom.py`). `calendario-embed.tsx` foi removido.
  **Alinhado ao `.pen` (2026-09-24)**: grupo "Ecrã · Contacto" de "v2 · A vez" (frames
  1280 e 375 de cada passo e estado). Primitivos novos só do contacto em `components/ui`:
  `passo-assistente`, `escolha-dia`, `escolha-hora`, `linha-resumo`, `a-procurar`.
- **Fase 4.4b: feito (2026-09-24)**: Projetos, Blog e Sobre migrados no redesenho «A vez»
  (ver abaixo). O gate de validação com utilizador real (PRD Fase 3.4) continua por fazer.

## Redesenho «A vez» (2026-09-24)

Plano: [`../docs/plans/active/2026-09-23-redesenho-checklists-design.md`](../docs/plans/active/2026-09-23-redesenho-checklists-design.md).
Regras vivas: [`../design-guardrails.md`](../design-guardrails.md). Fonte visual: grupo
`v2 · A vez` do `.pen`. Folha neutra para formulários, bloco da vez sem fundo, registos
(linhas com régua) em vez de cartões, verde só em botão, foco e ligações.

Páginas no estilo «A vez» (todas em `src/app/[lang]/**`):

- **Site público:** Início (com scroll reveal, ver «Movimento»), Serviços e as fichas
  (`servicos/[slug]`), Projetos e ficha, Sobre, Blog e artigo, Privacidade e Termos
  (`components/legal/pagina-legal.tsx`), Contacto (`ContactoWizard`).
- **Erros:** `[lang]/not-found.tsx`, `[lang]/error.tsx` e `[lang]/[...rota]/page.tsx`
  (404 para qualquer rota desconhecida), com `components/erros/*`.
- **Área de Cliente:** ver a secção seguinte.

### Área de Cliente (estado 2026-09-24)

- **Autenticação** (fora de sessão, casca `components/area-cliente/auth-shell.tsx`, coluna
  única centrada na horizontal e encostada ao topo): `entrar` e `criar-conta` são DUAS
  rotas com um switch tipo tab no topo da coluna (`SeparadoresPaginas` em
  `ui/separadores.tsx`: `<nav>` com `aria-current="page"`, não `role=tab`);
  `recuperar-palavra-passe` («Esqueceu a palavra-passe?»: pedir a ligação, rota própria
  com a seta da barra fixa a voltar a `entrar`; `/entrar?repor=1` redirecciona para aqui);
  `repor-palavra-passe` (com `uid`+`token`, definir a nova);
  `confirmar` (email). O formulário de autenticação já não tem o convite «Fale connosco».
- **Conta** (route group `(conta)`, não entra no URL): `(conta)/layout.tsx` faz
  `requireSession` e mostra a `Topbar` nova uma só vez (layout persistente, não volta a
  renderizar a cada navegação). Páginas: `projetos`, `projetos/[id]`, `projetos/novo`,
  `pedidos`, `pedidos/[id]`, `pedidos/novo`, `definicoes`. Cada uma tem `loading.tsx`
  (esqueleto só do `<main>`, a topbar fica). `error.tsx` e `not-found.tsx` próprios, e
  `area-cliente/[...rota]` para 404. HTTP 404 real nos detalhes: `pedidos/[id]/layout.tsx`
  e `projetos/[id]/layout.tsx` verificam a existência antes do `loading.tsx` (com o
  esqueleto já em streaming o status ficava 200), e as listas vivem em `pedidos/(lista)` e
  `projetos/(lista)` para o `loading.tsx` delas não envolver o detalhe.
- **Definições:** separadores Perfil e Segurança (`ui/separadores.tsx`, `?tab=seguranca`).
  Segurança: conta Google sem palavra-passe (`has_usable_password === false`) vê
  «Definir palavra-passe» sem pedir a atual; zona de perigo com pedido de apagamento de
  conta num modal (`components/area-cliente/apagar-conta.tsx`, `ui/modal.tsx`,
  `ui/zona-perigo.tsx`).
- `src/proxy.ts` conhece os segmentos novos `criar-conta`, `repor-palavra-passe` e
  `recuperar-palavra-passe`.

### Navegação rápida (2026-09-24)

- **Ligações sem redirects numa só camada:** `LocaleLink` e `useHrefAreaCliente()` (router.push)
  resolvem `/area-cliente/...` com `src/i18n/area-cliente-href.ts` + `AreaClienteHostProvider`
  (montado em `[lang]/layout.tsx` e `[lang]/area-cliente/layout.tsx`, valores de
  `CLIENTES_URL`/`SITE_URL`). No subdomínio saem sem o segmento (`/pt/pedidos`); do site
  público saem absolutas (`https://clientes…/pt/entrar`); dentro da Área de Cliente as
  páginas públicas saem com o host do site. Sem `CLIENTES_URL` tudo fica relativo com
  `/area-cliente`. Os `redirect()` do servidor usam `caminhoAreaCliente()`. No código continua
  a escrever-se `/area-cliente/...`. `SITE_PUBLICO_SEGMENTS` é partilhado com `src/proxy.ts`.
  Páginas estáticas fixam `CLIENTES_URL`/`SITE_URL` no build: têm de existir no build.
- **Backend:** um só pedido de sessão por página. `(conta)/layout.tsx` não espera pelo
  /api/me/ (só a barra de topo espera), as páginas usam `requireToken` + `daConta` (401/403 →
  Entrar) em vez de /api/me/ antes dos dados, e `lerPerfil` (`cache`) é partilhado com
  `area-cliente/not-found.tsx`, que o Next renderiza em todas as páginas do segmento.
- **Cache do cliente:** `experimental.staleTimes` `{ dynamic: 30, static: 180 }`
  (`next.config.ts`). Toda a mutação da Área de Cliente chama `router.refresh()` (invalida a
  cache toda); os formulários de criar fazem `push` + `refresh`.
- **Prefetch por intenção:** dentro da Área de Cliente o `LocaleLink` passa a
  `prefetch={true}` ao passar o rato, tocar ou focar. Razão: com `loading.tsx`, o React segura
  a troca esqueleto → conteúdo pelo menos 300 ms, mesmo com o servidor a responder em 10 ms.
- `/contacto` (`?servico=`, `ContactoWizardUrl`) e `/blog` (`?nivel=`, `PorNivel`) leem o
  parâmetro no cliente e são estáticas (●).

### Route handlers da Área de Cliente (contratos novos ou alterados)

Formato de erro único em `src/lib/area-cliente/erros.ts`: `400 → { errors: { <campo>:
string[], geral?: string[] }, error? }` (tudo o que o formulário não sabe mostrar ao lado
de um campo cai em `geral`, para nenhum 400 ficar sem mensagem), `429 → { error:
"demasiados_pedidos" }`. Todos reenviam o IP do visitante ao Django em `X-Forwarded-For`
(`clientIpFrom` em `src/lib/area-cliente/backend.ts`), para o rate limit `auth` ser por
visitante e não global.

| Handler | Pedido | Respostas | Django |
|---|---|---|---|
| `POST /api/area-cliente/repor-palavra-passe` | `{ email, lang? }` | 202 `{status:"enviado"}` (sempre, exista ou não conta), 400, 429, 502 | `POST /api/auth/password-reset/` |
| `POST /api/area-cliente/repor-palavra-passe/confirmar` | `{ uid, token, new_password }` | 200 `{status:"reposta"}`, 400 (`ligacao_invalida` ou `new_password`), 429, 502 | `POST /api/auth/password-reset/confirm/` |
| `POST /api/area-cliente/apagar-conta` | sem body (cookie de sessão) | 202 `{status:"pedido_enviado"}`, 401 `sem_sessao`, 429, 502 `indisponivel` | `POST /api/me/delete-request/` |
| `POST /api/area-cliente/password` | `{ old_password?, new_password }` | `old_password` omitido em conta Google | `POST /api/auth/password/` |
| `POST /api/area-cliente/registar`, `/entrar` | passam a enviar `lang` | idem | link do email com prefixo de idioma |

### Primitivos novos em `src/components/ui/`

`a-procurar`, `artigo-linha`, `bloco-da-vez`, `cabecalho-passo`, `divisor-texto`,
`entrada-historico`, `erro-campo`, `escolha-dia`, `escolha-hora`, `escrito-por`,
`esqueleto`, `estado-texto`, `facto`, `fecho-pagina`, `folha`, `ligacao`,
`ligacao-externa`, `linha-resumo`, `linha-termo`, `linha-texto`, `mensagem`, `metadado`,
`modal`, `notice`, `opcao-radio`, `passo-assistente`, `pergunta-pedido`, `porta`,
`projeto-linha`, `registo-linha`, `regua-passo`, `reveal`, `secao-leitura`, `separadores`
(+ `separadores-ids.ts`), `servico-linha`, `vazio-tracejado`, `zona-perigo`.
Documentação: o comentário de cabeçalho de cada ficheiro diz que componente do `.pen`
espelha (nome `ds/...` e id do nó) e que tokens usa. Não há catálogo à parte; o
inventário de referência é a biblioteca do `.pen`.

### Copy: o React manda

Decisão do dono (2026-09-24, detalhe em `../design-guardrails.md` §8): o código só usa
frases que já existem em `src/i18n/dictionaries/**` (ou novas aprovadas pelo dono). Onde o
`.pen` diverge do React, manda o React, e o texto do `.pen` NÃO se corrige. Frases retiradas
de propósito, que não voltam por via do `.pen`, de `copy-*.md` ou de PRD: «Trinta minutos»,
«Já é cliente? Peça na sua área», os verbos «Conversamos / Propomos / Construímos /
Ficamos» como passos de «Como trabalhamos», «Aqui acompanha os seus projetos» e o convite
«Fale connosco» no formulário de autenticação. Rótulos do conceito («A sua vez», «A nossa
vez») não vão para código.

### Interacção: cursor e foco

- **Cursor:** uma regra global em `src/app/globals.css` (`@layer base`) põe `cursor:
  pointer` em tudo o que é clicável (botões, `a[href]`, `summary`, `label[for]`, roles
  button/tab/menuitem/option, etc.) e `not-allowed` no que está desactivado. Não repetir
  `cursor-pointer` componente a componente; um utilitário sobrepõe-na quando preciso.
- **Foco dos campos** (`ui/input.tsx`, `ui/select.tsx`): anel interior (borda
  `--input-border-focus` + `box-shadow` inset de 1px). O anel exterior global
  (`:focus-visible` em `globals.css`) é suprimido só nos campos com
  `focus-visible:outline-none!`; o `!` é obrigatório porque o `:focus-visible` global
  está fora de camadas e ganharia a um utilitário normal (`@layer utilities`).
- Autofill com tema escuro: sombra interior da cor do campo (`autofill:shadow-[...]`).

### Movimento (scroll reveal da Início)

- Tokens `--motion-*` em `src/app/tokens.css` (gerados de `scripts/tokens.json`):
  `duration-reveal` 480ms, `duration-fast` 240ms, `distance-desktop` 16px,
  `distance-mobile` 12px, `stagger-step` 70ms, `stagger-max-items` 4 (3 em mobile),
  `ruler-step` 120ms, `easing-out`, `view-threshold` 0.2.
- `src/components/ui/reveal.tsx`: `RevealScope` (o `<main>` da Início, com script de
  arranque inline) e `Reveal` (grupo). Regras visuais em `globals.css`. As regras R01 a
  R17 e o storyboard estão nos frames «Design System · Movimento» e «Movimento ·
  Storyboard da Início» do `.pen`. Resumo: só `opacity` e `translateY`; nada horizontal;
  dispara uma vez; um só `IntersectionObserver` partilhado, sem listeners de scroll; o que
  já passou (âncora, recarregar a meio, scroll rápido) aparece sem animação; foco de
  teclado revela logo; `will-change` só durante a entrada; título do hero nunca se
  esconde (LCP), subtítulo e acção só com fade curto por CSS (`.reveal-load`).
- Sem JavaScript, sem `IntersectionObserver` ou com `prefers-reduced-motion`: o atributo
  `data-reveal-on` nunca é posto e tudo fica visível. Se o Reveal não arrancar em 3 s, o
  script desliga-o.
- Testes: cenários Q01 a Q13 do frame «Movimento» no `.pen`. Não testado: iOS Safari real,
  `prefers-reduced-motion` real do sistema (só por emulação), JavaScript desligado e
  leitor de ecrã.

### Decisões do dono de 2026-09-24 (não desfazer sem falar com ele)

1. O React manda na copy; o `.pen` não se corrige em texto (acima).
2. Entrar e Criar conta são duas rotas com switch tipo tab no topo da coluna, não um
   painel que troca no mesmo sítio.
3. Formulários de autenticação centrados na horizontal e encostados ao topo.
4. Toda a navegação entre páginas vive no topo; «Voltar» é a primeira linha depois da
   barra de topo.
5. Blocos de conteúdo ou de fecho sem cartão com contorno; nunca borda lateral de cor nem
   marcador de cor antes do texto.
6. Um só tema (dark), sem toggle.

### Dívida técnica conhecida (redesenho)

- Autofill do browser com tema escuro implementado mas não testado em browser real.
- O `.pen` tem frases e estados que o React não tem (fica assim por decisão; o código não
  os copia).
- `.pen`: réguas horizontais de lista por rever; componentes antigos do DS ainda com
  cartões, raios arredondados e verde residual; nav desktop do master com «Ev» a verde;
  sem frame tablet 768; alguns estados sem frame próprio.
- Tema claro inexistente (tokens e `.pen`).
- `ui/card.tsx` e `ui/link-arrow.tsx` sem nenhum import.
- 74 `max-w-[...]` arbitrários em `src/**/*.tsx` (tokens de largura máxima por criar).
- Aviso de lint em `components/area-cliente/entrar-form.tsx` (`window.location.assign`).
- Política de privacidade: ver `../docs/plans/tech-debt-tracker.md`.

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
npm run lint              # eslint
npx tsc --noEmit          # tipos
npm run validate-content  # valida frontmatter de content/** contra os schemas Zod
npm run generate-tokens   # regenera src/app/tokens.css a partir de scripts/tokens.json
```

## Regras do projecto (precedência sobre guias genéricos do brain)

- Design é sempre `.pen` → código, nunca o inverso (ver `~/brain/skills/pen/SKILL.md`).
- Guardrails anti-slop (`../design-guardrails.md`) aplicam-se a qualquer ecrã migrado.
- Zero travessão em copy visível ao utilizador (título, botão, label, mensagem de erro).
- Copy: o React manda (secção «Copy: o React manda» acima); o `.pen` é a fonte visual,
  não a fonte de texto.
- Commits só quando o utilizador pedir explicitamente.
