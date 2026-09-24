"use client";

import { Suspense, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";

// Filtro por nível da listagem do blog (`?nivel=simples|tecnico`) lido no cliente, para
// /blog continuar estática (●) em vez de renderizar no servidor a cada pedido por causa de
// `searchParams`. O servidor já renderizou as três variantes (poucos artigos, conteúdo
// curto); aqui só se escolhe qual mostrar. O HTML estático leva "todos" (o fallback): a
// listagem filtrada não precisa de ser indexada e o canonical é sempre /blog.

export type NivelBlog = "todos" | "simples" | "tecnico";

function Escolha({ variantes }: { variantes: Record<NivelBlog, ReactNode> }) {
  const nivel = useSearchParams().get("nivel");
  return variantes[nivel === "simples" || nivel === "tecnico" ? nivel : "todos"];
}

export function PorNivel({ variantes }: { variantes: Record<NivelBlog, ReactNode> }) {
  return (
    <Suspense fallback={variantes.todos}>
      <Escolha variantes={variantes} />
    </Suspense>
  );
}
