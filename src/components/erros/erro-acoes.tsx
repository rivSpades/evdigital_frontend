import { Button } from "@/components/ui/button";
import { Ligacao } from "@/components/ui/ligacao";

// Acções dos ecrãs de erro (frames nXCun / FOXBV do design-system.pen): "Tentar outra vez"
// (botão outline de 56, ds/action/button) e "Fale connosco" (ds/action/ligacao primária
// com o mesmo alvo de 56 e inset $space-sm). Gap $space-sm.

export function ErroAcoes({
  retry,
  retryLabel,
  contactLabel,
}: {
  retry: () => void;
  retryLabel: string;
  contactLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-sm">
      <Button variant="outline" size="action" onClick={retry}>
        {retryLabel}
      </Button>
      <Ligacao href="/contacto" className="h-14 px-sm">
        {contactLabel}
      </Ligacao>
    </div>
  );
}
