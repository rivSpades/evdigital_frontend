import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// Espelha ds/display/secao-leitura (E9M0y) do design-system.pen (direcção "A vez"): uma
// secção de um texto para ler (páginas legais, corpo de artigo). Régua superior hairline
// $border-default (régua horizontal neutra entre blocos), padding-top $space-xl, gap
// $space-md.
// - Título: $font-heading $font-weight-heading $letter-spacing-title, $font-size-title-sm
//   em lg e $font-size-body-lg em mobile (override das instâncias mobile)
// - Corpo (slot, gap $space-md): parágrafos $font-body body $text-secondary. Listas usam
//   ds/display/linha-texto (ui/linha-texto.tsx), sem marcador.
// Ligações dentro do texto: $text-link sublinhadas (a cor sozinha não chega para as
// distinguir do parágrafo). Negrito em $text-primary.
//
// O título é opcional: o texto de um artigo antes do primeiro subtítulo é uma secção sem
// título.

export function SecaoLeitura({
  titulo,
  children,
  className,
}: {
  titulo?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn("flex flex-col gap-md border-t border-border-default pt-xl", className)}
    >
      {titulo ? (
        <h2 className="font-heading text-body-lg leading-[var(--line-height-title)] font-semibold tracking-[var(--letter-spacing-title)] text-text-primary lg:text-title-sm">
          {titulo}
        </h2>
      ) : null}
      <div className="flex flex-col gap-md font-body text-body text-text-secondary [&_a]:text-text-link [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-text-accent [&_strong]:font-semibold [&_strong]:text-text-primary">
        {children}
      </div>
    </section>
  );
}
