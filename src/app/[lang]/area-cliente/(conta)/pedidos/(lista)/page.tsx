import type { Metadata } from "next";
import { CabecalhoLista } from "@/components/area-cliente/cabecalho-pagina";
import { PedidosLista } from "@/components/area-cliente/pedidos-lista";
import { ButtonLink } from "@/components/ui/button";
import { getLocale, getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";
import { backendFetch } from "@/lib/area-cliente/backend";
import { daConta, requireToken } from "@/lib/area-cliente/session";
import type { PedidoResumo } from "@/lib/area-cliente/types";

// "Os seus pedidos" (lista completa com filtros). O .pen não tem um frame deste ecrã:
// segue "Os seus projetos" (grupo "v2 · A vez"): o mesmo topo com a acção secundária, os
// pedidos em registo (ds/display/registo-linha "pedido") e, sem pedidos, o vazio com o
// título e a acção primária.

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);
  return {
    title: t.meta.pedidosTitle,
    robots: { index: false },
    ...pageMetadata(lang, "/area-cliente/pedidos"),
  };
}

export default async function AreaClientePedidos() {
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);
  // Um só pedido ao backend por navegação: a lista valida a sessão (401 → Entrar).
  const token = await requireToken(lang);
  const pedidos = await daConta(lang, backendFetch<PedidoResumo[]>("/api/me/requests/", { token }));

  return (
    <main className="flex flex-1 flex-col px-lg md:px-xl lg:px-2xl">
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

      {pedidos.length === 0 ? (
        <section className="flex flex-col items-start gap-lg pt-2xl pb-3xl">
          <h2 className="max-w-[704px] font-heading text-title-sm leading-[var(--line-height-title)] font-semibold tracking-[var(--letter-spacing-title)] text-text-primary md:text-title">
            {t.pedidos.empty}
          </h2>
          <ButtonLink
            href="/area-cliente/pedidos/novo"
            size="action"
            className="tracking-[var(--letter-spacing-label)]"
          >
            {t.pedidos.newRequest}
          </ButtonLink>
        </section>
      ) : (
        <PedidosLista pedidos={pedidos} lang={lang} t={t} />
      )}
    </main>
  );
}
