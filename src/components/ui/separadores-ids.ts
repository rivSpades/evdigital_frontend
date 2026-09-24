// Ids partilhados entre `Separadores` (cliente) e o painel que a página desenha (servidor).
// Ficam num módulo simples: funções exportadas de um ficheiro "use client" são referências
// de cliente e não se podem chamar num Server Component.

export const separadorId = (id: string, value: string) => `${id}-separador-${value}`;
export const separadorPainelId = (id: string) => `${id}-painel`;
