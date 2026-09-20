import { Check } from "lucide-react";

// Bloco 4 "O que está incluído" (PRD-servicos.md §4): lista em duas colunas no
// desktop, uma em mobile, tal como o frame "Secção · O que está incluído" da ficha da
// Loja online no design-system.pen.

export function ListaVerificada({ items }: { items: string[] }) {
  const meio = Math.ceil(items.length / 2);
  const colunas = [items.slice(0, meio), items.slice(meio)].filter((c) => c.length > 0);

  return (
    <div className="grid gap-lg lg:grid-cols-2 lg:gap-2xl">
      {colunas.map((coluna, i) => (
        <ul key={i} className="flex flex-col gap-md">
          {coluna.map((item) => (
            <li key={item} className="flex items-start gap-sm">
              <Check
                size={24}
                strokeWidth={2}
                aria-hidden
                className="mt-0.5 shrink-0 text-text-accent"
              />
              <span className="font-body text-body text-text-secondary">{item}</span>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
