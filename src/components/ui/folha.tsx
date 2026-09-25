import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// Espelha ds/layout/folha (i0lScq) e ds/layout/folha--mobile (tbpmM) do design-system.pen
// (direcção «B · Registo em linhas»): onde se escreve, uma lista de campos em linha e mais
// nada. Já não é uma caixa: sem fundo, sem contorno e sem padding, os campos ficam abertos
// sobre a página, e só uma régua $border-subtle de 1px fecha a lista. A primeira linha não
// leva régua de topo (cada `Field` traz a sua).
//
// Slots: Conteúdo (linhas de campo) e Acções no fundo, só com a acção que avança: à direita
// em md+, a toda a largura abaixo de md, onde ficam sticky (coladas ao fundo do ecrã enquanto
// a folha está à vista), numa barra transparente. Nunca "Voltar" dentro da folha
// (design-guardrails.md §6).
//
// A largura vem do contentor (680 nos ecrãs de autenticação e na coluna das páginas de
// formulário da Área de Cliente: Novo pedido, Novo projeto, Definições).

export function Folha({
  children,
  actions,
  contentGap = "none",
  className,
}: {
  children: ReactNode;
  actions?: ReactNode;
  /**
   * Espaço entre blocos do Conteúdo. Por omissão nenhum: cada linha de campo traz o seu
   * padding e a sua régua. `xl` afasta grupos de linhas (Novo pedido / Novo projeto).
   */
  contentGap?: "none" | "xl";
  className?: string;
}) {
  return (
    <div className={cn("flex w-full flex-col gap-lg", className)}>
      <div
        className={cn(
          "flex flex-col border-b border-border-subtle [&>:first-child]:border-t-0",
          contentGap === "xl" && "gap-xl",
        )}
      >
        {children}
      </div>
      {actions ? (
        <div
          className={cn(
            "flex flex-col gap-sm md:flex-row md:justify-end",
            // Mobile (< md): o botão fica colado ao fundo do ecrã enquanto a folha está à vista
            // (pedido do dono, 2026-09-24). A barra é TRANSPARENTE (sem fundo nem régua): só o
            // botão se vê, centrado e a toda a largura da folha, com a área segura do iOS por
            // baixo.
            "max-md:sticky max-md:bottom-0 max-md:z-20 max-md:bg-transparent max-md:pt-0 max-md:pb-[calc(var(--spacing-md)+env(safe-area-inset-bottom))]",
            "max-md:[&_a]:w-full max-md:[&_button]:w-full max-md:[&>*]:w-full max-md:[&>*]:justify-center",
          )}
        >
          {actions}
        </div>
      ) : null}
    </div>
  );
}
