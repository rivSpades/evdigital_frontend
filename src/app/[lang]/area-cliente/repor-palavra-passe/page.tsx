import type { Metadata } from "next";
import { getLocale, getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";
import { AuthSection, AuthShell } from "@/components/area-cliente/auth-shell";
import { publicSiteHref } from "@/lib/site-url";
import { NovaPalavraPasseForm } from "@/components/area-cliente/nova-palavra-passe-form";

// Frames "Ecrã · Nova palavra-passe" do grupo "v2 · A vez" (flhgP) do design-system.pen.
// Chega da ligação do email de reposição (backend apps/accounts/services.py, _reset_url):
// `?uid=…&token=…`. Sem os dois, a ligação é inválida à partida e nem se mostra o
// formulário. uid e token nunca vão para logs nem para a consola.

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);
  return {
    title: t.meta.reporTitle,
    robots: { index: false },
    ...pageMetadata(lang, "/area-cliente/repor-palavra-passe"),
  };
}

export default async function ReporPalavraPasse({
  searchParams,
}: PageProps<"/[lang]/area-cliente/repor-palavra-passe">) {
  const { uid, token } = await searchParams;
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);

  const ligacao =
    typeof uid === "string" && typeof token === "string" && uid && token ? { uid, token } : null;

  return (
    <AuthShell
      backToSite={t.entrar.backToSite}
      area={t.entrar.heading}
      siteHref={publicSiteHref(lang)}
    >
      <AuthSection>
        <div className="flex flex-col">
          <NovaPalavraPasseForm
            ligacao={ligacao}
            lang={lang}
            t={t.repor}
            tSeguranca={t.definicoes.seguranca}
          />
        </div>
      </AuthSection>
    </AuthShell>
  );
}
