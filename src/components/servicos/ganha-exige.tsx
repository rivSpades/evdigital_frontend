import { LinhaTexto, ListaTexto } from "@/components/ui/linha-texto";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

// Bloco 5+6 "O que ganha" / "O que isto exige de si" (PRD-servicos.md §4 e §5). O segundo
// painel existe deliberadamente: nunca se escreve como "desvantagens", é transparência
// sobre o compromisso (PRD-servicos.md §5).
// Nenhum serviço usa hoje `benefits`/`requires` e o .pen "A vez" não desenha o bloco: fica
// com os primitivos da ficha (registos de ds/display/linha-texto, sem cartões nem ícones),
// duas colunas em lg com gap $space-2xl, como "O que poderá incluir" da Loja online.

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
  const paineis = [
    { titulo: t.ganha, items: beneficios },
    { titulo: tratamento === "voce" ? t.exigeVoce : t.exigeVoces, items: exigencias },
  ];
  return (
    <div className="grid gap-3xl pb-3xl lg:grid-cols-2 lg:gap-2xl lg:pb-4xl">
      {paineis.map((painel) => (
        <section key={painel.titulo} className="flex flex-col gap-md lg:gap-lg">
          <h2 className="font-heading text-title font-semibold tracking-[var(--letter-spacing-title)] text-text-primary">
            {painel.titulo}
          </h2>
          <ListaTexto>
            {painel.items.map((item) => (
              <LinhaTexto key={item}>{item}</LinhaTexto>
            ))}
          </ListaTexto>
        </section>
      ))}
    </div>
  );
}
