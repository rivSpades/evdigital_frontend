// Validação do email partilhada por todos os formulários (Contacto, Entrar, Criar conta,
// Recuperar palavra-passe) e pelo handler /api/contacto. Pura: corre no browser e no
// servidor.

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Frases do email (contacto.form.validation). `emailInvalid` diz que falta o @: só se usa
 * quando falta mesmo; qualquer outro formato inválido (ex. "a@exe") usa `emailFormat`.
 */
export type FrasesEmail = { emailRequired: string; emailInvalid: string; emailFormat: string };

/** Erro do email (ou `undefined` quando é válido). */
export function erroDoEmail(valor: string, frases: FrasesEmail): string | undefined {
  const limpo = valor.trim();
  if (!limpo) return frases.emailRequired;
  if (EMAIL_PATTERN.test(limpo)) return undefined;
  return limpo.includes("@") ? frases.emailFormat : frases.emailInvalid;
}
