import type { Metadata } from "next";
import { getLocale, getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";
import { BackLink } from "@/components/area-cliente/back-link";
import { Topbar } from "@/components/area-cliente/topbar";
import { PerfilForm } from "@/components/area-cliente/perfil-form";
import { PasswordForm } from "@/components/area-cliente/password-form";
import { TabSegments } from "@/components/ui/tabs";
import { backendFetch } from "@/lib/area-cliente/backend";
import { requireSession } from "@/lib/area-cliente/session";
import type { Perfil } from "@/lib/area-cliente/types";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);
  return {
    title: t.meta.definicoesTitle,
    robots: { index: false },
    ...pageMetadata(lang, "/area-cliente/definicoes"),
  };
}

export default async function AreaClienteDefinicoes({
  searchParams,
}: PageProps<"/[lang]/area-cliente/definicoes">) {
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);
  const { token, me } = await requireSession(lang);
  const perfil = await backendFetch<Perfil>("/api/me/", { token });

  const { tab } = await searchParams;
  const aba = tab === "seguranca" ? "seguranca" : "perfil";

  return (
    <div className="flex min-h-screen flex-col bg-bg-base">
      <Topbar me={me} lang={lang} t={t} />

      <main className="flex flex-1 justify-center px-lg py-2xl lg:px-2xl lg:py-3xl">
        <div className="flex w-full max-w-[640px] flex-col gap-2xl">
          <BackLink href="/area-cliente/projetos" label={t.back} />

          <div className="flex flex-col gap-sm">
            <h1 className="font-heading text-headline font-bold tracking-[var(--letter-spacing-headline)] text-text-primary">
              {t.definicoes.heading}
            </h1>
            <p className="font-body text-body-lg text-text-secondary">{t.definicoes.intro}</p>
          </div>

          <TabSegments
            label={t.definicoes.heading}
            segments={[
              {
                label: t.definicoes.perfil.heading,
                href: "/area-cliente/definicoes",
                current: aba === "perfil",
              },
              {
                label: t.definicoes.seguranca.heading,
                href: "/area-cliente/definicoes?tab=seguranca",
                current: aba === "seguranca",
              },
            ]}
          />

          {aba === "perfil" ? (
            <PerfilForm perfil={perfil} lang={lang} t={t.definicoes.perfil} />
          ) : (
            <PasswordForm lang={lang} t={t.definicoes.seguranca} />
          )}
        </div>
      </main>
    </div>
  );
}
