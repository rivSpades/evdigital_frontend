import type { Ref } from "react";
import { cn } from "@/lib/cn";

// Espelha ds/display/cabecalho-passo (XbXGN) do design-system.pen (direcção "A vez"):
// título em Sora com subtítulo opcional em $font-body $text-secondary, empilhados, gap
// $space-xs. Nos ecrãs de conta o título é o da página (h1) em $font-size-headline
// ($font-size-headline-narrow em mobile, 31 = --text-title com a entrelinha de headline).
// Não é eyebrow nem split-header.
//
// `tamanho="passo"`: o master tal e qual, título de um passo de um assistente (Contacto):
// $font-size-title com a entrelinha e o espaçamento de title em lg, e $font-size-title-sm
// abaixo de lg (override dos frames mobile). Largura da coluna (sem o máximo de 560).
// `titleRef` + tabIndex -1: o título recebe o foco por programa ao mudar de passo.

export function CabecalhoPasso({
  title,
  subtitle,
  as: Title = "h1",
  tamanho = "pagina",
  titleRef,
  className,
}: {
  title: string;
  subtitle?: string;
  as?: "h1" | "h2";
  tamanho?: "pagina" | "passo";
  titleRef?: Ref<HTMLHeadingElement>;
  className?: string;
}) {
  const passo = tamanho === "passo";
  const focavel = titleRef !== undefined;
  return (
    <div
      className={cn("flex w-full flex-col gap-xs", passo ? undefined : "max-w-[560px]", className)}
    >
      <Title
        ref={titleRef}
        tabIndex={focavel ? -1 : undefined}
        className={cn(
          "font-heading font-semibold text-text-primary",
          passo
            ? "text-title-sm leading-[var(--line-height-title)] tracking-[var(--letter-spacing-title)] lg:text-title"
            : "text-title leading-[var(--line-height-headline)] tracking-[var(--letter-spacing-headline)] md:text-headline",
          // Foco por programa só para orientar leitores de ecrã: não é um controlo.
          focavel && "outline-none!",
        )}
      >
        {title}
      </Title>
      {subtitle ? <p className="font-body text-body text-text-secondary">{subtitle}</p> : null}
    </div>
  );
}
