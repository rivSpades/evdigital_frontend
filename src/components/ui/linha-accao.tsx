import { Download } from "lucide-react";

// Linha clicável no fim do registo «Salário esperado» (ex. «Descarregar CV»). Mesma métrica
// de ds/display/linha-salario (BTsCY): régua $border-default em baixo, padding [$space-md, 0],
// gap $space-lg; rótulo à esquerda em $text-primary (label, peso de label) e ícone de download
// à direita. A linha inteira é a ligação (`<a download>` para o route handler do PDF, não uma
// navegação do Next), com alvo de toque >= 44 de altura.

export function LinhaAccao({ href, rotulo }: { href: string; rotulo: string }) {
  return (
    <div className="border-b border-border-default">
      <a
        href={href}
        download
        className="group flex min-h-11 items-center justify-between gap-lg py-md font-body text-label font-medium text-text-primary transition-colors hover:text-text-secondary"
      >
        <span>{rotulo}</span>
        <Download aria-hidden className="size-5 shrink-0" strokeWidth={1.5} />
      </a>
    </div>
  );
}
