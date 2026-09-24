import type { Metadata } from "next";
import { PaginaFormulario } from "@/components/area-cliente/cabecalho-pagina";
import { NovoProjetoForm } from "@/components/area-cliente/novo-projeto-form";
import { getLocale, getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";
import { requireSession } from "@/lib/area-cliente/session";

// Frames "Novo projeto" do grupo "v2 · A vez" do design-system.pen, na estrutura comum das
// páginas de formulário (`PaginaFormulario`: Voltar à margem da página, coluna centrada de
// 704 com o título, a introdução e a folha).

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);
  return {
    title: t.meta.novoProjetoTitle,
    robots: { index: false },
    ...pageMetadata(lang, "/area-cliente/projetos/novo"),
  };
}

export default async function AreaClienteNovoProjeto() {
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);
  await requireSession(lang);

  return (
    <PaginaFormulario
      voltarHref="/area-cliente/projetos"
      voltar={t.back}
      titulo={t.novoProjeto.heading}
    >
      <NovoProjetoForm lang={lang} t={t.novoProjeto.form} />
    </PaginaFormulario>
  );
}
