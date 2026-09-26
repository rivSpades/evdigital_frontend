"use client";

import { LigacaoBotao } from "@/components/ui/ligacao";
import { OPEN_SETTINGS } from "@/components/analytics/consent-analytics";

// «Cookies» no rodapé: volta a abrir o aviso de consentimento. Só aparece quando o GA4 está
// configurado (`ConsentAnalytics` marca <html data-analytics="on">).
export function CookieSettingsLink({ label }: { label: string }) {
  return (
    <LigacaoBotao
      variant="discreta-caption"
      className="min-w-11 [html:not([data-analytics])_&]:hidden"
      onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS))}
    >
      {label}
    </LigacaoBotao>
  );
}
