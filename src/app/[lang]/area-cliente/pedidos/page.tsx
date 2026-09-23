import type { Metadata } from "next";
import { getLocale, getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";
import { Plus } from "lucide-react";
import { Topbar } from "@/components/area-cliente/topbar";
import { PedidosLista } from "@/components/area-cliente/pedidos-lista";
import { ButtonLink } from "@/components/ui/button";
import { backendFetch } from "@/lib/area-cliente/backend";
import { requireSession } from "@/lib/area-cliente/session";
import type { PedidoResumo } from "@/lib/area-cliente/types";

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
  const { token, me } = await requireSession(lang);
  const pedidos = await backendFetch<PedidoResumo[]>("/api/me/requests/", { token });

  return (
    <div className="flex min-h-screen flex-col bg-bg-base">
      <Topbar me={me} lang={lang} t={t} />

      <main className="flex flex-1 flex-col gap-2xl px-lg py-2xl lg:px-2xl lg:py-3xl">
        <div className="mx-auto flex w-full max-w-[var(--grid-max-width)] flex-col gap-2xl">
          <div className="flex flex-col gap-md sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-heading text-title font-semibold tracking-[var(--letter-spacing-title)] text-text-primary">
              {t.pedidos.heading}
            </h1>
            <ButtonLink href="/area-cliente/pedidos/novo" className="w-full sm:w-auto">
              <Plus size={20} strokeWidth={2} aria-hidden />
              {t.pedidos.newRequest}
            </ButtonLink>
          </div>

          {pedidos.length === 0 ? (
            <p className="font-body text-body text-text-secondary">
              {t.pedidos.empty}
            </p>
          ) : (
            <PedidosLista pedidos={pedidos} lang={lang} t={t} />
          )}
        </div>
      </main>
    </div>
  );
}
