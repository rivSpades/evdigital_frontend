// Tokens do CV em PDF, lidos do mesmo dump do .pen que gera src/app/tokens.css
// (scripts/tokens.json; ver scripts/generate-tokens.mjs). O CV (frames «Consultores · CV»
// ZMWy6 e AoWpt) é desenhado no tema `light` do .pen (papel), por isso as cores resolvem-se
// nesse tema; o site usa o dark. Tamanhos de letra: tokens `print-*` (pontos, A4 = 595x842).
// Nada de cores escritas à mão: sem #000/#FFF (off-black e off-white do .pen).

import tokens from "../../../scripts/tokens.json";

type Entrada = { type: string; value: unknown };
const brutos = tokens as Record<string, Entrada>;

function resolver(nome: string, tema: "light" | "dark" = "light"): string | number {
  const entrada = brutos[nome];
  if (!entrada) throw new Error(`Token em falta: ${nome}`);
  let valor = entrada.value;
  if (Array.isArray(valor)) {
    const doTema = valor.find(
      (v: { theme?: { mode?: string } }) => v.theme?.mode === tema,
    ) as { value: unknown } | undefined;
    valor = (doTema ?? valor[0]).value;
  }
  if (typeof valor === "string" && valor.startsWith("$")) return resolver(valor.slice(1), tema);
  return valor as string | number;
}

const cor = (nome: string) => String(resolver(nome));
const numero = (nome: string) => Number(resolver(nome));

export const cv = {
  cor: {
    papel: cor("bg-surface"),
    textoPrimario: cor("text-primary"),
    textoSecundario: cor("text-secondary"),
    textoTerciario: cor("text-tertiary"),
    ligacao: cor("text-link"),
    accent: cor("accent-primary"),
    reguaForte: cor("border-default"),
    reguaSubtil: cor("border-subtle"),
    avatarFundo: cor("avatar-bg"),
    avatarTexto: cor("avatar-fg"),
  },
  tamanho: {
    nome: numero("print-name"),
    headline: numero("print-lead"),
    titulo: numero("print-title"),
    valor: numero("print-value"),
    corpo: numero("print-body"),
    rodape: numero("print-small"),
    legenda: numero("print-caption"),
  },
  entrelinha: {
    titulo: numero("line-height-title"),
    legenda: numero("line-height-caption"),
  },
  espacamento: {
    titulo: numero("letter-spacing-title"),
  },
  peso: {
    display: numero("font-weight-display"),
    titulo: numero("font-weight-heading"),
    label: numero("font-weight-label"),
    corpo: numero("font-weight-body"),
  },
} as const;
