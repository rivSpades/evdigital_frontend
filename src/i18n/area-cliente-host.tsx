"use client";

import { createContext, useCallback, useContext, type ReactNode } from "react";
import { resolverHref, type AreaClienteHost } from "./area-cliente-href";
import type { Locale } from "./config";

// Onde vive a Área de Cliente, para o `LocaleLink` e os `router.push` dos Client Components
// resolverem `/area-cliente/...` sem redirects (ver `area-cliente-href.ts`). O valor vem do
// servidor: `[lang]/layout.tsx` dá o `CLIENTES_URL` e `[lang]/area-cliente/layout.tsx` diz
// que a página é da Área de Cliente (no subdomínio, havendo um). Sem provider: um só host.

const AreaClienteHostContext = createContext<AreaClienteHost>({
  clientesUrl: null,
  siteUrl: null,
  dentroDaArea: false,
});

export function AreaClienteHostProvider({
  value,
  children,
}: {
  value: AreaClienteHost;
  children: ReactNode;
}) {
  return (
    <AreaClienteHostContext.Provider value={value}>{children}</AreaClienteHostContext.Provider>
  );
}

export function useAreaClienteHost() {
  return useContext(AreaClienteHostContext);
}

/** `(lang, "/area-cliente/pedidos")` → endereço final, para `router.push`. */
export function useHrefAreaCliente() {
  const host = useAreaClienteHost();
  return useCallback((lang: Locale, href: string) => resolverHref(lang, href, host), [host]);
}
