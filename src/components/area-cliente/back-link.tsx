import Link from "@/i18n/locale-link";
import { ArrowLeft } from "lucide-react";

// Só a SETA (Lucide arrow-left 20), sem a palavra «Voltar» (pedido do dono, 2026-09-24; o
// .pen mostra seta e texto). O rótulo continua a ser o nome acessível (aria-label) e a
// dica ao pairar (title), para leitores de ecrã e rato. $text-secondary, hover
// $text-primary, alvo de 44x44, sem contorno. Vive no topo da página, antes do título
// (design-guardrails.md §6).
//
// Com `href` navega; com `onClick` (sem `href`) volta a um estado anterior do mesmo ecrã
// (ex. "Voltar a entrar" no pedido de ligação, que não muda de rota).

const classes =
  "-ml-xs inline-flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-text-secondary transition-colors hover:bg-bg-surface-hover hover:text-text-primary disabled:cursor-not-allowed disabled:text-text-disabled";

export function BackLink({
  href,
  onClick,
  disabled = false,
  label,
}: {
  href?: string;
  onClick?: () => void;
  /** Só sem `href` (ex. enquanto um envio está em curso). */
  disabled?: boolean;
  label: string;
}) {
  const conteudo = <ArrowLeft size={20} strokeWidth={2} aria-hidden />;

  if (!href) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        title={label}
        className={classes}
      >
        {conteudo}
      </button>
    );
  }

  return (
    <Link href={href} aria-label={label} title={label} className={classes}>
      {conteudo}
    </Link>
  );
}
