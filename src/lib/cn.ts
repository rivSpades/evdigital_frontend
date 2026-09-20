/** Junta classes ignorando valores vazios. Sem dependência externa: o projeto não
 *  precisa de resolução de conflitos de classes (não há merge de variantes em runtime). */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
