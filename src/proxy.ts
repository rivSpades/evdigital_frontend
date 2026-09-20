import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE, hasLocale, locales, matchLocale } from "@/i18n/config";

// Deteção automática de idioma. Ordem: prefixo já presente no URL > cookie da escolha
// manual (seletor de idioma) > cabeçalho Accept-Language do browser > português.
// Só redireciona pedidos sem prefixo; /api, /_next e ficheiros estáticos ficam de fora
// (ver `matcher`).

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasPrefix = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasPrefix) return NextResponse.next();

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

export const config = {
  // Exclui /api, /_next e qualquer caminho com extensão (favicon.ico, imagens, …).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
