import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// Espelha ds/layout/bloco-da-vez (jQLmm) e ds/layout/bloco-da-vez--mobile (ksQyI) do
// design-system.pen (direcção "A vez"): superfície aberta, sem fundo e sem caixa (decisão
// do dono, 2026-09-24: "não gosto dos cartões com borda"; o .pen foi corrigido no mesmo
// sentido): só uma régua horizontal neutra por cima ($border-default), sem padding lateral,
// padding vertical $space-lg em mobile e $space-xl a partir de md ($space-2xl na variante
// `lado` em lg), gap $space-sm.
// Diz que alguém age a seguir (ex. "veja o seu email"). No máximo um por ecrã e nunca com
// campos dentro: onde se escreve é a ds/layout/folha.
//
// Anatomia: Facto (caption, ex. o email ou "Código de erro 404"), Frase ($font-size-title
// Sora), Texto (body $text-secondary) e, opcional, uma nota ou os controlos. O rótulo de
// "vez" do conceito não passa para o código (decisão do dono, 2026-09-24): o facto diz-se
// sozinho, sem palavra de cor nem marcador antes.
//
// `reveal` (só na Início, dentro de um grupo `Reveal`): a régua aparece primeiro, só
// com opacidade; depois o facto e a frase, pela ordem de leitura (storyboard, quadro 06).
// Os controlos passados em `children` marcam-se no sítio com o índice seguinte.
//
// Variantes da Área de Cliente (instâncias dos ecrãs "Os seus projetos" e "Detalhe do
// pedido"):
// - `lado`: o master de 1280 (jQLmm) tal e qual: em lg o Facto é uma coluna de 278 à
//   esquerda do Corpo, gap $space-layout-gutter-wide, padding vertical $space-2xl.
//   Abaixo de lg é o --mobile (empilhado).
// - `frase="display"`: a Frase do estado actual do pedido, $font-size-display com
//   $font-weight-display, entrelinha e espaçamento de display em lg, e
//   $font-size-display-sm-narrow (39) com o espaçamento de headline em mobile.
// - `fraseTom="secundario"`: a Frase em $text-secondary (o pedido está do lado da equipa).
// - `acao`: o controlo à direita dos textos em lg (Extra dos projetos, alinhado ao centro)
//   e por baixo, com padding-top $space-xs, em mobile.

export function BlocoDaVez({
  fact,
  title,
  titleAs: Title = "p",
  titleId,
  reveal = false,
  lado = false,
  frase = "normal",
  fraseTom = "primario",
  acao,
  children,
  className,
}: {
  fact?: ReactNode;
  title: string;
  titleAs?: "h1" | "h2" | "p";
  titleId?: string;
  reveal?: boolean;
  lado?: boolean;
  frase?: "normal" | "display";
  fraseTom?: "primario" | "secundario";
  acao?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  const corpo = (
    <div className="flex flex-col gap-sm">
      <Title
        id={titleId}
        data-reveal={reveal ? "" : undefined}
        className={cn(
          "font-heading",
          frase === "display"
            ? "text-headline leading-[var(--line-height-display)] font-bold tracking-[var(--letter-spacing-headline)] lg:text-display lg:tracking-[var(--letter-spacing-display)]"
            : "text-title-sm font-semibold tracking-[var(--letter-spacing-title)] md:text-title",
          fraseTom === "secundario" ? "text-text-secondary" : "text-text-primary",
          fact ? "[--reveal-i:2]" : "[--reveal-i:1]",
        )}
      >
        {title}
      </Title>
      {children}
    </div>
  );

  return (
    <div
      data-reveal={reveal ? "outline" : undefined}
      className={cn(
        "flex w-full flex-col gap-sm rounded-[var(--radius-none)] border-t border-border-default",
        lado
          ? "py-lg md:py-xl lg:flex-row lg:gap-[var(--space-layout-gutter-wide)] lg:py-2xl"
          : "py-lg md:py-xl",
        className,
      )}
    >
      {fact ? (
        typeof fact === "string" ? (
          <p
            data-reveal={reveal ? "" : undefined}
            className={cn(
              "font-body text-caption tracking-[var(--letter-spacing-caption)] break-all text-text-secondary [--reveal-i:1]",
              lado && "lg:w-[278px] lg:shrink-0 lg:pt-2xs",
            )}
          >
            {fact}
          </p>
        ) : (
          <div
            className={cn(
              "flex flex-col gap-2xs",
              lado && "lg:w-[278px] lg:shrink-0 lg:pt-2xs",
            )}
          >
            {fact}
          </div>
        )
      ) : null}
      {acao ? (
        <div className="flex min-w-0 flex-1 flex-col gap-sm lg:flex-row lg:items-center lg:gap-lg">
          <div className="min-w-0 flex-1">{corpo}</div>
          <div className="flex pt-xs lg:pt-0">{acao}</div>
        </div>
      ) : lado ? (
        <div className="min-w-0 flex-1">{corpo}</div>
      ) : (
        corpo
      )}
    </div>
  );
}
