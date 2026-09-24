import { cn } from "@/lib/cn";

// Espelha ds/navigation/passo-assistente (PSJbJ) e ds/navigation/progresso-compacto (DEvbe)
// do design-system.pen (direcção "A vez"), usados no assistente de /contacto.
//
// PassoAssistente: um passo da coluna de progresso (>= lg, coluna de 278 com régua superior
// hairline $border-default no contentor). Régua inferior hairline $border-default, padding
// [$space-md, 0]. Número em $font-mono caption; Título em body $font-weight-label; Resposta
// opcional (mono caption $text-tertiary, padding-top $space-2xs) só nos passos feitos.
// Estados:
// - feito: Número $text-tertiary, Título $text-secondary, Resposta visível.
// - agora: Número e Título $text-primary, Número em $font-weight-display. No .pen o Número
//   do passo actual é $text-accent com a palavra "agora"; aqui fica sem verde (o verde é só
//   para botão, foco e ligação) e sem palavra nova (o copy vem só dos dicionários): o
//   estado diz-se pela cor e peso, e por `aria-current="step"`.
// - por fazer: Número e Título $text-tertiary.
// O .pen tem ainda a ligação "Alterar" nos passos feitos: sem frase no React, não passa.
//
// ProgressoCompacto (< lg): só o progresso numa linha, gap $space-sm, padding-bottom
// $space-lg: Passo (mono caption, $text-primary pelo mesmo motivo) + Título do passo (body
// $font-weight-label $text-primary). Nunca contém o Voltar.
//
// O Número escreve-se "1/3": o .pen diz "1 de 3", mas "de" não existe no React.

export type EstadoPasso = "feito" | "agora" | "por-fazer";

export function numeroPasso(numero: number, total: number) {
  return `${numero}/${total}`;
}

export function PassoAssistente({
  numero,
  total,
  titulo,
  estado,
  resposta,
}: {
  numero: number;
  total: number;
  titulo: string;
  estado: EstadoPasso;
  resposta?: string;
}) {
  return (
    <li
      aria-current={estado === "agora" ? "step" : undefined}
      className="flex flex-col border-b border-border-default py-md"
    >
      <span
        className={cn(
          "font-mono text-caption",
          estado === "agora" ? "font-bold text-text-primary" : "text-text-tertiary",
        )}
      >
        {numeroPasso(numero, total)}
      </span>
      <span
        className={cn(
          "font-body text-body font-medium break-words",
          estado === "agora"
            ? "text-text-primary"
            : estado === "feito"
              ? "text-text-secondary"
              : "text-text-tertiary",
        )}
      >
        {titulo}
      </span>
      {estado === "feito" && resposta ? (
        <span className="pt-2xs font-mono text-caption break-words text-text-tertiary">
          {resposta}
        </span>
      ) : null}
    </li>
  );
}

export function ProgressoCompacto({
  numero,
  total,
  titulo,
  className,
}: {
  numero: number;
  total: number;
  titulo: string;
  className?: string;
}) {
  return (
    <p className={cn("flex flex-wrap items-center gap-x-sm pb-lg", className)}>
      <span className="font-mono text-caption text-text-primary">
        {numeroPasso(numero, total)}
      </span>
      <span className="font-body text-body font-medium text-text-primary">{titulo}</span>
    </p>
  );
}
