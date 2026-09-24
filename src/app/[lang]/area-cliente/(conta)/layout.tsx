import type { ReactNode } from "react";
import { Topbar } from "@/components/area-cliente/topbar";
import { getLocale, getDictionary, type Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { requireSession } from "@/lib/area-cliente/session";
import { publicSiteHref } from "@/lib/site-url";

// Casca persistente da Área de Cliente autenticada (projetos, pedidos, definições): a
// barra de topo vive aqui e não em cada página, para ficar sempre visível enquanto o
// conteúdo carrega (os loading.tsx só cobrem o <main> de cada página) e não voltar a
// renderizar a cada navegação. O grupo `(conta)` não entra no URL; entrar, confirmar e
// repor-palavra-passe ficam fora dele (não têm sessão).
//
// Sem sessão, `requireSession` redireciona para Entrar antes de qualquer conteúdo (a barra
// de topo fica fora de qualquer Suspense: o redirect sai antes do primeiro byte). A chamada
// a /api/me/ NÃO é esperada pelo layout: só a barra de topo espera por ela, e a página
// renderiza em paralelo (num carregamento completo o /api/me/ e os dados da página correm
// ao mesmo tempo, em vez de em série). Partilhada com a página no mesmo pedido (`cache`).

async function TopbarDaSessao({
  sessao,
  lang,
  t,
}: {
  sessao: ReturnType<typeof requireSession>;
  lang: Locale;
  t: Dictionary["areaCliente"];
}) {
  const { me } = await sessao;
  return <Topbar me={me} lang={lang} t={t} siteHref={publicSiteHref(lang)} />;
}

export default async function ContaLayout({ children }: { children: ReactNode }) {
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);
  const sessao = requireSession(lang);

  return (
    <div className="flex min-h-screen flex-col bg-bg-base">
      <TopbarDaSessao sessao={sessao} lang={lang} t={t} />
      {children}
    </div>
  );
}
