import type { Metadata } from "next";
import Link from "@/i18n/locale-link";
import { getLocale, getDictionary } from "@/i18n/dictionaries";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { BackLink } from "@/components/area-cliente/back-link";
import { Topbar } from "@/components/area-cliente/topbar";
import { ComentarForm } from "@/components/area-cliente/comentar-form";
import { StatusPill } from "@/components/area-cliente/status-pill";
import { BackendError, backendFetch } from "@/lib/area-cliente/backend";
import { formatarData, pedidoStatus, referenciaPedido } from "@/lib/area-cliente/format";
import { requireSession } from "@/lib/area-cliente/session";
import type { PedidoDetalhe } from "@/lib/area-cliente/types";

// Ecrã "Área de Cliente · Detalhe do pedido" (IPDsC) do design-system.pen.

const TOM = (status: string) =>
  status === "informacao_necessaria" ? "warning" : status === "concluido" ? "neutral" : "accent";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);
  return {
    title: t.meta.detalheTitle,
    robots: { index: false },
  };
}

export default async function AreaClientePedidoDetalhe({
  params,
}: PageProps<"/[lang]/area-cliente/pedidos/[id]">) {
  const { id } = await params;
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);
  const { token, me } = await requireSession(lang);
  const data = (iso: string) => formatarData(lang, iso);

  let pedido: PedidoDetalhe;
  try {
    pedido = await backendFetch<PedidoDetalhe>(`/api/me/requests/${id}/`, { token });
  } catch (erro) {
    if (erro instanceof BackendError && erro.status === 404) notFound();
    throw erro;
  }

  const status = pedidoStatus(t, pedido.status, pedido.status_label);
  const tipoLabel = t.tipoPedido[pedido.type];

  return (
    <div className="flex min-h-screen flex-col bg-bg-base">
      <Topbar me={me} lang={lang} t={t} />

      <main className="flex flex-1 justify-center px-lg py-2xl lg:px-2xl lg:py-3xl">
        <div className="flex w-full max-w-[var(--grid-max-width)] flex-col gap-xl">
          <BackLink href="/area-cliente/pedidos" label={t.back} />

          <nav aria-label={t.breadcrumbAria} className="flex items-center gap-xs">
            <Link
              href="/area-cliente/pedidos"
              className="font-body text-caption font-medium text-text-link hover:text-text-accent"
            >
              {t.topbar.pedidos}
            </Link>
            <ChevronRight size={16} strokeWidth={2} aria-hidden className="text-text-tertiary" />
            <span className="font-body text-caption text-text-tertiary">{pedido.title}</span>
          </nav>

          <div className="flex flex-col gap-lg sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-xs">
              <h1 className="font-heading text-title font-bold tracking-[var(--letter-spacing-title)] text-text-primary">
                {pedido.title}
              </h1>
              <p className="font-body text-caption text-text-tertiary">
                {referenciaPedido(pedido.id)} · {tipoLabel}
                {pedido.project ? ` · ${pedido.project.title}` : ""} · {t.detalhe.submittedOn}{" "}
                {data(pedido.created_at)}
              </p>
            </div>
            <StatusPill label={status.label} tone={TOM(pedido.status)} />
          </div>

          <div className="flex flex-col gap-xl lg:flex-row lg:items-start">
            <div className="flex flex-1 flex-col gap-xl">
              <div className="flex flex-col gap-md rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface p-lg">
                <h2 className="font-heading text-title-sm font-semibold text-text-primary">
                  {t.detalhe.progressHeading}
                </h2>
                <ol className="flex flex-col">
                  {pedido.status_changes.map((mudanca, i) => {
                    const mudancaStatus = pedidoStatus(t, mudanca.to_status, mudanca.status_label);
                    const ultimo = i === pedido.status_changes.length - 1;
                    return (
                      <li key={`${mudanca.to_status}-${mudanca.created_at}`} className="flex gap-md">
                        <div className="flex w-6 flex-col items-center gap-2xs">
                          <span
                            aria-hidden
                            className="mt-1 size-3 shrink-0 rounded-full bg-accent-primary"
                          />
                          {!ultimo ? <span aria-hidden className="w-0.5 flex-1 bg-border-default" /> : null}
                        </div>
                        <div className="flex flex-col gap-3xs pb-lg">
                          <div className="flex flex-wrap items-center gap-sm">
                            <p className="font-body text-label font-semibold text-text-primary">
                              {mudancaStatus.label}
                            </p>
                            <p className="font-body text-caption text-text-tertiary">
                              {data(mudanca.created_at)}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

              <div className="flex flex-col gap-lg rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface p-lg">
                <h2 className="font-heading text-title-sm font-semibold text-text-primary">
                  {t.detalhe.conversationHeading}
                </h2>
                {pedido.comments.length === 0 ? (
                  <p className="font-body text-body text-text-secondary">
                    {t.detalhe.noMessages}
                  </p>
                ) : (
                  <div className="flex flex-col gap-md">
                    {pedido.comments.map((comentario) => (
                      <div
                        key={comentario.id}
                        className={
                          comentario.is_team
                            ? "flex flex-col gap-xs rounded-[var(--radius-md)] border border-border-default bg-bg-surface-raised p-md sm:mr-4xl"
                            : "flex flex-col gap-xs rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface-sunken p-md sm:ml-4xl"
                        }
                      >
                        <div className="flex items-center gap-sm">
                          <p className="font-body text-caption font-semibold text-text-primary">
                            {comentario.is_team ? t.detalhe.teamName : comentario.author_name}
                          </p>
                          <p className="font-body text-caption text-text-tertiary">
                            {data(comentario.created_at)}
                          </p>
                        </div>
                        <p className="font-body text-body text-text-secondary">{comentario.body}</p>
                      </div>
                    ))}
                  </div>
                )}
                <ComentarForm pedidoId={pedido.id} lang={lang} t={t.detalhe.comment} />
              </div>
            </div>

            <aside className="flex flex-col gap-lg lg:w-[380px] lg:shrink-0">
              <div className="flex flex-col gap-md rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface-sunken p-lg">
                <h2 className="font-heading text-title-sm font-semibold text-text-primary">
                  {t.detalhe.sheetHeading}
                </h2>
                {[
                  [t.detalhe.sheetReference, referenciaPedido(pedido.id)],
                  [t.detalhe.sheetType, tipoLabel],
                  [t.detalhe.sheetProject, pedido.project?.title ?? t.detalhe.sheetNoProject],
                  [t.detalhe.sheetSubmitted, data(pedido.created_at)],
                  [t.detalhe.sheetUpdated, data(pedido.updated_at)],
                  ...(pedido.status === "recusado" && pedido.reason
                    ? [[t.detalhe.sheetReason, pedido.reason]]
                    : []),
                ].map(([rotulo, valor], i, lista) => (
                  <div
                    key={rotulo}
                    className={
                      i < lista.length - 1
                        ? "flex flex-col gap-3xs border-b border-border-subtle pb-md"
                        : "flex flex-col gap-3xs"
                    }
                  >
                    <p className="font-body text-caption text-text-tertiary">{rotulo}</p>
                    <p className="font-body text-body text-text-primary">{valor}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
