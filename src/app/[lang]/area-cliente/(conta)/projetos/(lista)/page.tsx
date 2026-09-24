import type { Metadata } from "next";
import { CabecalhoLista } from "@/components/area-cliente/cabecalho-pagina";
import { PedidoLinha } from "@/components/area-cliente/pedido-linha";
import { BlocoDaVez } from "@/components/ui/bloco-da-vez";
import { ButtonLink } from "@/components/ui/button";
import { Ligacao } from "@/components/ui/ligacao";
import { Registo, RegistoLinha } from "@/components/ui/registo-linha";
import { getLocale, getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";
import { backendFetch } from "@/lib/area-cliente/backend";
import {
  formatarDataCurta,
  projetoStatusLabel,
  referenciaPedido,
  servicoLabel,
} from "@/lib/area-cliente/format";
import { requireSession } from "@/lib/area-cliente/session";
import { pedidoEsperaCliente, projetoTom } from "@/lib/area-cliente/tons";
import type { PedidoResumo, Projeto } from "@/lib/area-cliente/types";

// Frames "Os seus projetos" (com dados lX537/AVUyc, vazio Eq087/dfLfu) do grupo "v2 · A
// vez" do design-system.pen:
// - Topo: título e a acção secundária "Criar novo projeto" (contorno, 56).
// - Bloco da vez (lado): só quando há um pedido à espera de resposta do cliente, com a
//   referência e a data no facto, a descrição do estado como frase, o título do pedido e
//   "Responder". O rótulo "A sua vez" e a frase "Um pedido está à espera da sua resposta."
//   do .pen não existem no React: ficam de fora (usa-se a descrição do estado).
// - Registo de projetos (ds/display/registo-linha "projeto"), padding [$space-2xl, 0]; ou,
//   sem projetos, o vazio com o título e a acção primária (o texto, a linha fantasma e a
//   legenda do .pen não têm frase no React).
// - Os seus pedidos: os cinco mais recentes que não são pedidos de projeto novo, "Ver
//   todos os pedidos" e, à parte, "Pedidos de projeto" (ainda não são projetos).

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);
  return {
    title: t.meta.projetosTitle,
    robots: { index: false },
    ...pageMetadata(lang, "/area-cliente/projetos"),
  };
}

export default async function AreaClienteProjetos() {
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);
  const { token } = await requireSession(lang);

  const [projetos, pedidos] = await Promise.all([
    backendFetch<Projeto[]>("/api/me/projects/", { token }),
    backendFetch<PedidoResumo[]>("/api/me/requests/", { token }),
  ]);

  // Pedidos "projeto novo" ainda não são projetos (o `Project` só é criado mais tarde):
  // ficam numa lista própria, fora do resumo de pedidos.
  const pedidosDeProjeto = pedidos.filter((p) => p.type === "novo_projeto" && !p.project);
  const resumo = pedidos.filter((p) => !pedidosDeProjeto.includes(p)).slice(0, 5);
  const aEspera = pedidos
    .filter((p) => pedidoEsperaCliente(p.status))
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0];

  return (
    <main className="flex flex-1 flex-col px-lg md:px-xl lg:px-2xl">
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

      {aEspera ? (
        <BlocoDaVez
          lado
          titleAs="h2"
          fact={
            <>
              <p className="font-mono text-caption text-text-secondary">
                {referenciaPedido(aEspera.id)}
              </p>
              <p className="font-mono text-caption text-text-secondary">
                {formatarDataCurta(lang, aEspera.updated_at)}
              </p>
            </>
          }
          title={t.statusPedido.informacao_necessaria.description}
          acao={
            <ButtonLink
              href={`/area-cliente/pedidos/${aEspera.id}#resposta`}
              size="action"
              className="tracking-[var(--letter-spacing-label)]"
            >
              {t.detalhe.comment.submit}
            </ButtonLink>
          }
        >
          <p className="font-body text-body text-text-secondary">{aEspera.title}</p>
        </BlocoDaVez>
      ) : null}

      {projetos.length === 0 ? (
        <section className="flex flex-col items-start gap-lg pt-2xl pb-3xl">
          <h2 className="max-w-[704px] font-heading text-title-sm leading-[var(--line-height-title)] font-semibold tracking-[var(--letter-spacing-title)] text-text-primary md:text-title">
            {t.projetos.emptyTitle}
          </h2>
          <ButtonLink
            href="/area-cliente/projetos/novo"
            size="action"
            className="tracking-[var(--letter-spacing-label)]"
          >
            {t.projetos.newProject}
          </ButtonLink>
        </section>
      ) : (
        <section className="py-2xl">
          <Registo>
            {projetos.map((projeto) => (
              <RegistoLinha
                key={projeto.id}
                variante="projeto"
                href={`/area-cliente/projetos/${projeto.id}`}
                nome={projeto.title}
                nomeApagado={projeto.status === "entregue"}
                servico={servicoLabel(t, projeto.service, projeto.service_label)}
                estado={projetoStatusLabel(t, projeto.status, projeto.status_label)}
                estadoTom={projetoTom(projeto.status)}
                mudanca={projeto.latest_update}
                data={formatarDataCurta(lang, projeto.latest_update_at)}
              />
            ))}
          </Registo>
        </section>
      )}

      <section aria-labelledby="pedidos-titulo" className="flex flex-col pt-xl pb-3xl">
        <h2
          id="pedidos-titulo"
          className="font-heading text-body-lg leading-[var(--line-height-title)] font-semibold tracking-[var(--letter-spacing-title)] text-text-primary md:text-title-sm"
        >
          {t.projetos.requestsHeading}
        </h2>

        {resumo.length === 0 && pedidosDeProjeto.length === 0 ? (
          <p className="pt-xs font-body text-body text-text-secondary">{t.projetos.requestsEmpty}</p>
        ) : (
          <>
            {resumo.length > 0 ? (
              <Registo className="mt-md">
                {resumo.map((pedido) => (
                  <PedidoLinha key={pedido.id} pedido={pedido} lang={lang} t={t} />
                ))}
              </Registo>
            ) : null}
            <div className="pt-sm">
              <Ligacao href="/area-cliente/pedidos" variant="acao" className="font-normal">
                {t.projetos.requestsAll}
              </Ligacao>
            </div>

            {pedidosDeProjeto.length > 0 ? (
              <>
                <h3 className="pt-2xl pb-sm font-body text-label font-medium tracking-[var(--letter-spacing-label)] text-text-primary">
                  {t.projetos.projectRequestsHeading}
                </h3>
                <Registo>
                  {pedidosDeProjeto.map((pedido) => (
                    <PedidoLinha
                      key={pedido.id}
                      pedido={pedido}
                      lang={lang}
                      t={t}
                      tipo={t.tipoPedido[pedido.type]}
                    />
                  ))}
                </Registo>
              </>
            ) : null}
          </>
        )}
      </section>
    </main>
  );
}
