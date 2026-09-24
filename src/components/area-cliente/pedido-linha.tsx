import { RegistoLinha } from "@/components/ui/registo-linha";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatarDataCurta, pedidoStatus, referenciaPedido } from "@/lib/area-cliente/format";
import { pedidoTom } from "@/lib/area-cliente/tons";
import type { PedidoResumo } from "@/lib/area-cliente/types";

// Um pedido como linha de registo (ds/display/registo-linha, variante "pedido"): a mesma
// linha em "Os seus projetos", no detalhe de um projeto e na lista "Os seus pedidos"
// (antes eram três cópias do mesmo markup). `tipo` é o texto que segue o nome (ex. "Projeto
// novo" nos pedidos de projeto, ou o tipo e o projeto na lista completa).

export function PedidoLinha({
  pedido,
  lang,
  t,
  tipo,
}: {
  pedido: PedidoResumo;
  lang: Locale;
  t: Dictionary["areaCliente"];
  tipo?: string;
}) {
  return (
    <RegistoLinha
      variante="pedido"
      href={`/area-cliente/pedidos/${pedido.id}`}
      referencia={referenciaPedido(pedido.id)}
      nome={pedido.title}
      tipo={tipo}
      estado={pedidoStatus(t, pedido.status, pedido.status_label).label}
      estadoTom={pedidoTom(pedido.status)}
      data={formatarDataCurta(lang, pedido.created_at)}
    />
  );
}
