import { AuthShell } from "@/components/area-cliente/auth-shell";
import { Topbar } from "@/components/area-cliente/topbar";
import { NaoEncontrada } from "@/components/erros/nao-encontrada";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { backendFetch } from "@/lib/area-cliente/backend";
import { getSessionToken } from "@/lib/area-cliente/session";
import { publicSiteHref } from "@/lib/site-url";
import type { Perfil } from "@/lib/area-cliente/types";

// 404 da Área de Cliente, no idioma da rota (frames DWhwK / NEW4X do design-system.pen):
// o mesmo ecrã do site público, com os caminhos da Área de Cliente e a nota sobre ligações
// de outra conta. Serve, via area-cliente/[...rota], endereços desconhecidos; os
// `notFound()` de pedidos/[id] e projetos/[id] usam (conta)/not-found, dentro da casca
// com a barra de topo.
//
// A navegação é a da Área de Cliente, nunca a do site público: com sessão, a barra de topo
// da conta; sem sessão, o cabeçalho de autenticação ("Voltar ao site"). Sem redirecionar
// para Entrar: um 404 não é motivo para pedir a palavra-passe.

async function contaAtual(): Promise<Perfil | null> {
  const token = await getSessionToken();
  if (!token) return null;
  try {
    return await backendFetch<Perfil>("/api/me/", { token });
  } catch {
    return null;
  }
}

export default async function NaoEncontradaAreaCliente() {
  const lang = await getLocale();
  const { common, erros, areaCliente } = await getDictionary(lang);
  const t = erros.naoEncontrada;
  const me = await contaAtual();

  const conteudo = (
    <NaoEncontrada
      t={t}
      cta={common.cta}
      pathsTitle={t.areaClientePathsTitle}
      paths={[
        {
          href: "/area-cliente/projetos",
          name: areaCliente.projetos.heading,
          description: t.projetosDescription,
        },
        { href: "/area-cliente/pedidos", name: areaCliente.pedidos.heading },
      ]}
      note={t.areaClienteNote}
    />
  );

  if (me) {
    return (
      <div className="flex min-h-screen flex-col bg-bg-base">
        <Topbar me={me} lang={lang} t={areaCliente} siteHref={publicSiteHref(lang)} />
        {conteudo}
      </div>
    );
  }

  return (
    <AuthShell
      backToSite={areaCliente.entrar.backToSite}
      area={areaCliente.entrar.heading}
      siteHref={publicSiteHref(lang)}
      bare
    >
      {conteudo}
    </AuthShell>
  );
}
