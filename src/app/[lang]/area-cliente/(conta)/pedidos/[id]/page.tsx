import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/area-cliente/back-link";
import { tituloPaginaClasses } from "@/components/area-cliente/cabecalho-pagina";
import {
  AbrirResposta,
  ComentarForm,
  RespostaProvider,
} from "@/components/area-cliente/comentar-form";
import { FichaLateral } from "@/components/area-cliente/ficha-lateral";
import { BlocoDaVez } from "@/components/ui/bloco-da-vez";
import { ButtonLink } from "@/components/ui/button";
import { EntradaHistorico } from "@/components/ui/entrada-historico";
import { EscritoPor } from "@/components/ui/escrito-por";
import { Mensagem } from "@/components/ui/mensagem";
import { Metadado, Metadados } from "@/components/ui/metadado";
import { PerguntaPedido } from "@/components/ui/pergunta-pedido";
import { VazioTracejado } from "@/components/ui/vazio-tracejado";
import { getLocale, getDictionary } from "@/i18n/dictionaries";
import { BackendError } from "@/lib/area-cliente/backend";
import { getPedidoDetalhe, naoExiste } from "@/lib/area-cliente/dados";
import {
  formatarDataCurta,
  formatarDataHora,
  pedidoStatus,
  referenciaPedido,
} from "@/lib/area-cliente/format";
import { getSessionToken, requireSession } from "@/lib/area-cliente/session";
import { pedidoEsperaCliente, pedidoTom } from "@/lib/area-cliente/tons";
import { cn } from "@/lib/cn";
import type { PedidoDetalhe } from "@/lib/area-cliente/types";

// Frames "Detalhe do pedido" do grupo "v2 · A vez" do design-system.pen (à espera de si
// u3HoZM/UGwic, em curso dk1sk, proposta enviada tSyBd, concluído MJys4, não avança h4dJU,
// conversa vazia MKdiZ, estados da resposta):
// - Topo, padding [$space-xl, 0, $space-lg, 0]: Voltar, título (padding-top $space-sm,
//   620 de largura) e metadados (Referência, Tipo, Projeto, Submetido).
// - Estado actual, padding [$space-md, 0, $space-lg, 0]: o bloco da vez (lado) com a data
//   da última mudança, o estado como frase em display e a descrição do estado. "À espera
//   de si" (a resposta é do cliente): frase em $text-primary, a pergunta da equipa e
//   "Responder"; nos outros estados a frase fica em $text-secondary. Não avança: o motivo.
//   Concluído: "Fazer um pedido" (secundário). As frases curtas do .pen ("Falta a sua
//   resposta.", "Enviámos a proposta.", "Não precisa de fazer nada...") não existem no
//   React: a frase é o nome do estado e o texto a sua descrição, do dicionário.
// - Pedido, padding [$space-2xl, 0]: em lg a ficha (278) à esquerda e a coluna principal;
//   abaixo de lg a coluna principal e depois a ficha, gap $space-3xl. Coluna: o que pediu
//   (a descrição, body-lg, com "submetido a" e a data; o título "O que pediu" do .pen não
//   tem frase no React), "Onde está o pedido" (histórico em registo), "Conversa" (cartas
//   ou o vazio tracejado) e o botão "Responder" que revela a folha de resposta
//   (design-guardrails.md §6).

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/area-cliente/pedidos/[id]">): Promise<Metadata> {
  const { id } = await params;
  const lang = await getLocale();
  const { areaCliente: t, erros } = await getDictionary(lang);
  // Pedido inexistente ou de outra conta: o separador diz o mesmo que o 404 mostrado.
  const token = await getSessionToken();
  const inexistente = token ? await naoExiste(getPedidoDetalhe(token, id)) : false;
  return {
    title: inexistente ? erros.naoEncontrada.title : t.meta.detalheTitle,
    robots: { index: false },
  };
}

const tituloSecao =
  "font-heading text-body-lg leading-[var(--line-height-title)] font-semibold tracking-[var(--letter-spacing-title)] text-text-primary md:text-title-sm";

export default async function AreaClientePedidoDetalhe({
  params,
}: PageProps<"/[lang]/area-cliente/pedidos/[id]">) {
  const { id } = await params;
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);
  const { token } = await requireSession(lang);

  let pedido: PedidoDetalhe;
  try {
    pedido = await getPedidoDetalhe(token, id);
  } catch (erro) {
    if (erro instanceof BackendError && erro.status === 404) notFound();
    throw erro;
  }

  const status = pedidoStatus(t, pedido.status, pedido.status_label, pedido.status_description);
  const tipoLabel = t.tipoPedido[pedido.type];
  const esperaCliente = pedidoEsperaCliente(pedido.status);
  const ultimaMudanca = pedido.status_changes[pedido.status_changes.length - 1];
  const perguntaEquipa = esperaCliente
    ? [...pedido.comments].reverse().find((c) => c.is_team)
    : undefined;
  const novoPedidoHref = pedido.project
    ? `/area-cliente/pedidos/novo?project=${pedido.project.id}`
    : "/area-cliente/pedidos/novo";

  return (
    <main className="flex flex-1 flex-col px-lg md:px-xl lg:px-2xl">
      {/* O "Responder" do bloco da vez e o do fim da conversa abrem a mesma folha. */}
      <RespostaProvider key={pedido.id}>
        <section className="flex flex-col pt-xl pb-lg">
          <BackLink href="/area-cliente/pedidos" label={t.back} />
          <h1 className={cn("max-w-[620px] pt-sm", tituloPaginaClasses)}>{pedido.title}</h1>
          <Metadados>
            <Metadado rotulo={t.detalhe.sheetReference} valor={referenciaPedido(pedido.id)} />
            <Metadado rotulo={t.detalhe.sheetType} valor={tipoLabel} valorTexto />
            {pedido.project ? (
              <Metadado rotulo={t.detalhe.sheetProject} valor={pedido.project.title} valorTexto />
            ) : null}
            <Metadado
              rotulo={t.detalhe.sheetSubmitted}
              valor={formatarDataCurta(lang, pedido.created_at)}
            />
          </Metadados>
        </section>

        <section className="pt-md pb-lg">
          <BlocoDaVez
            lado
            frase="display"
            fraseTom={esperaCliente ? "primario" : "secundario"}
            titleAs="h2"
            fact={
              <p
                className={cn(
                  "font-mono text-caption",
                  esperaCliente ? "text-text-secondary" : "text-text-tertiary",
                )}
              >
                {formatarDataHora(lang, ultimaMudanca?.created_at ?? pedido.updated_at)}
              </p>
            }
            title={status.label}
          >
            {status.description ? (
              <p className="max-w-[680px] font-body text-body-lg text-text-secondary">
                {status.description}
              </p>
            ) : null}
            {perguntaEquipa ? (
              <div className="pt-xs">
                <PerguntaPedido quem={t.detalhe.teamName} texto={perguntaEquipa.body} />
              </div>
            ) : null}
            {pedido.status === "recusado" && pedido.reason ? (
              <div className="pt-xs">
                <PerguntaPedido quem={t.detalhe.sheetReason} texto={pedido.reason} />
              </div>
            ) : null}
            {esperaCliente ? (
              <div className="flex pt-xs">
                <AbrirResposta
                  label={
                    pedido.comments.length === 0
                      ? t.detalhe.comment.startConversation
                      : t.detalhe.comment.submit
                  }
                  className="tracking-[var(--letter-spacing-label)]"
                />
              </div>
            ) : null}
            {pedido.status === "concluido" ? (
              <div className="flex pt-xs">
                <ButtonLink
                  href={novoPedidoHref}
                  variant="outline"
                  size="action"
                  className="tracking-[var(--letter-spacing-label)]"
                >
                  {t.pedidos.newRequest}
                </ButtonLink>
              </div>
            ) : null}
          </BlocoDaVez>
        </section>

        <div className="flex flex-col gap-3xl pt-2xl pb-3xl lg:flex-row lg:gap-lg">
          <div className="flex min-w-0 flex-1 flex-col">
            {pedido.description ? (
              <div className="flex flex-col">
                <p className="max-w-[760px] font-body text-body-lg whitespace-pre-line text-text-primary">
                  {pedido.description}
                </p>
                <EscritoPor
                  texto={t.detalhe.submittedOn}
                  data={formatarDataCurta(lang, pedido.created_at)}
                  dateTime={pedido.created_at}
                />
              </div>
            ) : null}

            <section aria-labelledby="historico-titulo" className="flex flex-col">
              <h2
                id="historico-titulo"
                className={cn("pb-md", pedido.description && "pt-3xl", tituloSecao)}
              >
                {t.detalhe.progressHeading}
              </h2>
              <ol className="flex flex-col border-t border-border-default">
                {pedido.status_changes.map((mudanca, i) => {
                  const actual = i === pedido.status_changes.length - 1;
                  const tom = pedidoTom(mudanca.to_status);
                  const m = pedidoStatus(t, mudanca.to_status, mudanca.status_label, mudanca.status_description);
                  return (
                    <EntradaHistorico
                      key={`${mudanca.to_status}-${mudanca.created_at}`}
                      data={formatarDataHora(lang, mudanca.created_at)}
                      estado={m.label}
                      estadoTom={!actual && tom === "destaque" ? "primario" : tom}
                      explicacao={m.description}
                      actual={actual}
                    />
                  );
                })}
              </ol>
            </section>

            <section aria-labelledby="conversa-titulo" className="flex flex-col">
              <h2 id="conversa-titulo" className={cn("pt-3xl pb-md", tituloSecao)}>
                {t.detalhe.conversationHeading}
              </h2>
              {/* role="log": a mensagem acabada de enviar (depois do router.refresh) é
                  anunciada pelos leitores de ecrã, sem texto novo. */}
              <div role="log" aria-labelledby="conversa-titulo">
                {pedido.comments.length === 0 ? (
                  <VazioTracejado className="max-w-[704px]">{t.detalhe.noMessages}</VazioTracejado>
                ) : (
                  <ol className="flex flex-col">
                    {pedido.comments.map((comentario) => (
                      <Mensagem
                        key={comentario.id}
                        autor={comentario.is_team ? t.detalhe.teamName : comentario.author_name}
                        hora={formatarDataHora(lang, comentario.created_at)}
                        dataHora={comentario.created_at}
                        texto={comentario.body}
                      />
                    ))}
                  </ol>
                )}
              </div>
              <div className="w-full max-w-[704px] pt-md">
                <ComentarForm
                  pedidoId={pedido.id}
                  lang={lang}
                  t={t.detalhe.comment}
                  conversaVazia={pedido.comments.length === 0}
                />
              </div>
            </section>
          </div>

          <div className="lg:order-first">
            <FichaLateral
              titulo={t.detalhe.sheetHeading}
              factos={[
                { termo: t.detalhe.sheetReference, valor: referenciaPedido(pedido.id) },
                { termo: t.detalhe.sheetType, valor: tipoLabel },
                {
                  termo: t.detalhe.sheetProject,
                  valor: pedido.project?.title ?? t.detalhe.sheetNoProject,
                },
                {
                  termo: t.novoPedido.form.urgencyLabel,
                  valor: t.novoPedido.form.urgencias[pedido.priority],
                  aviso: pedido.priority === "urgente",
                },
                { termo: t.detalhe.sheetSubmitted, valor: formatarDataHora(lang, pedido.created_at) },
                { termo: t.detalhe.sheetUpdated, valor: formatarDataHora(lang, pedido.updated_at) },
              ]}
            />
          </div>
        </div>
      </RespostaProvider>
    </main>
  );
}
