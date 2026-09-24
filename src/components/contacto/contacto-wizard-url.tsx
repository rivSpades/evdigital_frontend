"use client";

import { Suspense, type ComponentProps } from "react";
import { useSearchParams } from "next/navigation";
import { ContactoWizard } from "@/components/contacto/contacto-wizard";

// `?servico=<slug>` (CTA "Pedir uma proposta" das fichas, PRD-servicos.md §6) lido no
// cliente, para /contacto continuar estática (○/●) em vez de renderizar no servidor a cada
// pedido por causa de `searchParams`. O HTML estático leva o assistente sem pré-seleção (o
// fallback); ao hidratar, a versão com o serviço do URL substitui-o antes de qualquer
// interacção. Numa navegação no cliente o parâmetro já é conhecido e não há troca. Um slug
// desconhecido ou ausente é "sem produto pré-selecionado", nunca um erro.

type Props = Omit<ComponentProps<typeof ContactoWizard>, "servicoInicial">;

function ComServicoDoUrl(props: Props) {
  const slug = useSearchParams().get("servico");
  const servicoInicial = props.servicos.some((s) => s.slug === slug) ? slug! : undefined;
  return <ContactoWizard {...props} servicoInicial={servicoInicial} />;
}

export function ContactoWizardUrl(props: Props) {
  return (
    <Suspense fallback={<ContactoWizard {...props} />}>
      <ComServicoDoUrl {...props} />
    </Suspense>
  );
}
