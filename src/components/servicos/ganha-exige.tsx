import { ArrowUpRight, CircleDot } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

// Bloco 5+6 "O que ganha" / "O que isto exige de si" (PRD-servicos.md §4 e §5).
// O segundo painel existe deliberadamente: nunca se escreve como "desvantagens" — é o
// mesmo conteúdo enquadrado como transparência sobre o compromisso, não como aviso
// contra a compra (PRD-servicos.md §5).

function Painel({
  titulo,
  items,
  tom,
}: {
  titulo: string;
  items: string[];
  tom: "ganha" | "exige";
}) {
  const Icone = tom === "ganha" ? ArrowUpRight : CircleDot;
  return (
    <Card
      surface={tom === "exige" ? "raised" : "default"}
      className="flex flex-1 flex-col gap-lg p-lg lg:p-xl"
    >
      <h3 className="font-heading text-title font-semibold tracking-[var(--letter-spacing-title)] text-text-primary">
        {titulo}
      </h3>
      <ul className="flex flex-col gap-md">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-sm">
            <Icone
              size={22}
              strokeWidth={2}
              aria-hidden
              className={
                tom === "ganha" ? "mt-0.5 shrink-0 text-text-accent" : "mt-0.5 shrink-0 text-text-tertiary"
              }
            />
            <span className="font-body text-body text-text-secondary">{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export async function GanhaExige({
  lang,
  beneficios,
  exigencias,
  tratamento,
}: {
  lang: Locale;
  beneficios: string[];
  exigencias: string[];
  tratamento: "voce" | "voces";
}) {
  const t = (await getDictionary(lang)).servicos.ganhaExige;
  return (
    <div className="grid gap-lg lg:grid-cols-2 lg:items-start lg:gap-xl">
      <Painel titulo={t.ganha} items={beneficios} tom="ganha" />
      <Painel
        titulo={tratamento === "voce" ? t.exigeVoce : t.exigeVoces}
        items={exigencias}
        tom="exige"
      />
    </div>
  );
}
