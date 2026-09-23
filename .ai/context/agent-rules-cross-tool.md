# Regras de agente — sempre cross-tool

## Regra

Qualquer regra, política ou checklist para agentes neste repositório deve ser
**consumível por todos os LLMs** (Claude Code, Cursor, Copilot, Gemini, Codex, …)
— nunca só por uma ferramenta.

## Canónico

| Onde | Papel |
|------|--------|
| `AGENTS.md` | Índice / orientação (≤200 linhas) |
| `.ai/context/*.md` | Corpo das regras e overflow |
| `CLAUDE.md` | `@` imports que carregam `AGENTS.md` + `.ai/context/*` |

## Proibido

- Criar ou manter regras de agente **só** em `.cursor/rules/*.mdc` (Cursor-only).
- Duplicar o corpo canónico num `.mdc` "para o Cursor apanhar".
- Assumir que `alwaysApply: true` num MDC chega a Claude/Copilot/Gemini.

## Se encontrares `.cursor/rules/*.mdc`

1. Mover o conteúdo canónico para `.ai/context/<tema>.md` (se ainda não estiver).
2. Acrescentar `@.ai/context/<tema>.md` em `CLAUDE.md`.
3. Actualizar ponteiros em `AGENTS.md`.
4. Remover o `.mdc` (ou deixar de o usar como fonte de verdade).

## Origem org

A skill `/context-migration` (org-context) emite QA e overflow em `.ai/context/`
+ `@` em `CLAUDE.md` — **não** em `.cursor/rules/`.
