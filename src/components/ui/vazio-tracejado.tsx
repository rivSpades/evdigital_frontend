import { cn } from "@/lib/cn";

// Estado vazio (blog sem artigos, conversa do pedido sem mensagens, lista de pedidos sem
// resultados). Nasceu de ds/feedback/vazio-tracejado (l33i67) do design-system.pen, uma
// caixa tracejada nos quatro lados; pela regra "sem cartões com contorno para blocos de
// conteúdo" (design-guardrails.md §4) passou a bloco aberto: régua horizontal neutra em
// cima (hairline $border-default), espaço $space-lg por cima e por baixo do texto, sem
// contorno nem padding lateral (o texto alinha com o resto da coluna). Texto $font-body
// body $text-secondary. Altura mínima de 80 (instâncias do blog vazio). O nome ficou por
// compatibilidade com o .pen.

export function VazioTracejado({ children, className }: { children: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex min-h-20 w-full flex-col justify-center border-t border-border-default py-lg",
        className,
      )}
    >
      <p className="font-body text-body text-text-secondary">{children}</p>
    </div>
  );
}
