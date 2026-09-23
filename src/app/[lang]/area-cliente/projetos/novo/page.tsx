import type { Metadata } from "next";
import Link from "@/i18n/locale-link";
import { getLocale, getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";
import { ChevronRight } from "lucide-react";
import { Topbar } from "@/components/area-cliente/topbar";
import { NovoProjetoForm } from "@/components/area-cliente/novo-projeto-form";
import { requireSession } from "@/lib/area-cliente/session";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);
  return {
    title: t.meta.novoProjetoTitle,
    robots: { index: false },
    ...pageMetadata(lang, "/area-cliente/projetos/novo"),
  };
}

export default async function AreaClienteNovoProjeto() {
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);
  const { me } = await requireSession(lang);

  return (
    <div className="flex min-h-screen flex-col bg-bg-base">
      <Topbar me={me} lang={lang} t={t} />

      <main className="flex flex-1 justify-center px-lg py-2xl lg:px-2xl lg:py-3xl">
        <div className="flex w-full max-w-[820px] flex-col gap-2xl">
          <nav aria-label={t.breadcrumbAria} className="flex items-center gap-xs">
            <Link
              href="/area-cliente/projetos"
              className="font-body text-caption font-medium text-text-link hover:text-text-accent"
            >
              {t.topbar.projetos}
            </Link>
            <ChevronRight size={16} strokeWidth={2} aria-hidden className="text-text-tertiary" />
            <span className="font-body text-caption text-text-tertiary">{t.novoProjeto.breadcrumbCurrent}</span>
          </nav>

          <div className="flex flex-col gap-sm">
            <h1 className="font-heading text-headline font-bold tracking-[var(--letter-spacing-headline)] text-text-primary">
              {t.novoProjeto.heading}
            </h1>
            <p className="font-body text-body-lg text-text-secondary">
              {t.novoProjeto.intro}
            </p>
          </div>

          <NovoProjetoForm lang={lang} t={t.novoProjeto.form} />
        </div>
      </main>
    </div>
  );
}
