"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { ErroAcoes } from "@/components/erros/erro-acoes";
import { textosDeErro } from "@/components/erros/textos-cliente";
import { Notice } from "@/components/ui/notice";

// Erro ao carregar uma página autenticada da Área de Cliente (frames "Erro · ao carregar"
// FOXBV / Za1BA do design-system.pen). Vive dentro do layout (conta): a barra de topo da
// conta continua visível e só o conteúdo dá lugar ao aviso. Erros no próprio layout (ex.
// backend em baixo ao validar a sessão) caem em area-cliente/error.tsx.

export default function ErroConta({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const { lang } = useParams<{ lang?: string }>();
  const { common, erros } = textosDeErro(lang);

  useEffect(() => {
    console.error("Erro na Área de Cliente", error.digest ?? "");
  }, [error]);

  return (
    <main className="flex flex-1 flex-col px-lg md:px-xl lg:px-2xl">
      <section className="flex w-full max-w-[640px] flex-col gap-lg pt-2xl pb-3xl">
        <Notice
          tone="error"
          titleAs="h1"
          title={erros.pagina.loadTitle}
          description={erros.pagina.loadBody}
        />
        <ErroAcoes retry={retry} retryLabel={erros.pagina.retry} contactLabel={common.cta} />
      </section>
    </main>
  );
}
