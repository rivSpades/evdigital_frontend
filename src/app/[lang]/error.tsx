"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { FooterView } from "@/components/layout/footer-view";
import { NavMenu } from "@/components/layout/nav-menu";
import { navStrings } from "@/components/layout/nav-strings";
import { ErroAcoes } from "@/components/erros/erro-acoes";
import { textosDeErro } from "@/components/erros/textos-cliente";

// Erro inesperado numa página do site (frames "Erro · página (error.tsx)" nXCun / pfA9J do
// design-system.pen). Client Component (regra do Next para error boundaries): as strings
// vêm de `textosDeErro`, no idioma da rota. "Tentar outra vez" chama `retry()`, que volta a
// pedir e a renderizar o segmento (o `reset()` só re-renderiza, e um erro vindo do
// servidor repetia-se igual).

export default function ErroPagina({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const { lang } = useParams<{ lang?: string }>();
  const { common, erros } = textosDeErro(lang);

  useEffect(() => {
    // Só o digest: a mensagem pode trazer detalhes do servidor.
    console.error("Erro na página", error.digest ?? "");
  }, [error]);

  return (
    <>
      <NavMenu strings={navStrings(common)} />
      <main className="flex flex-1 flex-col px-lg md:px-xl lg:px-2xl">
        <section className="flex flex-col pt-3xl pb-2xl">
          <h1 className="font-heading text-headline leading-[var(--line-height-display)] font-bold tracking-[var(--letter-spacing-display)] text-text-primary lg:text-display">
            {erros.pagina.title}
          </h1>
          <p className="max-w-[600px] pt-lg font-body text-body-lg text-text-secondary">
            {erros.pagina.body}
          </p>
        </section>
        <section className="flex flex-col pt-md pb-3xl">
          <ErroAcoes retry={retry} retryLabel={erros.pagina.retry} contactLabel={common.cta} />
        </section>
      </main>
      <FooterView t={common} />
    </>
  );
}
