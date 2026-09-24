import { Ligacao } from "@/components/ui/ligacao";
import { cn } from "@/lib/cn";

// Espelha ds/display/artigo-linha (tDfAf) do design-system.pen (direcção "A vez", Blog): um
// artigo como linha de registo, não cartão. Régua inferior hairline $border-default (a
// superior é do contentor Registo), padding [$space-lg, 0], gap $space-xs.
// - Meta (gap $space-sm): Nível em caption $text-secondary, só a palavra ("nível:
//   simples"), sem ícone nem etiqueta de cor; Data e tempo de leitura em $font-mono caption
//   $text-tertiary. Abaixo de lg a leitura encurta para "N min" (override mobile).
// - Título: $font-heading $font-weight-heading $font-size-title-sm $text-primary
// - Descrição: $font-body body $text-secondary
// - Ligação "Ler artigo": ds/action/ligacao "acao"
// Variantes (overrides): normal | destaque (o primeiro artigo da lista: Título em
// $font-size-title e Descrição em body-lg, só em lg) | relacionado (Título em body-lg).

export type ArtigoLinhaVariante = "normal" | "destaque" | "relacionado";

export function ArtigoLinha({
  nivel,
  data,
  leituraCurta,
  leituraLonga,
  titulo,
  tituloAs: Titulo = "h2",
  descricao,
  href,
  ligacao,
  variante = "normal",
}: {
  nivel: string;
  data: string;
  leituraCurta: string;
  leituraLonga: string;
  titulo: string;
  tituloAs?: "h2" | "h3";
  descricao: string;
  href: string;
  ligacao: string;
  variante?: ArtigoLinhaVariante;
}) {
  return (
    <li className="flex flex-col gap-xs border-b border-border-default py-lg">
      <div className="flex flex-wrap items-center gap-x-sm gap-y-2xs">
        <p className="font-body text-caption tracking-[var(--letter-spacing-caption)] text-text-secondary">
          {nivel}
        </p>
        <p className="font-mono text-caption text-text-tertiary">
          {data} · <span className="lg:hidden">{leituraCurta}</span>
          <span className="hidden lg:inline">{leituraLonga}</span>
        </p>
      </div>
      <Titulo
        className={cn(
          "font-heading leading-[var(--line-height-title)] font-semibold tracking-[var(--letter-spacing-title)] text-text-primary",
          variante === "relacionado" && "text-body-lg",
          variante === "normal" && "text-title-sm",
          variante === "destaque" && "text-title-sm lg:text-title",
        )}
      >
        {titulo}
      </Titulo>
      <p
        className={cn(
          "font-body text-body text-text-secondary",
          variante === "destaque" && "lg:text-body-lg",
        )}
      >
        {descricao}
      </p>
      <Ligacao href={href} variant="acao" aria-label={`${ligacao}: ${titulo}`}>
        {ligacao}
      </Ligacao>
    </li>
  );
}
