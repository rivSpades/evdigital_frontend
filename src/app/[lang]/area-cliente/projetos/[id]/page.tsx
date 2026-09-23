import type { Metadata } from "next";
import Link from "@/i18n/locale-link";
import { getLocale, getDictionary } from "@/i18n/dictionaries";
import { notFound } from "next/navigation";
import { ChevronRight, Plus } from "lucide-react";
import { Topbar } from "@/components/area-cliente/topbar";
import { StatusPill } from "@/components/area-cliente/status-pill";
import { ButtonLink } from "@/components/ui/button";
import { BackendError, backendFetch } from "@/lib/area-cliente/backend";
import { formatarData, pedidoStatus, projetoStatusLabel, servicoLabel } from "@/lib/area-cliente/format";
import { requireSession } from "@/lib/area-cliente/session";
import type { PedidoResumo, Projeto } from "@/lib/area-cliente/types";

// Ecrã "Área de Cliente · Detalhe do projeto" — cada projeto tem aqui os seus próprios
// pedidos/tickets, em vez de tudo misturado na lista geral de "Os seus pedidos".

const PROJETO_TOM: Record<Projeto["status"], "accent" | "warning" | "neutral"> = {
  em_curso: "accent",
  entregue: "neutral",
  em_pausa: "warning",
};

const PEDIDO_TOM = (status: string) =>
  status === "informacao_necessaria" ? "warning" : status === "concluido" ? "neutral" : "accent";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);
  return {
    title: t.meta.projetoDetalheTitle,
    robots: { index: false },
  };
}

export default async function AreaClienteProjetoDetalhe({
  params,
}: PageProps<"/[lang]/area-cliente/projetos/[id]">) {
  const { id } = await params;
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);
  const { token, me } = await requireSession(lang);
  const data = (iso: string | null) => (iso ? formatarData(lang, iso) : t.projetoDetalhe.sheetPending);

  let projeto: Projeto;
  try {
    projeto = await backendFetch<Projeto>(`/api/me/projects/${id}/`, { token });
  } catch (erro) {
    if (erro instanceof BackendError && erro.status === 404) notFound();
    throw erro;
  }

  const pedidos = await backendFetch<PedidoResumo[]>(`/api/me/requests/?project=${id}`, { token });

  return (
    <div className="flex min-h-screen flex-col bg-bg-base">
      <Topbar me={me} lang={lang} t={t} />

      <main className="flex flex-1 justify-center px-lg py-2xl lg:px-2xl lg:py-3xl">
        <div className="flex w-full max-w-[var(--grid-max-width)] flex-col gap-xl">
          <nav aria-label={t.breadcrumbAria} className="flex items-center gap-xs">
            <Link
              href="/area-cliente/projetos"
              className="font-body text-caption font-medium text-text-link hover:text-text-accent"
            >
              {t.topbar.projetos}
            </Link>
            <ChevronRight size={16} strokeWidth={2} aria-hidden className="text-text-tertiary" />
            <span className="font-body text-caption text-text-tertiary">{projeto.title}</span>
          </nav>

          <div className="flex flex-col gap-lg sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-xs">
              <h1 className="font-heading text-title font-bold tracking-[var(--letter-spacing-title)] text-text-primary">
                {projeto.title}
              </h1>
              <p className="font-body text-caption text-text-tertiary">
                {servicoLabel(t, projeto.service, projeto.service_label)}
              </p>
            </div>
            <StatusPill
              label={projetoStatusLabel(t, projeto.status, projeto.status_label)}
              tone={PROJETO_TOM[projeto.status]}
            />
          </div>

          <div className="flex flex-col gap-xl lg:flex-row lg:items-start">
            <div className="flex flex-1 flex-col gap-xl">
              {projeto.latest_update ? (
                <div className="flex flex-col gap-sm rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface p-lg">
                  <h2 className="font-heading text-title-sm font-semibold text-text-primary">
                    {t.projetoDetalhe.updateHeading}
                  </h2>
                  <p className="font-body text-body text-text-secondary">{projeto.latest_update}</p>
                </div>
              ) : null}

              <div className="flex flex-col gap-md rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface p-lg">
                <div className="flex flex-col gap-md sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="font-heading text-title-sm font-semibold text-text-primary">
                    {t.projetoDetalhe.ticketsHeading}
                  </h2>
                  <ButtonLink
                    href={`/area-cliente/pedidos/novo?project=${projeto.id}`}
                    className="w-full sm:w-auto"
                  >
                    <Plus size={20} strokeWidth={2} aria-hidden />
                    {t.projetoDetalhe.newTicket}
                  </ButtonLink>
                </div>

                {pedidos.length === 0 ? (
                  <p className="font-body text-body text-text-secondary">
                    {t.projetoDetalhe.ticketsEmpty}
                  </p>
                ) : (
                  <ul className="flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border-subtle">
                    {pedidos.map((pedido, i) => (
                      <li key={pedido.id} className={i > 0 ? "border-t border-border-subtle" : undefined}>
                        <Link
                          href={`/area-cliente/pedidos/${pedido.id}`}
                          className="flex flex-col gap-sm bg-bg-surface p-lg transition-colors hover:bg-bg-surface-hover sm:flex-row sm:items-center sm:justify-between"
                        >
                          <p className="font-body text-body-lg font-semibold text-text-primary">
                            {pedido.title}
                          </p>
                          <StatusPill
                            label={pedidoStatus(t, pedido.status, pedido.status_label).label}
                            tone={PEDIDO_TOM(pedido.status)}
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <aside className="flex flex-col gap-lg lg:w-[380px] lg:shrink-0">
              <div className="flex flex-col gap-md rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface-sunken p-lg">
                <h2 className="font-heading text-title-sm font-semibold text-text-primary">
                  {t.projetoDetalhe.sheetHeading}
                </h2>
                {[
                  [t.projetoDetalhe.sheetService, servicoLabel(t, projeto.service, projeto.service_label)],
                  [t.projetoDetalhe.sheetStarted, data(projeto.started_at)],
                  [t.projetoDetalhe.sheetDelivered, data(projeto.delivered_at)],
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
