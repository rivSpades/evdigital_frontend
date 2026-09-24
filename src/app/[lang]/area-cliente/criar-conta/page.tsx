import type { Metadata } from "next";
import { getLocale, getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";
import { AuthShell } from "@/components/area-cliente/auth-shell";
import { publicSiteHref } from "@/lib/site-url";
import { EntrarForm } from "@/components/area-cliente/entrar-form";

// Criar conta da Área de Cliente: página própria desde 2026-09-24 (antes era um separador
// do Entrar). Frames "Criar conta" do grupo "v2 · A vez" (flhgP) do design-system.pen. O
// formulário é o `EntrarForm` com `pagina="criar-conta"`: registo, conta criada e Google.

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);
  return {
    title: t.entrar.tabCriarConta,
    description: t.meta.entrarDescription,
    robots: { index: false },
    ...pageMetadata(lang, "/area-cliente/criar-conta"),
  };
}

export default async function AreaClienteCriarConta() {
  const lang = await getLocale();
  const { areaCliente: t, contacto } = await getDictionary(lang);
  return (
    <AuthShell
      backToSite={t.entrar.backToSite}
      area={t.entrar.heading}
      siteHref={publicSiteHref(lang)}
    >
      <EntrarForm
        pagina="criar-conta"
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
