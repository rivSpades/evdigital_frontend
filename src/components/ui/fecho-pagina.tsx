import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

// Espelha ds/layout/fecho-pagina (nbPVA) do design-system.pen (direcção "A vez"): o fecho
// de uma página pública com a acção única. Aberto: sem fundo, sem contorno, sem caixa (não
// é banda de CTA nem cartão). Vertical, gap $space-md, padding [$space-2xl, 0].
// - Título (opcional; desliga-se quando o React só tem texto): $font-heading
//   $font-weight-heading $font-size-title ($font-size-title-sm em mobile)
// - Texto: $font-body body-lg $text-secondary (body em mobile)
// - Acções: padding-top $space-xs, botão primário de 56 ($button-height-lg) com rótulo em
//   $font-weight-label / $letter-spacing-label; a toda a largura em mobile.
// A coluna (4 a 12 em lg) é do contentor da página.
// `compactoMobile` (override da página Serviços em mobile, nó IVvUk): sem padding vertical
// abaixo de lg e o botão com a largura do rótulo.
// `stickyMobile` (ficha de serviço, decisão do dono 2026-09-28: uma só CTA por página, só no
// fecho): abaixo de md o botão fica colado ao fundo do ecrã enquanto o fecho está por vir,
// título e texto continuam em fluxo normal (mesmo padrão de components/ui/folha.tsx e do
// fecho de /consultants/[slug]). `data-barra-fixa` avisa o scroll-to-top para subir acima
// da barra.

export function FechoPagina({
  titulo,
  tituloId,
  texto,
  acao,
  href,
  compactoMobile = false,
  stickyMobile = false,
  className,
}: {
  titulo?: string;
  tituloId?: string;
  texto: string;
  acao: string;
  href: string;
  compactoMobile?: boolean;
  stickyMobile?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-md", compactoMobile ? "lg:py-2xl" : "py-2xl", className)}>
      {titulo ? (
        <h2
          id={tituloId}
          className="font-heading text-title-sm font-semibold tracking-[var(--letter-spacing-title)] text-text-primary lg:text-title"
        >
          {titulo}
        </h2>
      ) : null}
      <p className="font-body text-body text-text-secondary lg:text-body-lg">{texto}</p>
      <div
        data-barra-fixa={stickyMobile || undefined}
        className={cn(
          "flex pt-xs",
          stickyMobile &&
            "max-md:sticky max-md:bottom-0 max-md:z-10 max-md:-mx-lg max-md:border-t max-md:border-border-default max-md:bg-bg-base max-md:px-lg max-md:py-md max-md:pb-[calc(var(--spacing-md)+env(safe-area-inset-bottom))]",
        )}
      >
        <ButtonLink
          href={href}
          size="action"
          className={cn(
            "tracking-[var(--letter-spacing-label)]",
            !compactoMobile && "w-full md:w-auto",
          )}
        >
          {acao}
        </ButtonLink>
      </div>
    </div>
  );
}
