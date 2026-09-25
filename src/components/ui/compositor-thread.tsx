"use client";

import { useCallback, useLayoutEffect, useRef, type KeyboardEvent } from "react";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErroCampo } from "@/components/ui/erro-campo";
import { LigacaoBotao } from "@/components/ui/ligacao";
import { Notice } from "@/components/ui/notice";
import { cn } from "@/lib/cn";

// Compositor dentro de uma thread (Detalhe do pedido, pedido do dono 2026-09-24: "a caixa
// de texto não está ao estilo thread"). Não é uma folha de formulário: fica na coluna da
// conversa, logo a seguir à última mensagem, com a largura e o alinhamento das mensagens.
//
// Sem caixa (direcção «B · Registo em linhas»): o texto é um campo em linha de base, sem
// fundo nem contorno em cima e nos lados, só a linha de base de 1px $border-strong (ver
// `ui/input.tsx`), a crescer de 3 até ~8 linhas e depois scroll interno. Por baixo, a barra de
// acções: "Cancelar" (ligação discreta) à esquerda, a acção principal (md, 44) à direita.
// Foco: a linha passa a 2px $border-focus (borda + fio inset); erro: $feedback-error-fg. Sem
// borda lateral, sem avatar, sem verde fora do botão principal.
//
// Teclado: Ctrl/Cmd+Enter envia; Enter é nova linha; Esc chama `onCancel`.
// Erros por baixo da caixa (ErroCampo para o campo, Notice para o envio que falhou), ligados
// ao texto por aria-describedby. A enviar: o texto fica readOnly e o botão desactivado com
// aria-busy, sem mudar de tamanho (os dois rótulos ocupam a mesma célula).

const LINHAS_MAX = 8;

export function CompositorThread({
  id,
  value,
  onChange,
  ariaLabel,
  placeholder,
  submitLabel,
  busyLabel,
  busy,
  cancelLabel,
  onCancel,
  error,
  sendError,
}: {
  /** id do textarea (o painel é aberto e focado por este id). */
  id: string;
  value: string;
  onChange: (valor: string) => void;
  ariaLabel: string;
  placeholder?: string;
  submitLabel: string;
  busyLabel: string;
  busy: boolean;
  cancelLabel: string;
  onCancel: () => void;
  /** Erro do campo (ex. sem texto). */
  error?: string;
  /** Erro do envio (ex. rede). */
  sendError?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const erroId = `${id}-erro`;
  const falhouId = `${id}-falhou`;
  const describedBy = [error ? erroId : null, sendError ? falhouId : null]
    .filter(Boolean)
    .join(" ");

  // Auto-crescer: altura do conteúdo entre as 3 linhas de `rows` e LINHAS_MAX. Escondido
  // (painel fechado) não há medidas: volta a medir ao receber o foco.
  const ajustar = useCallback(() => {
    const campo = ref.current;
    if (!campo || campo.clientWidth === 0) return;
    const estilo = getComputedStyle(campo);
    const linha = parseFloat(estilo.lineHeight) || 24;
    const max =
      linha * LINHAS_MAX + parseFloat(estilo.paddingTop) + parseFloat(estilo.paddingBottom);
    campo.style.height = "auto";
    const altura = Math.min(campo.scrollHeight, max);
    campo.style.height = `${altura}px`;
    // +1: o scrollHeight vem arredondado ao pixel (8 linhas = 236,8 → 237).
    campo.style.overflowY = campo.scrollHeight > max + 1 ? "auto" : "hidden";
  }, []);

  useLayoutEffect(ajustar, [value, ajustar]);

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      if (!busy) event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    // Esc em qualquer ponto do compositor (texto ou botões) fecha, como "Cancelar".
    <div
      className="flex w-full flex-col gap-xs"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onCancel();
        }
      }}
    >
      <div className="flex w-full flex-col gap-xs">
        <textarea
          ref={ref}
          id={id}
          name={id}
          rows={3}
          value={value}
          readOnly={busy}
          aria-label={ariaLabel}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={ajustar}
          onKeyDown={onKeyDown}
          className={cn(
            "block w-full resize-none overflow-hidden rounded-none border-0 border-b bg-transparent px-0 py-[10px] transition-colors",
            "font-body text-body leading-[var(--line-height-body)] text-text-primary placeholder:text-text-tertiary",
            error
              ? "border-feedback-error-fg shadow-[inset_0_-1px_0_var(--color-feedback-error-fg)]"
              : "border-border-strong hover:border-border-interactive focus:border-border-focus focus:shadow-[inset_0_-1px_0_var(--color-border-focus)]",
            // O :focus-visible global está fora de camadas: sem `!` ganhava. O foco é o anel
            // interior da caixa.
            "outline-none! focus-visible:outline-none!",
          )}
        />
        <div className="flex items-center justify-between gap-sm">
          <LigacaoBotao variant="discreta" disabled={busy} onClick={onCancel}>
            {cancelLabel}
          </LigacaoBotao>
          <Button
            type="submit"
            size="md"
            disabled={busy}
            aria-busy={busy || undefined}
            className="tracking-[var(--letter-spacing-label)]"
          >
            <span className="grid">
              <span className={cn("col-start-1 row-start-1", busy && "invisible")}>
                {submitLabel}
              </span>
              <span
                aria-hidden={!busy}
                className={cn(
                  "col-start-1 row-start-1 flex items-center justify-center gap-xs",
                  !busy && "invisible",
                )}
              >
                <LoaderCircle
                  size={16}
                  strokeWidth={2}
                  aria-hidden
                  className="animate-spin motion-reduce:animate-none"
                />
                {busyLabel}
              </span>
            </span>
          </Button>
        </div>
      </div>
      {error ? <ErroCampo id={erroId}>{error}</ErroCampo> : null}
      {sendError ? <Notice id={falhouId} tone="error" role="alert" title={sendError} /> : null}
    </div>
  );
}
