import { cn } from "@/lib/cn";

// Espelha ds/display/linha-resumo (JKGeP) do design-system.pen (direcção "A vez"): uma linha
// do resumo do Contacto (passo 3). Régua inferior hairline $border-default (a superior é do
// contentor), padding [$space-md, 0]. Dados empilhados com gap $space-2xs: Rótulo em caption
// $letter-spacing-caption $text-tertiary e Valor em body $text-primary (em $font-mono para
// email e data; em $text-tertiary quando é "Não indicado").
// A ligação "Alterar" do .pen não passa: não tem frase no React (o Voltar do topo recua).
// Usar dentro de um <dl>.

export function LinhaResumo({
  rotulo,
  valor,
  mono = false,
  vazio = false,
}: {
  rotulo: string;
  valor: string;
  mono?: boolean;
  /** Valor em falta ("Não indicado", "Sem reunião marcada"): em $text-tertiary. */
  vazio?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2xs border-b border-border-default py-md">
      <dt className="font-body text-caption tracking-[var(--letter-spacing-caption)] text-text-tertiary">
        {rotulo}
      </dt>
      <dd
        className={cn(
          "text-body break-words whitespace-pre-line",
          mono ? "font-mono" : "font-body",
          vazio ? "text-text-tertiary" : "text-text-primary",
        )}
      >
        {valor}
      </dd>
    </div>
  );
}
