import type { Metadata } from "next";
import { AuthSection, AuthShell } from "@/components/area-cliente/auth-shell";
import { ButtonLink } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { getLocale, getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";
import { BackendError, backendFetch } from "@/lib/area-cliente/backend";
import { publicSiteHref } from "@/lib/site-url";

// Frames "Ecrã · Confirmar email" (sucesso drttE / G1EBV, falha B2yI3 / PF5LG) do grupo
// "v2 · A vez" do design-system.pen: cabeçalho de autenticação com a marca, contexto
// "Área de Cliente" e, numa caixa de 448, o aviso (ds/feedback/notice, tamanho lg: é o
// conteúdo do ecrã) e a acção primária.
//
// Chega da ligação do email de confirmação (apps/accounts/services.py, backend). A
// confirmação é idempotente do lado do Django, por isso chamar o backend directamente
// aqui, durante o render, é seguro mesmo que a página seja pedida mais que uma vez.

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);
  return {
    title: t.meta.confirmarTitle,
    robots: { index: false },
    ...pageMetadata(lang, "/area-cliente/confirmar"),
  };
}

export default async function ConfirmarEmail({
  searchParams,
}: PageProps<"/[lang]/area-cliente/confirmar">) {
  const { uid, token } = await searchParams;
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);

  const valido = typeof uid === "string" && typeof token === "string" && uid && token;
  let confirmada = false;

  if (valido) {
    try {
      await backendFetch("/api/auth/verify-email/", { method: "POST", body: { uid, token } });
      confirmada = true;
    } catch (erro) {
      if (!(erro instanceof BackendError)) throw erro;
    }
  }

  return (
    <AuthShell
      backToSite={t.entrar.backToSite}
      area={t.entrar.heading}
      siteHref={publicSiteHref(lang)}
    >
      <AuthSection>
        <div className="flex flex-col">
          <div className="flex w-full max-w-[448px] flex-col items-start gap-lg pt-xl">
            {confirmada ? (
              <Notice
                tone="ok"
                size="lg"
                titleAs="h1"
                title={t.confirmar.okTitle}
                description={t.confirmar.okBody}
              />
            ) : (
              <Notice
                tone="error"
                size="lg"
                titleAs="h1"
                title={t.confirmar.failTitle}
                description={t.confirmar.failBody}
              />
            )}
            <ButtonLink href="/area-cliente/entrar" size="action">
              {confirmada ? t.confirmar.okCta : t.confirmar.failCta}
            </ButtonLink>
          </div>
        </div>
      </AuthSection>
    </AuthShell>
  );
}
