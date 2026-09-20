/**
 * Etiqueta de um link externo tal como o .pen a mostra: só o host
 * ("app.evplanner.eu"), nunca o URL completo com protocolo.
 */
export function hostLabel(url: string) {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}
