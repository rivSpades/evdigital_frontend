"use client";

import { useCallback, useEffect, useRef, type Dispatch, type SetStateAction } from "react";

// Micro-interacções partilhadas por todos os formulários do site (design-guardrails.md §6):
// o erro de um campo só aparece depois de sair dele (blur) ou de tentar submeter, e sai
// assim que o valor passa a válido; ao submeter com erros (do cliente ou do servidor) o
// foco vai para o primeiro campo inválido ou, sem erro de campo, para o aviso geral (nunca
// fica perdido em <body> quando o botão em espera se desactiva).

// Um aviso que recebe foco por programa (para ser lido) não é interactivo: sem o anel de
// foco global (:focus-visible, fora de @layer, ganha a qualquer utility).
export const SEM_ANEL = { outline: "none" } as const;

/**
 * Id do primeiro campo com erro, pela ordem visual do formulário. A ordem pode acabar em
 * `["geral", <id do aviso>]`: sem erro de campo, o foco vai para o aviso geral.
 */
export function primeiroInvalido(
  erros: Record<string, string | undefined>,
  ordem: [string, string][],
) {
  return ordem.find(([campo]) => erros[campo])?.[1];
}

/** Blur: mostra (ou limpa) o erro do campo. */
export function aoSair<K extends string>(
  setErros: Dispatch<SetStateAction<Partial<Record<K, string>>>>,
  campo: K,
  erro: string | undefined,
) {
  setErros((actual) => (actual[campo] === erro ? actual : { ...actual, [campo]: erro }));
}

/** Change: só mexe num erro já visível (actualiza-o ou tira-o quando fica válido). */
export function aoMudar<K extends string>(
  setErros: Dispatch<SetStateAction<Partial<Record<K, string>>>>,
  campo: K,
  erro: string | undefined,
) {
  setErros((actual) =>
    actual[campo] === undefined || actual[campo] === erro ? actual : { ...actual, [campo]: erro },
  );
}

/**
 * `focarDepois(id)`: foca o elemento com esse id depois do próximo render (quando o erro
 * ou o aviso já existe no DOM). Só ao submeter; nunca no blur.
 */
export function useFocoPendente() {
  const pendenteRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    const id = pendenteRef.current;
    if (!id) return;
    pendenteRef.current = undefined;
    document.getElementById(id)?.focus();
  });
  return useCallback((id: string | undefined) => {
    pendenteRef.current = id;
  }, []);
}
