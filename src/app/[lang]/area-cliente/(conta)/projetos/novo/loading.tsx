import { PaginaFormulario } from "@/components/area-cliente/cabecalho-pagina";
import { EsqueletoFolha } from "@/components/area-cliente/esqueleto-pagina";
import { getDictionary } from "@/i18n/dictionaries";

// Novo projeto a carregar: a introdução já com o texto real e a folha em esqueleto, na
// mesma coluna da página. Tem loading próprio para não herdar o da lista de projetos.
export default async function Loading() {
  const { areaCliente: t } = await getDictionary();
  return (
    <PaginaFormulario
      busy
      voltarHref="/area-cliente/projetos"
      voltar={t.back}
      titulo={t.novoProjeto.heading}
    >
      <EsqueletoFolha campos={3} />
    </PaginaFormulario>
  );
}
