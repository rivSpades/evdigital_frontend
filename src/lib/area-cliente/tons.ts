import type { EstadoTextoTom } from "@/components/ui/estado-texto";
import type { Projeto } from "@/lib/area-cliente/types";

// Tom da palavra de estado (ds/display/estado-texto) por estado de pedido e de projeto,
// num só sítio (antes havia quatro cópias de TOM/PEDIDO_TOM e duas de PROJETO_TOM, uma
// por página). Valores das instâncias dos ecrãs "Os seus projetos" e "Detalhe do pedido"
// do design-system.pen: "Recebido" em $text-secondary, "Não avança" e "Em pausa" em
// $text-tertiary, o resto em $text-primary; "À espera de si" (a resposta é do cliente)
// distingue-se pelo peso, sem cor de marca.

export function pedidoTom(status: string): EstadoTextoTom {
  if (status === "informacao_necessaria") return "destaque";
  if (status === "submetido") return "secundario";
  if (status === "recusado") return "terciario";
  return "primario";
}

/** O pedido espera uma resposta do cliente (bloco da vez "sua", botão Responder). */
export function pedidoEsperaCliente(status: string): boolean {
  return status === "informacao_necessaria";
}

export function projetoTom(status: Projeto["status"]): EstadoTextoTom {
  return status === "em_pausa" ? "terciario" : "primario";
}
