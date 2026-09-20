// Gera src/app/tokens.css a partir do dump de tokens do design/design-system.pen.
// Fonte de verdade: os 252 tokens do .pen (GetVariables()). Este script não inventa
// valores — só resolve referências "$token" e escolhe o valor do tema dark (único tema
// em uso nesta fase, ver PRD §4.1 nota "Page Theme Lock").
import { writeFileSync, readFileSync } from "node:fs";

const raw = JSON.parse(readFileSync(new URL("./tokens.json", import.meta.url)));

function resolveValue(entry) {
  let v = entry.value;
  if (Array.isArray(v)) {
    const dark = v.find((x) => x.theme && x.theme.mode === "dark");
    v = dark ? dark.value : v[0].value;
  }
  if (typeof v === "string" && v.startsWith("$")) {
    const refKey = v.slice(1);
    const ref = raw[refKey];
    if (!ref) throw new Error(`Token em falta: ${refKey} (referenciado por ${v})`);
    return resolveValue(ref);
  }
  return v;
}

const resolved = {};
for (const [key, entry] of Object.entries(raw)) {
  resolved[key] = { type: entry.type, value: resolveValue(entry) };
}

const num = (k) => resolved[k].value;
const px = (k) => `${num(k)}px`;
const color = (k) => resolved[k].value;

// --- Cores semânticas (namespace --color-*, gera utilities bg-*/text-*/border-*) ---
const colorTokens = [
  "bg-base", "bg-surface", "bg-surface-raised", "bg-surface-sunken", "bg-surface-glass",
  "bg-surface-hover", "bg-surface-pressed", "bg-surface-selected", "bg-accent-subtle",
  "bg-overlay-scrim", "bg-disabled",
  "text-primary", "text-secondary", "text-tertiary", "text-disabled", "text-on-accent",
  "text-link", "text-accent",
  "border-subtle", "border-default", "border-strong", "border-interactive", "border-focus",
  "border-highlight",
  "accent-primary", "accent-primary-hover", "accent-primary-pressed", "accent-primary-subtle",
  "accent-gradient-from", "accent-gradient-to",
  "feedback-success-fg", "feedback-success-bg", "feedback-success-border", "feedback-success-solid", "feedback-success-on-solid",
  "feedback-warning-fg", "feedback-warning-bg", "feedback-warning-border", "feedback-warning-solid", "feedback-warning-on-solid",
  "feedback-error-fg", "feedback-error-bg", "feedback-error-border", "feedback-error-solid", "feedback-error-on-solid",
  "feedback-info-fg", "feedback-info-bg", "feedback-info-border", "feedback-info-solid", "feedback-info-on-solid",
  "shadow-ambient", "shadow-key", "shadow-inset-shade",
  "color-transparent",
];

// --- Espaçamento (namespace --spacing-*, gera p-*/m-*/gap-*/w-*/h-*) ---
const spacingTokens = [
  "space-3xs", "space-2xs", "space-xs", "space-sm", "space-md", "space-lg", "space-xl",
  "space-2xl", "space-3xl", "space-4xl", "space-5xl",
];

// --- Raio (namespace --radius-*, gera rounded-*) ---
const radiusTokens = ["radius-none", "radius-xs", "radius-sm", "radius-md", "radius-lg", "radius-2xl"];
// nota: radius-xl e radius-pill tratados à parte por colidirem com o default do Tailwind

// --- Tipografia: família (namespace --font-*, gera font-*) ---
// Referenciam as CSS vars que o next/font gera em layout.tsx (--font-sora/--font-inter/
// --font-jetbrains-mono) — não o nome da fonte em string, para o Next optimizar o carregamento.
const fontFamily = {
  heading: `var(--font-sora), ui-sans-serif, system-ui, sans-serif`,
  body: `var(--font-inter), ui-sans-serif, system-ui, sans-serif`,
  mono: `var(--font-jetbrains-mono), ui-monospace, monospace`,
};

// --- Tipografia: tamanho (namespace --text-*, com --text-*--line-height companion) ---
const textScale = [
  ["caption", "font-size-caption", "line-height-caption"],
  ["label", "font-size-label", "line-height-label"],
  ["body", "font-size-body", "line-height-body"],
  ["body-lg", "font-size-body-lg", "line-height-body"],
  ["title-sm", "font-size-title-sm", "line-height-title"],
  ["title", "font-size-title", "line-height-title"],
  ["headline", "font-size-headline", "line-height-headline"],
  ["display-sm", "font-size-display-sm", "line-height-display"],
  ["display", "font-size-display", "line-height-display"],
  ["display-lg", "font-size-display-lg", "line-height-display"],
];

// --- Sombras compostas (elevação = y/blur/spread + cor ambient/key) ---
function shadow(yKey, blurKey, spreadKey, colorVal) {
  return `0 ${px(yKey)} ${px(blurKey)} ${px(spreadKey)} ${colorVal}`;
}
const elevation = {
  1: shadow("elevation-1-y", "elevation-1-blur", "elevation-1-spread", color("shadow-ambient")),
  2: shadow("elevation-2-y", "elevation-2-blur", "elevation-2-spread", color("shadow-ambient")),
  3: shadow("elevation-3-y", "elevation-3-blur", "elevation-3-spread", color("shadow-key")),
  4: shadow("elevation-4-y", "elevation-4-blur", "elevation-4-spread", color("shadow-key")),
};

// --- Tokens de componente e primitivos: CSS vars simples (fora do @theme, sem geração de utility) ---
const componentTokens = Object.entries(resolved).filter(([k]) =>
  /^(button|input|card|modal|tabs|accordion|drawer|badge|avatar|icon|slider)-/.test(k) ||
  /^(tap-target|density|base-unit|baseline-grid|focus-ring-offset|border-width|blur-glass|letter-spacing|line-height|font-weight|bp-|grid-|p-zinc|p-emerald|p-amber|p-red|space-layout|space-component|elevation-\d+-(y|blur|spread))/.test(k) ||
  /-narrow$/.test(k)
);

let css = `/* GERADO por scripts/generate-tokens.mjs a partir de design/design-system.pen */
/* Fonte de verdade: o .pen. Não editar à mão — voltar a correr o script. */
/* Tema único: dark (Page Theme Lock — sem toggle nesta fase, ver PRD Fase 4.1). */

@theme {
`;

for (const k of colorTokens) {
  const name = k === "color-transparent" ? "transparent" : k;
  css += `  --color-${name}: ${color(k)};\n`;
}
css += `\n`;
for (const k of spacingTokens) css += `  --spacing-${k.replace(/^space-/, "")}: ${px(k)};\n`;
css += `\n`;
for (const k of radiusTokens) css += `  --radius-${k.replace(/^radius-/, "")}: ${num(k) === 0 ? "0px" : px(k)};\n`;
css += `  --radius-xl-ds: ${px("radius-xl")};\n`;
css += `  --radius-pill: ${px("radius-pill")};\n`;
css += `\n`;
for (const [name, val] of Object.entries(fontFamily)) css += `  --font-${name}: ${val};\n`;
css += `\n`;
for (const [name, sizeKey, lineHeightKey] of textScale) {
  css += `  --text-${name}: ${px(sizeKey)};\n`;
  css += `  --text-${name}--line-height: ${num(lineHeightKey)};\n`;
}
css += `\n`;
for (const [level, val] of Object.entries(elevation)) css += `  --shadow-elevation-${level}: ${val};\n`;

// Tokens numéricos que são contagens/multiplicadores/graus, não pixels
const unitless = new Set([
  "grid-columns-narrow", "grid-columns-mid", "grid-columns-wide",
  "line-height-display", "line-height-headline", "line-height-title",
  "line-height-body", "line-height-label", "line-height-caption",
  "font-weight-display", "font-weight-heading", "font-weight-body",
  "font-weight-body-strong", "font-weight-label",
]);
// Tokens numéricos que são sempre px, mesmo com casas decimais (ex. letter-spacing)
const alwaysPx = /^letter-spacing-/;

css += `}\n\n:root {\n  /* Tokens de componente e primitivos — usar via var(--nome), não geram utilities Tailwind */\n`;
for (const [k, v] of componentTokens) {
  let val;
  if (v.type !== "number") {
    val = v.value;
  } else if (unitless.has(k)) {
    val = `${v.value}`;
  } else if (alwaysPx.test(k) || Number.isInteger(v.value)) {
    val = `${v.value}px`;
  } else {
    val = `${v.value}px`; // qualquer outro número (ex. decimais restantes) também é px nesta lista
  }
  css += `  --${k}: ${val};\n`;
}
css += `  --token-version: "${resolved["token-version"].value}";\n`;
css += `}\n`;

writeFileSync(new URL("../src/app/tokens.css", import.meta.url), css);
console.log("tokens.css gerado:", Object.keys(resolved).length, "tokens processados");
