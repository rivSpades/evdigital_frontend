import { notFound } from "next/navigation";
import { getLocale } from "@/i18n/dictionaries";
import { getProjeto, naoExiste } from "@/lib/area-cliente/dados";
import { requireSession } from "@/lib/area-cliente/session";

// Projeto inexistente (ou de outra conta, a que o backend também responde 404): o
// `notFound()` tem de acontecer ANTES do loading.tsx deste segmento. Com o esqueleto já
// enviado a resposta está em streaming com HTTP 200 e o Next só consegue injetar
// <meta name="robots" content="noindex"> (node_modules/next/dist/docs/01-app/02-guides/
// streaming.md, "The HTTP contract"). O layout fica fora do Suspense do loading.tsx, por
// isso aqui o 404 ainda chega ao status. A leitura é a mesma da página (`cache` do React):
// o backend só é chamado uma vez por pedido. O ecrã é o de (conta)/not-found.tsx.
//
// Pela mesma razão a lista (page + loading) vive no grupo `(lista)`: um loading.tsx em
// projetos/ envolveria também este segmento.

export default async function ProjetoDetalheLayout({
  children,
  params,
}: LayoutProps<"/[lang]/area-cliente/projetos/[id]">) {
  const { id } = await params;
  const { token } = await requireSession(await getLocale());
  if (await naoExiste(getProjeto(token, id))) notFound();
  return children;
}
