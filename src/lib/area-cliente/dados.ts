import { cache } from "react";
import { BackendError, backendFetch } from "@/lib/area-cliente/backend";
import type { PedidoDetalhe, Projeto } from "@/lib/area-cliente/types";

// Leituras de detalhe partilhadas entre `generateMetadata` e a página no mesmo pedido
// (`cache` do React): o título da página depende de o recurso existir (404 → título do
// 404, nunca "Detalhe do pedido"), e a página não volta a pedir o mesmo ao backend.
// Server-only, como `backend.ts`.

export const getPedidoDetalhe = cache((token: string, id: string) =>
  backendFetch<PedidoDetalhe>(`/api/me/requests/${id}/`, { token }),
);

export const getProjeto = cache((token: string, id: string) =>
  backendFetch<Projeto>(`/api/me/projects/${id}/`, { token }),
);

/** `true` se a leitura falhar com 404 (recurso inexistente ou de outra conta). */
export async function naoExiste(leitura: Promise<unknown>): Promise<boolean> {
  try {
    await leitura;
    return false;
  } catch (erro) {
    return erro instanceof BackendError && erro.status === 404;
  }
}
