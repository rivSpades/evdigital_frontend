import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "./config";
import type { pt } from "./dictionaries/pt";

export type Dictionary = typeof pt;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  pt: () => import("./dictionaries/pt").then((m) => m.pt),
  en: () => import("./dictionaries/en").then((m) => m.en),
  pl: () => import("./dictionaries/pl").then((m) => m.pl),
};

/** Idioma do pedido actual (segmento `[lang]`). Só em Server Components. */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (!hasLocale(value)) notFound();
  return value;
}

export async function getDictionary(locale?: Locale): Promise<Dictionary> {
  return dictionaries[locale ?? (await getLocale())]();
}
