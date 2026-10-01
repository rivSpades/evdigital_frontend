import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// Espelha ds/display/fala (i6tfCu) e ds/display/fala--visitante (LzDry) do design-system.pen
// (assistente «O balcão», 2026-10-01). Transcrição, não bolhas: o Assistente fala em texto
// aberto; o visitante num bloco anguloso à direita ($bg-surface-pressed, sem verde, sem
// cauda, $radius-none). O autor (mono, caption, $text-tertiary) só aparece na primeira fala
// de cada sequência; não há horas nem avatares. Gap $space-2xs.

export function Fala({
  papel,
  autor,
  children,
}: {
  papel: "assistant" | "user";
  /** Nome do autor; omitido nas falas seguidas do mesmo autor. */
  autor?: string;
  children: ReactNode;
}) {
  const visitante = papel === "user";
  return (
    <div className={cn("flex flex-col gap-2xs", visitante && "items-end")}>
      {autor ? <p className="font-mono text-caption text-text-tertiary">{autor}</p> : null}
      {visitante ? (
        <div className="max-w-[80%] rounded-[var(--radius-none)] bg-bg-surface-pressed px-md py-sm">
          <p className="font-body text-body break-words whitespace-pre-line text-text-primary">
            {children}
          </p>
        </div>
      ) : (
        <p className="w-full font-body text-body break-words whitespace-pre-line text-text-primary">
          {children}
        </p>
      )}
    </div>
  );
}
