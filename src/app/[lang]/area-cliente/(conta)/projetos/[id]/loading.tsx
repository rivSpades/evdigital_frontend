import { EsqueletoDetalhe } from "@/components/area-cliente/esqueleto-pagina";
import { getDictionary } from "@/i18n/dictionaries";

// Detalhe do projeto a carregar (loading próprio: sem ele herdava o topo da lista).
export default async function Loading() {
  const { areaCliente: t } = await getDictionary();
  return <EsqueletoDetalhe voltarHref="/area-cliente/projetos" voltar={t.back} />;
}
