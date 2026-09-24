import { hasLocale, defaultLocale, type Locale } from "@/i18n/config";
import { common as ptCommon } from "@/i18n/dictionaries/pt/common";
import { common as enCommon } from "@/i18n/dictionaries/en/common";
import { common as plCommon } from "@/i18n/dictionaries/pl/common";
import { erros as ptErros } from "@/i18n/dictionaries/pt/erros";
import { erros as enErros } from "@/i18n/dictionaries/en/erros";
import { erros as plErros } from "@/i18n/dictionaries/pl/erros";

// Textos das páginas de erro (error.tsx), que são Client Components e não podem usar
// `getDictionary()` (só Server Components). Importa só os dois namespaces pequenos de que
// precisam, nos três idiomas; o idioma vem do segmento [lang] (useParams).

const textos = {
  pt: { common: ptCommon, erros: ptErros },
  en: { common: enCommon, erros: enErros },
  pl: { common: plCommon, erros: plErros },
} satisfies Record<Locale, { common: typeof ptCommon; erros: typeof ptErros }>;

export function textosDeErro(lang: string | undefined) {
  return textos[hasLocale(lang) ? lang : defaultLocale];
}
