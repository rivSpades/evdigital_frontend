// Namespace "assistente" — português (língua de origem; define o tipo de en/pl).
// Copy mínimo e funcional do chat do site; sem travessões (design-guardrails §8).
// O resumo antes de enviar reutiliza `contacto.summary`, `contacto.form.validation` e
// `contacto.result`; o rótulo da entrada na barra é `common.nav.assistant`.
export const assistente = {
  title: "Assistente",
  open: "Abrir o assistente",
  balloon: "Precisa de ajuda?",
  dismissHint: "Dispensar a sugestão",
  close: "Fechar o assistente",
  intro: "Pergunte-nos sobre os serviços. Se quiser, passamos o seu pedido à equipa.",
  suggestions: ["Que serviços oferecem?", "Como funciona o processo?", "Quero falar com a equipa"],
  authors: { you: "Você", assistant: "Assistente" },
  composer: {
    label: "A sua mensagem",
    placeholder: "Escreva a sua pergunta",
    send: "Enviar",
    sending: "A enviar",
  },
  thinking: "A escrever",
  newConversation: "Nova conversa",
  contactLink: "Ir para o contacto",
  summary: {
    alter: "Alterar",
    cancel: "Cancelar",
    save: "Guardar",
    send: "Enviar pedido",
    sending: "A enviar",
    sentTitle: "Pedido enviado.",
    sentText: "Vai receber uma confirmação por email.",
  },
  errors: {
    unavailable: "O assistente não está disponível agora. Pode escrever-nos na página de contacto.",
    tooManyRequests: "Enviou muitas mensagens. Tente mais tarde ou use a página de contacto.",
    limit: "Esta conversa chegou ao limite. Continue na página de contacto.",
    invalidRequest: "Pedido inválido.",
  },
};
