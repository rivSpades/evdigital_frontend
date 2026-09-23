import type { Metadata } from "next";
import Link from "@/i18n/locale-link";
import { getLocale, getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";
import { ArrowLeft } from "lucide-react";
import { EntrarForm } from "@/components/area-cliente/entrar-form";

// Ecrã "Área de Cliente · Entrar e criar conta" (m2pAVi) do design-system.pen.

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);
  return {
    title: t.meta.entrarTitle,
    description: t.meta.entrarDescription,
    robots: { index: false },
    ...pageMetadata(lang, "/area-cliente/entrar"),
  };
}

export default async function AreaClienteEntrar({
  searchParams,
}: PageProps<"/[lang]/area-cliente/entrar">) {
  const { erro } = await searchParams;
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);
  return (
    <div className="flex min-h-screen flex-col bg-bg-base">
      <header className="flex h-16 items-center justify-between border-b border-border-subtle bg-bg-surface px-lg lg:px-2xl">
        <span className="font-heading text-label font-bold tracking-[var(--letter-spacing-title)] text-text-primary">
          <span className="text-text-accent">Ev</span>Digital
        </span>
        <Link
          href="/"
          className="flex h-11 items-center gap-xs px-xs font-body text-label font-medium text-text-link transition-colors hover:text-text-accent"
        >
          <ArrowLeft size={18} strokeWidth={2} aria-hidden />
          {t.entrar.backToSite}
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center gap-2xl px-lg py-3xl lg:py-4xl">
        <div className="flex w-full max-w-[520px] flex-col items-center gap-sm text-center">
          <h1 className="font-heading text-title font-semibold tracking-[var(--letter-spacing-title)] text-text-primary">
            {t.entrar.heading}
          </h1>
        </div>

        <EntrarForm erroGoogle={erro === "google"} lang={lang} t={t.entrar} />
      </main>
    </div>
  );
}
