import { intlLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type T = Dictionary["areaCliente"];

// Os pedidos têm UUID; para o cliente citar por telefone/email usamos os 8 primeiros
// caracteres em maiúsculas (ex. #3F9A1C2B).
export function referenciaPedido(id: string): string {
  return `#${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export function formatarData(
  lang: Locale,
  iso: string | null,
  options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long", year: "numeric" },
): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat(intlLocale[lang], options).format(new Date(iso));
}

// Data curta como nos frames do .pen ("21 set 2026"): em pt-PT o `Intl` junta dia, mês
// abreviado e ano como "21/09/2026" (e o mês sai "09" nas partes), por isso o mês
// abreviado formata-se sozinho ("set.", sem o ponto) e junta-se ao dia e ao ano.
function partesCurtas(lang: Locale, date: Date): string {
  const locale = intlLocale[lang];
  const dia = new Intl.DateTimeFormat(locale, { day: "numeric" }).format(date);
  const mes = new Intl.DateTimeFormat(locale, { month: "short" }).format(date).replace(/\.$/, "");
  const ano = new Intl.DateTimeFormat(locale, { year: "numeric" }).format(date);
  return `${dia} ${mes} ${ano}`;
}

/** Data curta ("15 set 2026"), para as linhas de registo e os metadados. */
export function formatarDataCurta(lang: Locale, iso: string | null): string {
  return iso ? partesCurtas(lang, new Date(iso)) : "";
}

/** Data e hora curtas ("15 set 2026, 10:12"), para o histórico, a ficha e a conversa. */
export function formatarDataHora(lang: Locale, iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  const hora = new Intl.DateTimeFormat(intlLocale[lang], {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
  return `${partesCurtas(lang, date)}, ${hora}`;
}

// O backend devolve etiquetas em português; traduzimos por código e usamos o texto do
// backend só como recurso se surgir um código que o site ainda não conhece.
export function pedidoStatus(t: T, code: string, fallbackLabel: string, fallbackDescription = "") {
  const known = t.statusPedido[code];
  return {
    label: known?.label ?? fallbackLabel,
    description: known?.description ?? fallbackDescription,
  };
}

export function projetoStatusLabel(t: T, code: string, fallback: string): string {
  return t.statusProjeto[code] ?? fallback;
}

export function servicoLabel(t: T, code: string, fallback: string): string {
  return t.servicos[code] ?? fallback;
}
