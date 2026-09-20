import type { Metadata } from "next";
import { CheckCircle2, XCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { getLocale, getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";
import { BackendError, backendFetch } from "@/lib/area-cliente/backend";

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
  const { areaCliente: t } = await getDictionary();

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
    <div className="flex min-h-screen flex-col items-center justify-center gap-lg bg-bg-base px-lg text-center">
      {confirmada ? (
        <>
          <CheckCircle2 size={48} strokeWidth={2} aria-hidden className="text-feedback-success-fg" />
          <div className="flex flex-col gap-xs">
            <h1 className="font-heading text-title font-semibold text-text-primary">
              {t.confirmar.okTitle}
            </h1>
            <p className="font-body text-body text-text-secondary">
              {t.confirmar.okBody}
            </p>
          </div>
          <ButtonLink href="/area-cliente/entrar" size="lg">
            {t.confirmar.okCta}
          </ButtonLink>
        </>
      ) : (
        <>
          <XCircle size={48} strokeWidth={2} aria-hidden className="text-feedback-error-fg" />
          <div className="flex flex-col gap-xs">
            <h1 className="font-heading text-title font-semibold text-text-primary">
              {t.confirmar.failTitle}
            </h1>
            <p className="font-body text-body text-text-secondary">
              {t.confirmar.failBody}
            </p>
          </div>
          <ButtonLink href="/area-cliente/entrar" size="lg">
            {t.confirmar.failCta}
          </ButtonLink>
        </>
      )}
    </div>
  );
}
