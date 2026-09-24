import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";

// Espelha ds/display/regua-passo (I6ArVE) do design-system.pen (direcção "A vez"): um
// passo da régua de "Como trabalhamos". Marca da régua (traço de 1 x $space-md
// $border-strong, centrado na régua superior: top -$space-xs) + Título ($font-body label,
// $font-weight-body-strong, $text-primary) + Texto ($font-body body, $text-secondary),
// gap $space-2xs.
//
// Padding [$space-lg, $space-md, $space-md, 0] na régua horizontal (lg). Empilhado
// (instância mobile): [$space-lg, 0, $space-md, 0] e divisor inferior hairline
// $border-default. A régua superior ($border-strong) é do contentor (<ol>).
//
// Cada passo é um grupo de entrada próprio (`Reveal`, li): a marca entra primeiro e o
// texto a seguir. `passo` (0 a 3) dá a posição na sequência da régua em desktop.
// `estatico`: um <li> simples, sem grupo de entrada (páginas sem scroll reveal, ex. a
// ficha de serviço).

const passoClasses = ["[--ruler-k:0]", "[--ruler-k:1]", "[--ruler-k:2]", "[--ruler-k:3]"];

export function ReguaPasso({
  titulo,
  texto,
  passo,
  estatico = false,
  className,
}: {
  titulo?: string;
  texto: string;
  passo: number;
  estatico?: boolean;
  className?: string;
}) {
  const classes = cn(
        "relative flex flex-col border-b border-border-default pt-lg pb-md",
        "lg:flex-1 lg:border-b-0 lg:pr-md",
        passoClasses[Math.min(passo, passoClasses.length - 1)],
        className,
      );
  if (estatico) {
    return (
      <li className={classes}>
        <span aria-hidden className="absolute -top-xs left-0 h-md w-px bg-border-strong" />
        <div className="flex flex-col gap-2xs">
          {titulo ? (
            <h3 className="font-body text-label font-semibold text-text-primary">{titulo}</h3>
          ) : null}
          <p className="font-body text-body text-text-secondary">{texto}</p>
        </div>
      </li>
    );
  }
  return (
    <Reveal as="li" data-ruler-step="" className={classes}>
      <span
        aria-hidden
        data-reveal="mark"
        className="absolute -top-xs left-0 h-md w-px bg-border-strong"
      />
      <div data-reveal="" className="flex flex-col gap-2xs">
        {titulo ? (
          <h3 className="font-body text-label font-semibold text-text-primary">{titulo}</h3>
        ) : null}
        <p className="font-body text-body text-text-secondary">{texto}</p>
      </div>
    </Reveal>
  );
}
