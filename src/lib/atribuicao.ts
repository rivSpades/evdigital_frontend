// Canal de aquisição da lead (Google, redes sociais, referral, direto): captado uma vez
// por sessão o mais perto possível da entrada no site (layout raiz), não só em /contacto —
// se a pessoa chega pelo Google à home e só depois navega até ao formulário,
// `document.referrer` em /contacto já seria o próprio site. Guardado em sessionStorage
// (first-touch, nunca sobrescrito depois) e lido por enviar-lead.ts ao submeter a lead.
// Sem gate de consentimento: não usa scripts nem cookies de terceiros, só dados já
// visíveis no browser (URL e referrer) para a própria lead que a pessoa está a submeter.

const KEY = "ev-atribuicao";

export type Atribuicao = {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  referrerHost: string;
};

function hostDoReferrer(): string {
  try {
    return document.referrer ? new URL(document.referrer).hostname : "";
  } catch {
    return "";
  }
}

export function capturarAtribuicao(): void {
  try {
    if (sessionStorage.getItem(KEY)) return; // first-touch: já capturado nesta sessão
    const params = new URLSearchParams(window.location.search);
    const atribuicao: Atribuicao = {
      utmSource: params.get("utm_source") ?? "",
      utmMedium: params.get("utm_medium") ?? "",
      utmCampaign: params.get("utm_campaign") ?? "",
      referrerHost: hostDoReferrer(),
    };
    sessionStorage.setItem(KEY, JSON.stringify(atribuicao));
  } catch {
    // sessionStorage indisponível (modo privado, etc.): sem atribuição, nunca bloqueia a lead.
  }
}

export function obterAtribuicao(): Partial<Atribuicao> {
  try {
    const guardado = sessionStorage.getItem(KEY);
    return guardado ? JSON.parse(guardado) : {};
  } catch {
    return {};
  }
}
