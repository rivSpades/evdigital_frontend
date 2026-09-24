import { CabecalhoLista } from "@/components/area-cliente/cabecalho-pagina";
import { EsqueletoLinhas } from "@/components/area-cliente/esqueleto-pagina";
import { ButtonLink } from "@/components/ui/button";
import { EsqueletoBloco } from "@/components/ui/esqueleto";
import { getDictionary } from "@/i18n/dictionaries";

// "Os seus pedidos" a carregar: o topo com o texto real (como em "Os seus projetos · a
// carregar"), os filtros e as linhas de registo em esqueleto.
export default async function Loading() {
  const { areaCliente: t } = await getDictionary();
  return (
    <main aria-busy="true" className="flex flex-1 flex-col px-lg md:px-xl lg:px-2xl">
      <CabecalhoLista
        titulo={t.pedidos.heading}
        acao={
          <ButtonLink
            href="/area-cliente/pedidos/novo"
            variant="outline"
            size="action"
            className="tracking-[var(--letter-spacing-label)]"
          >
            {t.pedidos.newRequest}
          </ButtonLink>
        }
      />
      <section className="flex flex-col gap-lg pt-md pb-3xl">
        <div aria-hidden className="flex flex-col gap-md lg:flex-row lg:items-end">
          <EsqueletoBloco className="h-11 w-full rounded-[var(--input-radius)] lg:flex-1" />
          <EsqueletoBloco className="h-11 w-full rounded-[var(--input-radius)] lg:w-[440px]" />
        </div>
        <EsqueletoLinhas quantas={3} simples />
      </section>
    </main>
  );
}
