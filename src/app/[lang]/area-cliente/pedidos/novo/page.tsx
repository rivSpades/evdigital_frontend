import type { Metadata } from "next";
import Link from "@/i18n/locale-link";
import { getLocale, getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";
import { ChevronRight } from "lucide-react";
import { BackLink } from "@/components/area-cliente/back-link";
import { Topbar } from "@/components/area-cliente/topbar";
import { NovoPedidoForm } from "@/components/area-cliente/novo-pedido-form";
import { backendFetch } from "@/lib/area-cliente/backend";
import { requireSession } from "@/lib/area-cliente/session";
import type { Projeto } from "@/lib/area-cliente/types";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);
  return {
    title: t.meta.novoPedidoTitle,
    robots: { index: false },
    ...pageMetadata(lang, "/area-cliente/pedidos/novo"),
  };
}

export default async function AreaClienteNovoPedido({
  searchParams,
}: PageProps<"/[lang]/area-cliente/pedidos/novo">) {
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);
  const { token, me } = await requireSession(lang);
  const projetos = await backendFetch<Projeto[]>("/api/me/projects/", { token });

  const { project: projectParam } = await searchParams;
  const projetoFixo =
    typeof projectParam === "string" ? projetos.find((p) => p.id === projectParam) : undefined;

  return (
    <div className="flex min-h-screen flex-col bg-bg-base">
      <Topbar me={me} lang={lang} t={t} />

      <main className="flex flex-1 justify-center px-lg py-2xl lg:px-2xl lg:py-3xl">
        <div className="flex w-full max-w-[820px] flex-col gap-2xl">
          <BackLink href={projetoFixo ? `/area-cliente/projetos/${projetoFixo.id}` : "/area-cliente/pedidos"} label={t.back} />

          <nav aria-label={t.breadcrumbAria} className="flex items-center gap-xs">
            <Link
              href="/area-cliente/pedidos"
              className="font-body text-caption font-medium text-text-link hover:text-text-accent"
            >
              {t.topbar.pedidos}
            </Link>
            <ChevronRight size={16} strokeWidth={2} aria-hidden className="text-text-tertiary" />
            {projetoFixo ? (
              <>
                <Link
                  href={`/area-cliente/projetos/${projetoFixo.id}`}
                  className="font-body text-caption font-medium text-text-link hover:text-text-accent"
                >
                  {projetoFixo.title}
                </Link>
                <ChevronRight size={16} strokeWidth={2} aria-hidden className="text-text-tertiary" />
              </>
            ) : null}
            <span className="font-body text-caption text-text-tertiary">{t.novoPedido.breadcrumbCurrent}</span>
          </nav>

          <div className="flex flex-col gap-sm">
            <h1 className="font-heading text-headline font-bold tracking-[var(--letter-spacing-headline)] text-text-primary">
              {t.novoPedido.heading}
            </h1>
            <p className="font-body text-body-lg text-text-secondary">
              {t.novoPedido.intro}
            </p>
          </div>

          <NovoPedidoForm
            projetos={projetos}
            lang={lang}
            t={t.novoPedido.form}
            projetoFixo={projetoFixo}
          />
        </div>
      </main>
    </div>
  );
}
