import { EsqueletoDefinicoes } from "@/components/area-cliente/esqueleto-pagina";
import { getDictionary } from "@/i18n/dictionaries";

export default async function Loading() {
  const { areaCliente: t } = await getDictionary();
  return (
    <EsqueletoDefinicoes
      voltar={t.back}
      titulo={t.definicoes.heading}
      introducao={t.definicoes.intro}
    />
  );
}
