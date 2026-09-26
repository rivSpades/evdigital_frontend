// Eventos do GA4. `gtag` só existe depois de o visitante aceitar o aviso de cookies
// (consent-analytics.tsx), por isso sem consentimento isto não faz nada. Nunca enviar dados
// pessoais (nome, email, telefone, mensagem) nos parâmetros.
type Gtag = (
  command: "event",
  name: string,
  params?: Record<string, unknown>,
) => void;

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", name, params);
}
