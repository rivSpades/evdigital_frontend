import { Ligacao } from "@/components/ui/ligacao";
import { VazioTracejado } from "@/components/ui/vazio-tracejado";
import { getDictionary } from "@/i18n/dictionaries";

// Frames "v2 · A vez" / Ecrã · Blog: "Secção · sem artigos" (xV2O2 desktop 1280, jdOuF
// mobile 375). É o estado real do lançamento: content/blog/ está vazio por decisão de
// privacidade (PRD §4.3), por isso não é um erro, é a página tal como existe hoje.
// ds/feedback/vazio-tracejado (704 de largura em lg) e a ds/action/ligacao "acao" para os
// serviços, gap $space-sm.

export async function BlogEmptyState() {
  const { blog: t } = await getDictionary();

  return (
    <div className="flex flex-col gap-sm lg:max-w-[704px]">
      <VazioTracejado>{t.emptyTitle}</VazioTracejado>
      <Ligacao href="/servicos" variant="acao">
        {t.emptyCta}
      </Ligacao>
    </div>
  );
}
