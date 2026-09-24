import { PaginaFormulario } from "@/components/area-cliente/cabecalho-pagina";
import { EsqueletoFolha } from "@/components/area-cliente/esqueleto-pagina";
import { getDictionary } from "@/i18n/dictionaries";

// Novo pedido a carregar (a página lê os projetos da conta): a introdução já com o texto
// real e a folha em esqueleto, na mesma coluna da página. Tem loading próprio para não
// herdar o da lista de pedidos.
export default async function Loading() {
  const { areaCliente: t } = await getDictionary();
  return (
    <PaginaFormulario
      busy
      voltarHref="/area-cliente/pedidos"
      voltar={t.back}
      titulo={t.novoPedido.heading}
    >
      <EsqueletoFolha campos={5} />
    </PaginaFormulario>
  );
}
