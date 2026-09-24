import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { localizePath } from "@/i18n/config";
import { getLocale, getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";
import { AuthShell } from "@/components/area-cliente/auth-shell";
import { publicSiteHref } from "@/lib/site-url";
import { EntrarForm } from "@/components/area-cliente/entrar-form";

// Frames "Ecrã · Entrar" do grupo "v2 · A vez" (flhgP) do design-system.pen. Criar conta
// é outra página (/criar-conta, mesmo `EntrarForm` com `pagina="criar-conta"`).
//
// Parâmetros de chegada:
// - `?erro=google`  regresso falhado do OAuth (aviso de erro na folha)
// - `?reposta=1`    a palavra-passe nova acabou de ser definida em /repor-palavra-passe
// - `?repor=1`      URL antigo do pedido de ligação (era um estado deste ecrã): redirecciona
//                   para /recuperar-palavra-passe, a rota própria desde 2026-09-24

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
  const { erro, reposta, repor } = await searchParams;
  const lang = await getLocale();
  if (repor === "1") redirect(localizePath(lang, "/area-cliente/recuperar-palavra-passe"));
  const { areaCliente: t, contacto } = await getDictionary(lang);
  return (
    <AuthShell
      backToSite={t.entrar.backToSite}
      area={t.entrar.heading}
      siteHref={publicSiteHref(lang)}
    >
      <EntrarForm
        pagina="entrar"
        erroGoogle={erro === "google"}
        reposta={reposta === "1"}
        lang={lang}
        campos={{
          nameRequired: contacto.form.validation.nameRequired,
          emailRequired: contacto.form.validation.emailRequired,
          emailInvalid: contacto.form.validation.emailInvalid,
          emailFormat: contacto.form.validation.emailFormat,
          passwordLength: t.definicoes.seguranca.errNewPassword,
          optional: t.definicoes.perfil.optional,
        }}
        t={t.entrar}
      />
    </AuthShell>
  );
}
