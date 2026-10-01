"use client";

import { useSyncExternalStore } from "react";

// Estado «assistente aberto», partilhado entre a entrada na barra de topo (`NavMenu`), o
// painel e o «Voltar ao topo» (que se desvia da coluna em lg+). Vive no módulo, por isso
// sobrevive às navegações do cliente (o layout de [lang] não remonta).

let aberto = false;
const ouvintes = new Set<() => void>();

export function definirAssistenteAberto(valor: boolean) {
  if (aberto === valor) return;
  aberto = valor;
  ouvintes.forEach((ouvinte) => ouvinte());
}

export function useAssistenteAberto(): boolean {
  return useSyncExternalStore(
    (ouvinte) => {
      ouvintes.add(ouvinte);
      return () => ouvintes.delete(ouvinte);
    },
    () => aberto,
    () => false,
  );
}

/** Páginas onde o assistente não existe (já têm o seu próprio formulário de contacto). */
export function semAssistente(caminho: string | undefined): boolean {
  return (
    !!caminho && (caminho.startsWith("/area-cliente") || caminho.split("/").includes("contacto"))
  );
}
