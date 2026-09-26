import Image from "next/image";
import { cn } from "@/lib/cn";

// Espelha ds/display/retrato (wi64o) do design-system.pen: retrato do consultor, raio 0
// ($radius-none, Shape Lock angular da direcção «A vez»), contorno hairline $border-subtle
// interior, proporção 4:5, imagem em modo fill (object-cover). Sem foto: fundo $avatar-bg com
// as Iniciais em $font-heading $font-weight-heading $avatar-fg (o .pen usa $font-size-title no
// tamanho grande; aqui a letra escala com o retrato).
// Tamanhos por instância (vêm do `className` de quem usa): 278x348 hero desktop, 200x250
// tablet, 120x150 hero mobile, 64x80 linha da lista (56x70 em mobile).
//
// A foto vem do proxy do site (`/api/consultants/<slug>/photo`), nunca do Django. Sem
// optimizador do Next (`unoptimized`): o proxy já responde com cache e o optimizador iria
// pedir a imagem a si próprio.

export function Retrato({
  src,
  nome,
  iniciais,
  sizes,
  prioritaria = false,
  decorativa = false,
  className,
}: {
  /** `null` = sem foto (Iniciais). */
  src: string | null;
  nome: string;
  iniciais: string;
  /** Largura de apresentação (atributo `sizes`). */
  sizes: string;
  prioritaria?: boolean;
  /** alt vazio quando o nome já está ao lado (linha da lista). */
  decorativa?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-none bg-[var(--avatar-bg)] [container-type:inline-size]",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={decorativa ? "" : nome}
          fill
          unoptimized
          priority={prioritaria}
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <span
          aria-hidden={decorativa || undefined}
          aria-label={decorativa ? undefined : nome}
          role={decorativa ? undefined : "img"}
          className="font-heading text-[length:clamp(var(--text-body),30cqw,var(--text-title))] font-semibold text-[var(--avatar-fg)]"
        >
          {iniciais}
        </span>
      )}
      {/* Contorno interior por cima da imagem (strokeAlignment inner no .pen). */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 border border-border-subtle"
      />
    </div>
  );
}
