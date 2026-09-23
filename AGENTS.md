# EvDigital — site

Ler [`Context.md`](Context.md) primeiro — propósito, stack, estado das fases, comandos.
Este ficheiro cobre só as regras do próprio Next.js (gerado automaticamente, ver bloco
abaixo).

## Don't
- Não criar regras de agente só em `.cursor/rules/*.mdc` — ver
  [`.ai/context/agent-rules-cross-tool.md`](.ai/context/agent-rules-cross-tool.md).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
