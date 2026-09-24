import type { Metadata } from "next";
import { PaginaFormulario } from "@/components/area-cliente/cabecalho-pagina";
import { NovoPedidoForm } from "@/components/area-cliente/novo-pedido-form";
import { getLocale, getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";
import { backendFetch } from "@/lib/area-cliente/backend";
import { daConta, requireToken } from "@/lib/area-cliente/session";
import type { Projeto } from "@/lib/area-cliente/types";

// Frames "Novo pedido" do grupo "v2 · A vez" do design-system.pen, na estrutura comum das
// páginas de formulário (`PaginaFormulario`: Voltar à margem da página, coluna centrada de
// 704 com o título, a introdução e a folha). Com `?project=<id>` de um projeto da conta, o
// pedido fica preso a esse projeto e o Voltar regressa ao projeto.

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);
  return {
    title: t.meta.novoPedidoTitle,
    robots: { index: false },
    ...pageMetadata(lang, "/area-cliente/pedidos/novo"),
  };
}

export default async function AreaClienteNovoPedido({
  searchParams,
}: PageProps<"/[lang]/area-cliente/pedidos/novo">) {
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);
  const token = await requireToken(lang);
  const projetos = await daConta(lang, backendFetch<Projeto[]>("/api/me/projects/", { token }));

  const { project: projectParam } = await searchParams;
  const projetoFixo =
    typeof projectParam === "string" ? projetos.find((p) => p.id === projectParam) : undefined;

  return (
    <PaginaFormulario
      voltarHref={projetoFixo ? `/area-cliente/projetos/${projetoFixo.id}` : "/area-cliente/pedidos"}
      voltar={t.back}
      titulo={t.novoPedido.heading}
    >
      <NovoPedidoForm
        projetos={projetos}
        lang={lang}
        t={t.novoPedido.form}
        criarProjeto={t.projetos.newProject}
        projetoFixo={projetoFixo}
      />
    </PaginaFormulario>
  );
}
