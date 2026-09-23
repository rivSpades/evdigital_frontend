import type { Metadata } from "next";
import Link from "@/i18n/locale-link";
import { FolderOpen, Plus } from "lucide-react";
import { Topbar } from "@/components/area-cliente/topbar";
import { StatusPill } from "@/components/area-cliente/status-pill";
import { ButtonLink } from "@/components/ui/button";
import { getLocale, getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";
import { LinkArrow } from "@/components/ui/link-arrow";
import { backendFetch } from "@/lib/area-cliente/backend";
import { formatarData, pedidoStatus, projetoStatusLabel, servicoLabel } from "@/lib/area-cliente/format";
import { requireSession } from "@/lib/area-cliente/session";
import type { PedidoResumo, Projeto } from "@/lib/area-cliente/types";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);
  return {
    title: t.meta.projetosTitle,
    robots: { index: false },
    ...pageMetadata(lang, "/area-cliente/projetos"),
  };
}

const PROJETO_TOM: Record<Projeto["status"], "accent" | "warning" | "neutral"> = {
  em_curso: "accent",
  entregue: "neutral",
  em_pausa: "warning",
};

const PEDIDO_TOM = (status: string) =>
  status === "informacao_necessaria" ? "warning" : status === "concluido" ? "neutral" : "accent";

export default async function AreaClienteProjetos() {
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);
  const { token, me } = await requireSession(lang);

  const [projetos, pedidos] = await Promise.all([
    backendFetch<Projeto[]>("/api/me/projects/", { token }),
    backendFetch<PedidoResumo[]>("/api/me/requests/", { token }),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-bg-base">
      <Topbar me={me} lang={lang} t={t} />

      <main className="flex flex-1 flex-col gap-2xl px-lg py-2xl lg:px-2xl lg:py-3xl">
        <div className="mx-auto flex w-full max-w-[var(--grid-max-width)] flex-col gap-2xl">
          <div className="flex flex-col gap-md sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2xs">
              <h1 className="font-heading text-title font-semibold tracking-[var(--letter-spacing-title)] text-text-primary">
                {t.projetos.heading}
              </h1>
              <p className="font-body text-body text-text-secondary">
                {t.projetos.intro}
              </p>
            </div>
            <ButtonLink href="/area-cliente/projetos/novo" className="w-full sm:w-auto">
              <Plus size={20} strokeWidth={2} aria-hidden />
              {t.projetos.newProject}
            </ButtonLink>
          </div>

          {projetos.length === 0 ? (
            <div className="flex flex-col items-center gap-lg rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface p-2xl text-center lg:p-4xl">
              <span className="flex size-16 items-center justify-center rounded-[var(--radius-md)] bg-accent-primary-subtle">
                <FolderOpen size={32} strokeWidth={2} aria-hidden className="text-text-accent" />
              </span>
              <div className="flex max-w-[520px] flex-col gap-sm">
                <h2 className="font-heading text-title-sm font-semibold text-text-primary">
                  {t.projetos.emptyTitle}
                </h2>
                <p className="font-body text-body text-text-secondary">
                  {t.projetos.emptyBody}
                </p>
              </div>
              <ButtonLink href="/area-cliente/projetos/novo" size="lg">
                <Plus size={20} strokeWidth={2} aria-hidden />
                {t.projetos.newProject}
              </ButtonLink>
            </div>
          ) : (
            <div className="flex flex-col gap-2xl lg:flex-row lg:items-start">
              <div className="flex flex-1 flex-col gap-md">
                {projetos.map((projeto) => (
                  <Link
                    key={projeto.id}
                    href={`/area-cliente/projetos/${projeto.id}`}
                    className="flex flex-col gap-md rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface p-lg transition-colors hover:bg-bg-surface-hover"
                  >
                    <div className="flex items-center justify-between gap-md">
                      <div className="flex flex-col gap-3xs">
                        <h3 className="font-heading text-title-sm font-semibold tracking-[var(--letter-spacing-title)] text-text-primary">
                          {projeto.title}
                        </h3>
                        <p className="font-body text-caption text-text-tertiary">
                          {servicoLabel(t, projeto.service, projeto.service_label)}
                        </p>
                      </div>
                      <StatusPill
                        label={projetoStatusLabel(t, projeto.status, projeto.status_label)}
                        tone={PROJETO_TOM[projeto.status]}
                      />
                    </div>

                    {projeto.latest_update ? (
                      <>
                        <span aria-hidden className="h-px w-full bg-border-subtle" />
                        <div className="flex items-center justify-between gap-md">
                          <p className="font-body text-body text-text-secondary">
                            {projeto.latest_update}
                          </p>
                        </div>
                      </>
                    ) : null}
                  </Link>
                ))}
              </div>

              <aside className="flex flex-col gap-md rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface-sunken p-lg lg:w-[380px] lg:shrink-0">
                <h2 className="font-heading text-title-sm font-semibold tracking-[var(--letter-spacing-title)] text-text-primary">
                  {t.projetos.requestsHeading}
                </h2>
                {pedidos.length === 0 ? (
                  <p className="font-body text-body text-text-secondary">
                    {t.projetos.requestsEmpty}
                  </p>
                ) : (
                  <ul className="flex flex-col">
                    {pedidos.slice(0, 5).map((pedido, i) => (
                      <li
                        key={pedido.id}
                        className={
                          i > 0
                            ? "flex flex-col gap-xs border-t border-border-subtle py-md"
                            : "flex flex-col gap-xs pb-md"
                        }
                      >
                        <Link
                          href={`/area-cliente/pedidos/${pedido.id}`}
                          className="font-body text-body font-semibold text-text-primary hover:text-text-accent"
                        >
                          {pedido.title}
                        </Link>
                        <div className="flex items-center justify-between gap-sm">
                          <StatusPill
                            label={pedidoStatus(t, pedido.status, pedido.status_label).label}
                            tone={PEDIDO_TOM(pedido.status)}
                          />
                          <span className="font-body text-caption text-text-tertiary">
                            {formatarData(lang, pedido.created_at, { day: "2-digit", month: "short" })}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <LinkArrow href="/area-cliente/pedidos">{t.projetos.requestsAll}</LinkArrow>
              </aside>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
