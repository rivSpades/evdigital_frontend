"use client";

import { createContext, useContext, type ReactNode } from "react";

// Início do site PÚBLICO (`publicSiteHref(lang)`, lido no servidor a partir de SITE_URL)
// para os Client Components da Área de Cliente que não o podem ler sozinhos: a página de
// erro (error.tsx tem de ser client) usa-o na marca do `AuthShell`. Sem provider fica "/".

const SiteHrefContext = createContext("/");

export function SiteHrefProvider({ value, children }: { value: string; children: ReactNode }) {
  return <SiteHrefContext.Provider value={value}>{children}</SiteHrefContext.Provider>;
}

export function useSiteHref() {
  return useContext(SiteHrefContext);
}
