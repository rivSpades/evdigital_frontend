import { CabecalhoLista } from "@/components/area-cliente/cabecalho-pagina";
import { EsqueletoLinhas } from "@/components/area-cliente/esqueleto-pagina";
import { ButtonLink } from "@/components/ui/button";
import { getDictionary } from "@/i18n/dictionaries";

// "Os seus projetos · a carregar" (RO1q8 / r2gWSL do design-system.pen): o topo e o título
// "Os seus pedidos" já com o texto real; três linhas de projetos e duas de pedidos (só
// título) em esqueleto.
export default async function Loading() {
  const { areaCliente: t } = await getDictionary();
  return (
    <main aria-busy="true" className="flex flex-1 flex-col px-lg md:px-xl lg:px-2xl">
      <CabecalhoLista
        titulo={t.projetos.heading}
        acao={
          <ButtonLink
            href="/area-cliente/projetos/novo"
            variant="outline"
            size="action"
            className="tracking-[var(--letter-spacing-label)]"
          >
            {t.projetos.newProject}
          </ButtonLink>
        }
      />
      <section className="py-2xl">
        <EsqueletoLinhas quantas={3} />
      </section>
      <section className="flex flex-col gap-md pt-xl pb-3xl">
        <h2 className="font-heading text-body-lg leading-[var(--line-height-title)] font-semibold tracking-[var(--letter-spacing-title)] text-text-primary md:text-title-sm">
          {t.projetos.requestsHeading}
        </h2>
        <EsqueletoLinhas quantas={2} simples />
      </section>
    </main>
  );
}
