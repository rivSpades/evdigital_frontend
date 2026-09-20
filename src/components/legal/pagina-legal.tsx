import type { ReactNode } from "react";

// Casca partilhada pelas páginas legais (privacidade, termos). Coluna de leitura
// estreita e blocos com título, seguindo o padrão do artigo de blog: são textos
// para ler, não ecrãs de produto.

export function PaginaLegal({
  titulo,
  atualizado,
  intro,
  children,
}: {
  titulo: string;
  atualizado: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <main className="flex-1 px-lg py-3xl md:px-xl lg:px-2xl lg:py-4xl">
      <div className="mx-auto flex w-full max-w-[760px] flex-col gap-3xl">
        <header className="flex flex-col gap-md">
          <h1 className="font-heading text-headline font-bold tracking-[var(--letter-spacing-headline)] text-text-primary lg:text-display-sm">
            {titulo}
          </h1>
          <p className="font-body text-body-lg text-text-secondary">{intro}</p>
          <p className="font-body text-caption text-text-tertiary">
            {atualizado}
          </p>
        </header>

        <div className="flex flex-col gap-2xl">{children}</div>
      </div>
    </main>
  );
}

export function Acordeao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-md border-t border-border-subtle pt-xl">
      <h2 className="font-heading text-title-sm font-semibold text-text-primary">
        {titulo}
      </h2>
      <div className="flex flex-col gap-md font-body text-body leading-[var(--line-height-body)] text-text-secondary [&_a]:text-text-link [&_li]:ml-lg [&_li]:list-disc [&_strong]:text-text-primary [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2xs">
        {children}
      </div>
    </section>
  );
}
