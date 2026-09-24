import type { ReactNode } from "react";
import { Topbar } from "@/components/area-cliente/topbar";
import { getLocale, getDictionary } from "@/i18n/dictionaries";
import { requireSession } from "@/lib/area-cliente/session";
import { publicSiteHref } from "@/lib/site-url";

// Casca persistente da Área de Cliente autenticada (projetos, pedidos, definições): a
// barra de topo vive aqui e não em cada página, para ficar sempre visível enquanto o
// conteúdo carrega (os loading.tsx só cobrem o <main> de cada página) e não voltar a
// renderizar a cada navegação. O grupo `(conta)` não entra no URL; entrar, confirmar e
// repor-palavra-passe ficam fora dele (não têm sessão).
//
// Sem sessão, `requireSession` redireciona para Entrar antes de qualquer conteúdo. A
// chamada a /api/me/ é partilhada com a página no mesmo pedido (`cache` do React).

export default async function ContaLayout({ children }: { children: ReactNode }) {
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);
  const { me } = await requireSession(lang);

  return (
    <div className="flex min-h-screen flex-col bg-bg-base">
      <Topbar me={me} lang={lang} t={t} siteHref={publicSiteHref(lang)} />
      {children}
    </div>
  );
}
