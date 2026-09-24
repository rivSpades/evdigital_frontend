import { localizePath, type Locale } from "./config";

// Endereço final de uma ligação interna para a Área de Cliente (`/area-cliente/...`), sem
// passar por redirects do `src/proxy.ts`. Módulo puro (servidor e cliente): quem chama diz
// onde está (`AreaClienteHostProvider` no cliente, `process.env` no servidor).
//
// - Um só host (sem `CLIENTES_URL`, ex. previews): o caminho fica como está,
//   `/pt/area-cliente/pedidos`.
// - Dentro do subdomínio (`CLIENTES_URL`): a forma canónica não tem o segmento
//   `/area-cliente` (`/pt/pedidos`); com ele, cada clique custava um 307 antes da página.
// - No site público com `CLIENTES_URL`: o URL absoluto do subdomínio
//   (`https://clientes…/pt/entrar`), um só salto; com o caminho relativo eram três (308,
//   pedido RSC bloqueado por CORS no outro host e nova navegação completa).

export type AreaClienteHost = {
  /** `CLIENTES_URL` sem barra final, ou `null` se a Área de Cliente não tem host próprio. */
  clientesUrl: string | null;
  /** `SITE_URL` sem barra final (só usado com `clientesUrl`). */
  siteUrl: string | null;
  /**
   * `true` nas páginas da Área de Cliente (`[lang]/area-cliente/**`); com `clientesUrl`,
   * estão no subdomínio.
   */
  dentroDaArea: boolean;
};

const PREFIXO = "/area-cliente";

/**
 * Primeiros segmentos das páginas do site público (`[lang]/**` fora da Área de Cliente).
 * No subdomínio da Área de Cliente o proxy redirecciona-os para o site (`src/proxy.ts`
 * usa esta mesma lista). "projetos" não entra: no subdomínio é a lista de projetos da conta.
 */
export const SITE_PUBLICO_SEGMENTS = new Set([
  "servicos",
  "blog",
  "contacto",
  "sobre",
  "privacidade",
  "termos",
]);

function ePaginaPublica(href: string) {
  const primeiro = href.split(/[/?#]/)[1];
  return SITE_PUBLICO_SEGMENTS.has(primeiro);
}

function eAreaCliente(href: string) {
  return (
    href === PREFIXO ||
    href.startsWith(`${PREFIXO}/`) ||
    href.startsWith(`${PREFIXO}?`) ||
    href.startsWith(`${PREFIXO}#`)
  );
}

/** Prefixa o idioma e, se for uma ligação da Área de Cliente, resolve o host e o caminho. */
export function resolverHref(locale: Locale, href: string, host: AreaClienteHost): string {
  if (!host.clientesUrl) return localizePath(locale, href);
  if (!eAreaCliente(href)) {
    // Dentro do subdomínio, uma página pública (ex. "Fale connosco" → /contacto) sai já
    // com o host do site: relativa, o proxy respondia com um 307 para lá.
    if (host.dentroDaArea && host.siteUrl && href.startsWith("/") && ePaginaPublica(href)) {
      return `${host.siteUrl}${localizePath(locale, href)}`;
    }
    return localizePath(locale, href);
  }
  const resto = href.slice(PREFIXO.length);
  // `/area-cliente` sozinho: no subdomínio a raiz leva à lista de projetos.
  const limpo = resto.startsWith("/") ? resto : `/projetos${resto}`;
  const caminho = localizePath(locale, limpo);
  return host.dentroDaArea ? caminho : `${host.clientesUrl}${caminho}`;
}

/**
 * `CLIENTES_URL` e `SITE_URL` do ambiente (só os dois juntos, como em `src/proxy.ts`), para
 * o `AreaClienteHostProvider`. Só no servidor.
 */
export function hostDoAmbiente(dentroDaArea: boolean): AreaClienteHost {
  const clientesUrl = process.env.CLIENTES_URL?.replace(/\/$/, "");
  const siteUrl = process.env.SITE_URL?.replace(/\/$/, "");
  return clientesUrl && siteUrl
    ? { clientesUrl, siteUrl, dentroDaArea }
    : { clientesUrl: null, siteUrl: null, dentroDaArea };
}

/**
 * Caminho para um `redirect()`/`Location` emitido DENTRO da Área de Cliente (Server
 * Components e Route Handlers do subdomínio). Só no servidor.
 */
export function caminhoAreaCliente(locale: Locale, href: string): string {
  return resolverHref(locale, href, hostDoAmbiente(true));
}
