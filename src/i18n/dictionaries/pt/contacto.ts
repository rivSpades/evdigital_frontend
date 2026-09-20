// Namespace "contacto" — português (língua de origem; define o tipo de en/pl).
export const contacto = {
  metadata: {
    title: "Contacto",
    description:
      "Trinta minutos, sem compromisso e sem custo. Se não fizer sentido avançar, dizemos-lhe.",
  },
  page: {
    title: "Vamos conversar",
    intro:
      "Trinta minutos, sem compromisso e sem custo. Se não fizer sentido avançar, dizemos-lhe.",
    agendaTitle: "Prefere marcar já uma hora?",
    agendaText: "Escolha o dia e a hora que lhe der jeito. Fica marcado na hora.",
    agendaPlaceholder: "Espaço reservado para a agenda",
    agendaButton: "Marcar conversa gratuita",
  },
  form: {
    needOptions: {
      site: "Pôr o meu negócio online",
      melhorar: "Melhorar o que já tenho",
      avancado: "Solução avançada ou à medida",
      nao_sei: "Ainda não sei",
    },
    validation: {
      nameRequired: "Escreva o seu nome.",
      emailRequired: "Escreva o seu email.",
      emailInvalid: "Falta o @. Escreva assim: nome@empresa.pt",
      needRequired: "Escolha uma opção.",
      messageRequired: "Escreva o que precisa.",
    },
    requestingProposal: "A pedir proposta para",
    removeServiceAria: "Remover produto pré-selecionado",
    nameLabel: "Nome",
    namePlaceholder: "Ana Silva",
    emailLabel: "Email",
    emailPlaceholder: "nome@empresa.pt",
    phoneLabel: "Telefone",
    phonePlaceholder: "912 345 678",
    needLabel: "O que precisa",
    needPlaceholder: "Escolha uma opção",
    messageLabel: "Mensagem",
    messageHint: "Duas ou três frases chegam.",
    messagePlaceholder: "Escreva aqui o que precisa para o seu negócio.",
    honeypotLabel: "Não preencher",
    sending: "A enviar...",
    submit: "Enviar mensagem",
    successTitle: "Mensagem enviada.",
    successText:
      "Recebemos o seu pedido e respondemos em breve. Enviámos também uma confirmação para o seu email.",
    tooManyTitle: "Já recebemos várias mensagens suas.",
    tooManyText:
      "Aguarde um pouco antes de enviar outra. Se for urgente, marque uma conversa pelo bloco ao lado.",
    failedTitle: "Não foi possível enviar.",
    failedText:
      "Tente outra vez daqui a nada. Se continuar sem funcionar, marque uma conversa pelo bloco ao lado.",
  },
  // Mensagens devolvidas por /api/contacto (o route handler não tem acesso ao dicionário
  // por root-params, por isso importa este slice diretamente).
  api: {
    invalidRequest: "Pedido inválido.",
    unavailable: "Serviço indisponível. Tente outra vez daqui a nada.",
    tooManyRequests: "Já recebemos várias mensagens suas. Aguarde um pouco.",
  },
};
