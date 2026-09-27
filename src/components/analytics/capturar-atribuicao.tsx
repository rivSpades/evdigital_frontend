"use client";

import { useEffect } from "react";
import { capturarAtribuicao } from "@/lib/atribuicao";

// Corre em qualquer página de entrada (montado no layout raiz) — ver atribuicao.ts.
export function CapturarAtribuicao() {
  useEffect(() => {
    capturarAtribuicao();
  }, []);
  return null;
}
