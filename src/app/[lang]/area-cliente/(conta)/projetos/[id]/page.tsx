import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/area-cliente/back-link";
import { tituloPaginaClasses } from "@/components/area-cliente/cabecalho-pagina";
import { FichaLateral } from "@/components/area-cliente/ficha-lateral";
import { PedidoLinha } from "@/components/area-cliente/pedido-linha";
import { ButtonLink } from "@/components/ui/button";
import { Metadado, Metadados } from "@/components/ui/metadado";
import { Registo } from "@/components/ui/registo-linha";
import { getLocale, getDictionary } from "@/i18n/dictionaries";
import { BackendError, backendFetch } from "@/lib/area-cliente/backend";
import { getProjeto, naoExiste } from "@/lib/area-cliente/dados";
import { formatarDataCurta, projetoStatusLabel, servicoLabel } from "@/lib/area-cliente/format";
import { getSessionToken, requireSession } from "@/lib/area-cliente/session";
import { cn } from "@/lib/cn";
import type { PedidoResumo, Projeto } from "@/lib/area-cliente/types";

// Detalhe do projeto: cada projeto tem aqui os seus próprios pedidos. O .pen não tem um
// frame deste ecrã; compõe-se com as mesmas peças e métricas do "Detalhe do pedido"
// (grupo "v2 · A vez"): topo com Voltar, título e metadados; ficha lateral de 278 em lg
// (depois do conteúdo abaixo de lg); títulos de secção em Sora ($font-size-body-lg em
// mobile, $font-size-title-sm a partir de md) e os pedidos em registo
// (ds/display/registo-linha "pedido"). A acção "Novo pedido" é secundária (contorno).

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/area-cliente/projetos/[id]">): Promise<Metadata> {
  const { id } = await params;
  const lang = await getLocale();
  const { areaCliente: t, erros } = await getDictionary(lang);
  // Projeto inexistente ou de outra conta: o separador diz o mesmo que o 404 mostrado.
  const token = await getSessionToken();
  const inexistente = token ? await naoExiste(getProjeto(token, id)) : false;
  return {
    title: inexistente ? erros.naoEncontrada.title : t.meta.projetoDetalheTitle,
    robots: { index: false },
  };
}

const tituloSecao =
  "font-heading text-body-lg leading-[var(--line-height-title)] font-semibold tracking-[var(--letter-spacing-title)] text-text-primary md:text-title-sm";

export default async function AreaClienteProjetoDetalhe({
  params,
}: PageProps<"/[lang]/area-cliente/projetos/[id]">) {
  const { id } = await params;
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);
  const { token } = await requireSession(lang);
  const data = (iso: string | null) => (iso ? formatarDataCurta(lang, iso) : t.projetoDetalhe.sheetPending);

  let projeto: Projeto;
  try {
    projeto = await getProjeto(token, id);
  } catch (erro) {
    if (erro instanceof BackendError && erro.status === 404) notFound();
    throw erro;
  }

  const pedidos = await backendFetch<PedidoResumo[]>(`/api/me/requests/?project=${id}`, { token });
  const servico = servicoLabel(t, projeto.service, projeto.service_label);

  return (
    <main className="flex flex-1 flex-col px-lg md:px-xl lg:px-2xl">
      <section className="flex flex-col pt-xl pb-lg">
        <BackLink href="/area-cliente/projetos" label={t.back} />
        <h1 className={cn("max-w-[620px] pt-sm", tituloPaginaClasses)}>{projeto.title}</h1>
        <Metadados>
          <Metadado
            rotulo={t.pedidos.statusLabel}
            valor={projetoStatusLabel(t, projeto.status, projeto.status_label)}
            valorTexto
          />
          <Metadado rotulo={t.projetoDetalhe.sheetService} valor={servico} valorTexto />
        </Metadados>
      </section>

      <div className="flex flex-col gap-3xl pt-2xl pb-3xl lg:flex-row lg:gap-lg">
        <div className="flex min-w-0 flex-1 flex-col">
          {projeto.latest_update ? (
            <section aria-labelledby="atualizacao-titulo" className="flex flex-col pb-3xl">
              <h2 id="atualizacao-titulo" className={cn("pb-md", tituloSecao)}>
                {t.projetoDetalhe.updateHeading}
              </h2>
              <p className="max-w-[760px] font-body text-body-lg text-text-primary">
                {projeto.latest_update}
              </p>
            </section>
          ) : null}

          <section aria-labelledby="pedidos-projeto-titulo" className="flex flex-col">
            <div className="flex flex-col gap-md pb-md md:flex-row md:items-end md:justify-between">
              <h2 id="pedidos-projeto-titulo" className={tituloSecao}>
                {t.projetoDetalhe.ticketsHeading}
              </h2>
              <ButtonLink
                href={`/area-cliente/pedidos/novo?project=${projeto.id}`}
                variant="outline"
                size="action"
                className="w-fit tracking-[var(--letter-spacing-label)]"
              >
                {t.projetoDetalhe.newTicket}
              </ButtonLink>
            </div>
            {pedidos.length === 0 ? (
              <p className="font-body text-body text-text-secondary">
                {t.projetoDetalhe.ticketsEmpty}
              </p>
            ) : (
              <Registo>
                {pedidos.map((pedido) => (
                  <PedidoLinha
                    key={pedido.id}
                    pedido={pedido}
                    lang={lang}
                    t={t}
                    tipo={t.tipoPedido[pedido.type]}
                  />
                ))}
              </Registo>
            )}
          </section>
        </div>

        <div className="lg:order-first">
          <FichaLateral
            titulo={t.projetoDetalhe.sheetHeading}
            factos={[
              { termo: t.projetoDetalhe.sheetService, valor: servico, texto: true },
              { termo: t.projetoDetalhe.sheetStarted, valor: data(projeto.started_at) },
              { termo: t.projetoDetalhe.sheetDelivered, valor: data(projeto.delivered_at) },
            ]}
          />
        </div>
      </div>
    </main>
  );
}
