import type { Metadata } from "next";
import { getLocale, getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";
import { AuthShell } from "@/components/area-cliente/auth-shell";
import { publicSiteHref } from "@/lib/site-url";
import { RecuperarForm } from "@/components/area-cliente/recuperar-form";

// «Esqueceu a palavra-passe?»: pedir a ligação de reposição, em rota própria desde
// 2026-09-24 (antes era um estado de /entrar, sem mudar de URL: a navegação e o título não
// acompanhavam). No host da Área de Cliente: /<lang>/recuperar-palavra-passe.
//
// Barra fixa por baixo do logótipo: a seta volta a Entrar ("Voltar a entrar") e o título é
// «Esqueceu a palavra-passe?». A ligação do email leva depois a /repor-palavra-passe.

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);
  return {
    title: t.entrar.resetHeading,
    robots: { index: false },
    ...pageMetadata(lang, "/area-cliente/recuperar-palavra-passe"),
  };
}

export default async function RecuperarPalavraPasse() {
  const lang = await getLocale();
  const { areaCliente: t, contacto } = await getDictionary(lang);
  return (
    <AuthShell
      backLabel={t.entrar.backToLogin}
      backHref="/area-cliente/entrar"
      area={t.entrar.resetHeading}
      siteHref={publicSiteHref(lang)}
    >
      <RecuperarForm
        lang={lang}
        campos={{
          emailRequired: contacto.form.validation.emailRequired,
          emailInvalid: contacto.form.validation.emailInvalid,
          emailFormat: contacto.form.validation.emailFormat,
        }}
        t={t.entrar}
      />
    </AuthShell>
  );
}
