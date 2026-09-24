import type { ReactNode } from "react";

// Casca partilhada pelas páginas legais, migrada do grupo "Ecrã · Páginas legais" de
// "v2 · A vez" (flhgP) do design/design-system.pen: Privacidade (T5Uao3 desktop 1280,
// v2HO8s mobile 375) e Termos (GWOdb, K3eppJ). São textos para ler, não ecrãs de produto.
// - Secção · cabeçalho: em lg, Margem · actualização (colunas 1 a 3, padding-top
//   $space-md: rótulo caption $text-tertiary e data $font-mono caption $text-secondary) e
//   a coluna de leitura de 760 (título $font-size-display-sm, introdução body-lg). Padding
//   [$space-4xl, 0, $space-3xl, 0]. Abaixo: título ($font-size-display-sm-narrow) e
//   introdução body primeiro, a actualização depois; padding [$space-2xl, 0], gap
//   $space-md.
// - Secção · texto: as ds/display/secao-leitura na coluna de leitura (gap $space-2xl em
//   lg, $space-xl abaixo), padding-bottom $space-4xl ($space-3xl em mobile).

export function PaginaLegal({
  titulo,
  atualizadoRotulo,
  atualizadoData,
  intro,
  children,
}: {
  titulo: string;
  atualizadoRotulo: string;
  atualizadoData: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <main className="flex-1 px-lg md:px-xl lg:px-2xl">
      <div className="mx-auto w-full max-w-[var(--grid-max-width)]">
        <header className="flex flex-col gap-md py-2xl lg:grid lg:grid-cols-12 lg:gap-x-lg lg:gap-y-0 lg:pt-4xl lg:pb-3xl">
          <div className="flex flex-col gap-md lg:col-span-9 lg:col-start-4 lg:row-start-1 lg:max-w-[760px]">
            <h1 className="font-heading text-[length:var(--font-size-display-sm-narrow)] leading-[var(--line-height-display)] font-bold tracking-[var(--letter-spacing-display)] text-text-primary lg:text-display-sm">
              {titulo}
            </h1>
            <p className="font-body text-body text-text-secondary lg:text-body-lg">{intro}</p>
          </div>
          <p className="flex flex-col gap-3xs text-caption lg:col-span-3 lg:col-start-1 lg:row-start-1 lg:pt-md">
            <span className="font-body text-text-tertiary">{atualizadoRotulo}</span>
            <span className="font-mono text-text-secondary">{atualizadoData}</span>
          </p>
        </header>

        <div className="pb-3xl lg:grid lg:grid-cols-12 lg:gap-x-lg lg:pb-4xl">
          <div className="flex flex-col gap-xl lg:col-span-9 lg:col-start-4 lg:max-w-[760px] lg:gap-2xl">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}

// Subtítulo dentro do corpo de uma secção (ex. "Quando nos contacta"): body
// $font-weight-body-strong $text-primary. Não existe no .pen (o .pen só desenha um grupo
// de dados); vem da estrutura do texto no React.
export function SubtituloLegal({ children }: { children: string }) {
  return <h3 className="font-body text-body font-semibold text-text-primary">{children}</h3>;
}
