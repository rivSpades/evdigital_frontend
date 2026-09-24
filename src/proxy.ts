import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE, hasLocale, matchLocale } from "@/i18n/config";

// Duas responsabilidades:
// 1. Deteção automática de idioma. Ordem: prefixo já presente no URL > cookie da escolha
//    manual (seletor de idioma) > cabeçalho Accept-Language do browser > português.
// 2. Separação por host: a Área de Cliente vive em `CLIENTES_URL` (ex. clientes.evdigital.eu)
//    e o resto do site em `SITE_URL`, servidos pela mesma app. Só ativa com `CLIENTES_URL`
//    definido (sem ele, ex. previews, tudo funciona num único host como antes).
//
// /_next e ficheiros estáticos ficam de fora (ver `matcher`); /api passa por aqui para
// que as rotas da Área de Cliente só respondam no subdomínio.

/**
 * Primeiros segmentos das páginas do site público (`[lang]/**` fora da Área de Cliente).
 * No subdomínio da Área de Cliente redirecionam para o site; qualquer outro segmento
 * desconhecido fica no subdomínio e mostra o 404 da Área de Cliente. "projetos" não
 * entra aqui: no subdomínio é a lista de projetos da conta.
 */
const SITE_PUBLICO_SEGMENTS = new Set([
  "servicos",
  "blog",
  "contacto",
  "sobre",
  "privacidade",
  "termos",
]);

const AREA_CLIENTE_API = "/api/area-cliente";

function hostConfig(request: NextRequest) {
  const clientesUrl = process.env.CLIENTES_URL?.replace(/\/$/, "");
  const siteUrl = process.env.SITE_URL?.replace(/\/$/, "");
  if (!clientesUrl || !siteUrl) return null;
  // Atrás de proxy reverso o `Host` chega reescrito; o original vem em X-Forwarded-Host.
  const host = (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "")
    .split(",")[0]
    .trim();
  return { clientesUrl, siteUrl, onClientes: host === new URL(clientesUrl).host };
}

function noindex(response: NextResponse) {
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

function redirectTo(origin: string, request: NextRequest, pathname: string, status = 307) {
  // `Location` montado à mão: `NextResponse.redirect` relativiza o URL quando o origin
  // coincide com o que o Next julga ser o do pedido (`localhost` em dev, host interno
  // atrás de proxy) e o redirect entre hosts ficava no mesmo host.
  return new NextResponse(null, {
    status,
    headers: { Location: `${origin}${pathname}${request.nextUrl.search}` },
  });
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hosts = hostConfig(request);

  if (pathname.startsWith("/api")) {
    if (!hosts) return NextResponse.next();
    const isAreaClienteApi =
      pathname === AREA_CLIENTE_API || pathname.startsWith(`${AREA_CLIENTE_API}/`);
    // O cookie de sessão só pode nascer no subdomínio; o inverso não tem razão de existir.
    if (isAreaClienteApi !== hosts.onClientes) return new NextResponse(null, { status: 404 });
    return hosts.onClientes ? noindex(NextResponse.next()) : NextResponse.next();
  }

  const [, first, ...restParts] = pathname.split("/");
  const rest = restParts.length ? `/${restParts.join("/")}` : "";

  if (!hasLocale(first)) {
    const saved = request.cookies.get(LOCALE_COOKIE)?.value;
    const locale = hasLocale(saved) ? saved : matchLocale(request.headers.get("accept-language"));

    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    const response = NextResponse.redirect(url);
    // A resposta depende do cabeçalho: sem isto uma cache intermédia serviria o mesmo
    // redirect a visitantes de idiomas diferentes.
    response.headers.set("Vary", "Accept-Language, Cookie");
    return response;
  }

  if (!hosts) return NextResponse.next();

  const inAreaCliente = rest === "/area-cliente" || rest.startsWith("/area-cliente/");

  if (!hosts.onClientes) {
    // Links antigos e do site público: /pt/area-cliente/x -> clientes.../pt/x
    if (!inAreaCliente) return NextResponse.next();
    const clean = rest.replace(/^\/area-cliente/, "");
    return redirectTo(hosts.clientesUrl, request, `/${first}${clean}`, 308);
  }

  // Daqui para baixo: pedido no subdomínio da Área de Cliente.
  if (rest === "") return noindex(redirectTo(hosts.clientesUrl, request, `/${first}/projetos`));

  if (inAreaCliente) {
    // Forma canónica no subdomínio não tem o segmento redundante /area-cliente.
    const clean = rest.replace(/^\/area-cliente/, "") || "/projetos";
    return noindex(redirectTo(hosts.clientesUrl, request, `/${first}${clean}`));
  }

  // Páginas públicas (serviços, blog, …) não existem aqui: mandar para o site.
  if (SITE_PUBLICO_SEGMENTS.has(rest.split("/")[1])) {
    return noindex(redirectTo(hosts.siteUrl, request, pathname));
  }

  // Rotas da Área de Cliente e endereços desconhecidos: reescrever para
  // `[lang]/area-cliente/**`. Os desconhecidos caem em area-cliente/[...rota] e mostram o
  // 404 da Área de Cliente (HTTP 404), no subdomínio, em vez de saltarem para o 404 do
  // site público.
  const url = request.nextUrl.clone();
  url.pathname = `/${first}/area-cliente${rest}`;
  return noindex(NextResponse.rewrite(url));
}

export const config = {
  // Exclui /_next e qualquer caminho com extensão (favicon.ico, imagens, …).
  matcher: ["/((?!_next|.*\\..*).*)"],
};
