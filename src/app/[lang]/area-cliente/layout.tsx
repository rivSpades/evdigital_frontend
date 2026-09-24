import type { ReactNode } from "react";
import { SiteHrefProvider } from "@/components/area-cliente/site-href";
import { getLocale } from "@/i18n/dictionaries";
import { hostDoAmbiente } from "@/i18n/area-cliente-href";
import { AreaClienteHostProvider } from "@/i18n/area-cliente-host";
import { publicSiteHref } from "@/lib/site-url";

// Sem casca visual (cada grupo traz a sua: `AuthShell` nas páginas sem sessão, a barra de
// topo em (conta)). Só dá o endereço do site público aos Client Components, em especial a
// error.tsx deste segmento, onde a marca do cabeçalho tem de levar à landing.
//
// Com `CLIENTES_URL` estas páginas só existem no subdomínio (o proxy manda para lá qualquer
// `/area-cliente/*` do site público), por isso as ligações internas saem sem o segmento
// `/area-cliente` (`AreaClienteHostProvider`), a forma canónica que o proxy serve sem 307.

export default async function AreaClienteLayout({ children }: { children: ReactNode }) {
  const lang = await getLocale();
  return (
    <SiteHrefProvider value={publicSiteHref(lang)}>
      <AreaClienteHostProvider value={hostDoAmbiente(true)}>
        {children}
      </AreaClienteHostProvider>
    </SiteHrefProvider>
  );
}
