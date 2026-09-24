"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

// Espelha ds/overlay/veu-com-modal (MvsUT) e ds/overlay/modal--default (BlYRT) do
// design-system.pen (direcção "A vez"): véu $bg-overlay-scrim a cobrir o ecrã e, ao
// centro, o modal com 560 de largura máxima, $modal-radius, fundo $bg-surface-glass com
// desfoque, fio de luz interior no topo ($border-highlight, nunca halo exterior), padding
// $modal-inset (32; $space-lg em mobile) e gap $space-xl. Topo: título ($font-size-title-sm
// Sora) + descrição e o botão fechar (alvo 44, $bg-surface-hover, $radius-sm). Rodapé:
// acções alinhadas à direita; em mobile empilhadas.
//
// Assenta em <dialog> com showModal(): o resto da página fica inerte (o foco não sai do
// modal), Esc fecha (evento "cancel") e o véu é o ::backdrop. Clicar no véu não faz nada,
// de propósito: uma acção destrutiva não se confirma nem se cancela por acidente. Ao
// fechar, o foco volta ao elemento que abriu o modal. Enquanto `busy`, Esc e fechar ficam
// bloqueados (o pedido já foi enviado). O primeiro foco vai para o elemento marcado com
// `data-autofocus` (o "Cancelar", a opção segura), ou para o botão fechar.

export function Modal({
  open,
  onClose,
  title,
  description,
  closeLabel,
  busy = false,
  alert,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  /**
   * Nome acessível do botão fechar (X). Sem ele, o X fica só para rato/toque (aria-hidden,
   * fora do Tab): o teclado e os leitores de ecrã têm o Esc e a acção de cancelar do
   * rodapé, e o X não duplica o nome dessa acção.
   */
  closeLabel?: string;
  busy?: boolean;
  /** Aviso entre o topo e o rodapé (ex. erro ao enviar). */
  alert?: ReactNode;
  /** Rodapé: as acções do modal. */
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const origem = useRef<HTMLElement | null>(null);
  const titleId = `modal-${useId()}`;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      origem.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
      const alvo = dialog.querySelector<HTMLElement>("[data-autofocus]");
      alvo?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    function onDialogClose() {
      // Só se quem abriu ainda existe (pode ter dado lugar a outro elemento).
      if (origem.current?.isConnected) origem.current.focus();
      origem.current = null;
    }
    dialog.addEventListener("close", onDialogClose);
    return () => dialog.removeEventListener("close", onDialogClose);
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? `${titleId}-descricao` : undefined}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      onKeyDown={(event) => {
        // O <dialog> torna a página inerte, mas o Tab ainda sai para a barra do browser:
        // prende-se aqui, do último elemento volta ao primeiro (e ao contrário com Shift).
        if (event.key !== "Tab") return;
        const focaveis = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((elemento) => elemento.tabIndex !== -1);
        if (focaveis.length === 0) return;
        const primeiro = focaveis[0];
        const ultimo = focaveis[focaveis.length - 1];
        const activo = document.activeElement;
        if (event.shiftKey && (activo === primeiro || !event.currentTarget.contains(activo))) {
          event.preventDefault();
          ultimo.focus();
        } else if (!event.shiftKey && (activo === ultimo || !event.currentTarget.contains(activo))) {
          event.preventDefault();
          primeiro.focus();
        }
      }}
      className={cn(
        "m-auto w-[calc(100%-2*var(--spacing-md))] max-w-[560px] open:flex flex-col gap-xl",
        "rounded-[var(--modal-radius)] border border-border-subtle bg-bg-surface-glass p-lg md:p-[var(--modal-inset)]",
        "text-text-primary shadow-[inset_0_1px_0_0_var(--color-border-highlight)] backdrop-blur-[var(--blur-glass)]",
        "backdrop:bg-bg-overlay-scrim",
      )}
    >
      <div className="flex items-start gap-md">
        <div className="flex flex-1 flex-col gap-xs">
          <h2
            id={titleId}
            className="font-heading text-title-sm font-semibold tracking-[var(--letter-spacing-title)] text-text-primary"
          >
            {title}
          </h2>
          {description ? (
            <p id={`${titleId}-descricao`} className="font-body text-body text-text-secondary">
              {description}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={busy}
          {...(closeLabel ? { "aria-label": closeLabel } : { "aria-hidden": true, tabIndex: -1 })}
          className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-bg-surface-hover text-text-secondary transition-colors hover:text-text-primary disabled:text-text-disabled"
        >
          <X size={20} strokeWidth={2} aria-hidden />
        </button>
      </div>
      {alert}
      <div className="flex flex-col gap-sm md:flex-row md:items-center md:justify-end">
        {children}
      </div>
    </dialog>
  );
}
