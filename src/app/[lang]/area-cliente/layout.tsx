import type { ReactNode } from "react";
import { SiteHrefProvider } from "@/components/area-cliente/site-href";
import { getLocale } from "@/i18n/dictionaries";
import { publicSiteHref } from "@/lib/site-url";

// Sem casca visual (cada grupo traz a sua: `AuthShell` nas páginas sem sessão, a barra de
// topo em (conta)). Só dá o endereço do site público aos Client Components, em especial a
// error.tsx deste segmento, onde a marca do cabeçalho tem de levar à landing.

export default async function AreaClienteLayout({ children }: { children: ReactNode }) {
  const lang = await getLocale();
  return <SiteHrefProvider value={publicSiteHref(lang)}>{children}</SiteHrefProvider>;
}
