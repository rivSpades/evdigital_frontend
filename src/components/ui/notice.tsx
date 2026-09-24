import { cn } from "@/lib/cn";

// Espelha ds/feedback/notice (DOImd) do design-system.pen (direcção "A vez"): superfície
// $radius-none com contorno completo nos quatro lados (nunca barra lateral), padding
// $space-md, gap $space-sm. Glifo funcional de 20 (anel $border-width-thick com a letra),
// título em $font-weight-body-strong $text-primary e descrição opcional.
//
// Tipos: info (glifo "i") | warn ("!", $feedback-warning-*) | error ("!", $feedback-error-*)
// | ok ("✓", com as cores de info: sucesso não é verde, o verde fica para o primário).
//
// Tamanhos: md (título body, descrição caption; o normal) | lg (título body-lg, descrição
// body; confirmação de email, onde o aviso é o conteúdo do ecrã).
//
// `discreto` (aviso dos anexos em Novo pedido/Novo projeto): título em $font-weight-body
// $text-secondary, como o override da instância "Aviso · anexos" do .pen.
//
// `role`: "alert" para erros que nascem de uma acção (anunciados logo), "status" para
// confirmações; nenhum para avisos que já estão na página ao carregar.
//
// `focavel`: o aviso recebe foco por programa (tabIndex -1, sem anel: não é interactivo)
// quando é o erro geral de um formulário, para o foco não ficar perdido em <body> depois de
// um erro do servidor (design-guardrails.md §6). Precisa de `id`.

export type NoticeTone = "info" | "warn" | "error" | "ok";

const toneClasses: Record<NoticeTone, { box: string; glyph: string; description: string }> = {
  info: {
    box: "border-feedback-info-border bg-feedback-info-bg",
    glyph: "border-feedback-info-fg text-feedback-info-fg",
    description: "text-feedback-info-fg",
  },
  ok: {
    box: "border-feedback-info-border bg-feedback-info-bg",
    glyph: "border-feedback-info-fg text-feedback-info-fg",
    description: "text-feedback-info-fg",
  },
  warn: {
    box: "border-feedback-warning-border bg-feedback-warning-bg",
    glyph: "border-feedback-warning-fg text-feedback-warning-fg",
    description: "text-feedback-warning-fg",
  },
  error: {
    box: "border-feedback-error-border bg-feedback-error-bg",
    glyph: "border-feedback-error-fg text-feedback-error-fg",
    description: "text-feedback-error-fg",
  },
};

const glyphLetter: Record<NoticeTone, string> = { info: "i", ok: "✓", warn: "!", error: "!" };

export function Notice({
  tone = "info",
  size = "md",
  title,
  description,
  role,
  id,
  titleAs: Title = "p",
  discreto = false,
  focavel = false,
  className,
}: {
  tone?: NoticeTone;
  size?: "md" | "lg";
  title: string;
  description?: string;
  role?: "alert" | "status";
  id?: string;
  /** Quando o aviso é o conteúdo do ecrã, o título é o h1 da página. */
  titleAs?: "p" | "h1" | "h2";
  discreto?: boolean;
  focavel?: boolean;
  className?: string;
}) {
  const classes = toneClasses[tone];
  return (
    <div
      id={id}
      role={role}
      tabIndex={focavel ? -1 : undefined}
      style={focavel ? { outline: "none" } : undefined}
      className={cn(
        "flex w-full gap-sm rounded-[var(--radius-none)] border p-md",
        classes.box,
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "mt-3xs flex size-5 shrink-0 items-center justify-center rounded-[var(--radius-pill)] border-2",
          "font-body text-[length:var(--spacing-sm)] leading-none font-bold",
          classes.glyph,
        )}
      >
        {glyphLetter[tone]}
      </span>
      <div className="flex flex-col gap-2xs">
        <Title
          className={cn(
            "font-body",
            discreto ? "font-normal text-text-secondary" : "font-semibold text-text-primary",
            size === "lg" ? "text-body-lg" : "text-body",
          )}
        >
          {title}
        </Title>
        {description ? (
          <p
            className={cn(
              "font-body",
              size === "lg" ? "text-body" : "text-caption",
              classes.description,
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
