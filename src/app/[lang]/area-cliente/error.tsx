"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { AuthShell } from "@/components/area-cliente/auth-shell";
import { useSiteHref } from "@/components/area-cliente/site-href";
import { ErroAcoes } from "@/components/erros/erro-acoes";
import { textosDeErro } from "@/components/erros/textos-cliente";
import { Notice } from "@/components/ui/notice";

// Erro ao carregar uma página da Área de Cliente (frames "Erro · ao carregar" FOXBV /
// Za1BA do design-system.pen): aviso de erro "Não foi possível carregar os seus dados."
// com a garantia de que os dados continuam guardados, "Tentar outra vez" (retry(), volta a
// pedir o segmento ao servidor) e "Fale connosco". Apanha os erros das páginas de
// autenticação e do próprio layout (conta) (ex. backend em baixo ao validar a sessão); os
// das páginas autenticadas ficam em (conta)/error.tsx, com a barra de topo. Aqui não há
// barra de topo da conta (precisa da sessão): fica o cabeçalho de autenticação.

export default function ErroAreaCliente({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const { lang } = useParams<{ lang?: string }>();
  const { common, erros } = textosDeErro(lang);
  const siteHref = useSiteHref();

  useEffect(() => {
    console.error("Erro na Área de Cliente", error.digest ?? "");
  }, [error]);

  return (
    <AuthShell siteHref={siteHref}>
      <section className="flex w-full max-w-[640px] flex-col gap-lg pt-2xl pb-3xl">
        <Notice
          tone="error"
          titleAs="h1"
          title={erros.pagina.loadTitle}
          description={erros.pagina.loadBody}
        />
        <ErroAcoes retry={retry} retryLabel={erros.pagina.retry} contactLabel={common.cta} />
      </section>
    </AuthShell>
  );
}
