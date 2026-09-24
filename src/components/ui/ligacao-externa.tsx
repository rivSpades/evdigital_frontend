import { cn } from "@/lib/cn";

// Instância de ds/action/ligacao (U2U6FY) com o override do host de um projeto: rótulo em
// $font-mono caption (ex. "app.evplanner.eu"), alvo de 44 de altura, sem sublinhado nem
// marcador. Separada de `Ligacao` porque aponta para fora do site: <a> com nova janela,
// sem prefixo de idioma.
// Tons (override do Rótulo no .pen): discreta ($text-secondary; listagem de projetos) |
// link ($text-link; "Ver o projeto" na ficha).

export function LigacaoExterna({
  href,
  children,
  tom = "discreta",
  className,
}: {
  href: string;
  children: string;
  tom?: "discreta" | "link";
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex min-h-11 w-fit items-center font-mono text-caption break-all transition-colors",
        tom === "link"
          ? "text-text-link hover:text-text-accent"
          : "text-text-secondary hover:text-text-primary",
        className,
      )}
    >
      {children}
    </a>
  );
}
