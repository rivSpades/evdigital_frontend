import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type T = Dictionary["areaCliente"];

const INTL_LOCALE: Record<Locale, string> = { pt: "pt-PT", en: "en-GB", pl: "pl-PL" };

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
  return new Intl.DateTimeFormat(INTL_LOCALE[lang], options).format(new Date(iso));
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
