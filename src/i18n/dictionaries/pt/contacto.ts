// Namespace "contacto" — português (língua de origem; define o tipo de en/pl).
export const contacto = {
  metadata: {
    title: "Contacto",
    description:
      "Trinta minutos, sem compromisso e sem custo. Se não fizer sentido avançar, dizemos-lhe.",
  },
  page: {
    title: "Vamos conversar",
  },
  steps: {
    describe: "Fale-nos do que precisa",
    meeting: "Deseja marcar reunião?",
    summary: "Resumo",
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
  },
  meeting: {
    question: "Deseja marcar uma reunião?",
    hint: "É opcional. Trinta minutos, sem compromisso.",
    yes: "Sim, quero marcar",
    no: "Não, só quero enviar a mensagem",
    loading: "A procurar horários...",
    noSlots:
      "Sem horários disponíveis nos próximos dias. Pode continuar sem marcar. Entramos em contacto para combinar.",
    loadError: "Não foi possível carregar os horários. Pode continuar sem marcar.",
    chooseDay: "Escolha um dia",
    chooseTime: "Escolha uma hora",
    changeDay: "Escolher outro dia",
  },
  summary: {
    title: "Confirme os seus dados",
    nameLabel: "Nome",
    emailLabel: "Email",
    phoneLabel: "Telefone",
    needLabel: "O que precisa",
    messageLabel: "Mensagem",
    meetingLabel: "Reunião",
    noMeeting: "Sem reunião marcada",
    notProvided: "Não indicado",
  },
  actions: {
    continue: "Continuar",
    back: "Voltar",
    finish: "Finalizar",
    sending: "A enviar...",
  },
  result: {
    successTitle: "Mensagem enviada.",
    successText:
      "Recebemos o seu pedido e respondemos em breve. Enviámos também uma confirmação para o seu email.",
    meetingConfirmedText: "A reunião ficou marcada. Enviámos a confirmação para o seu email.",
    partialTitle: "Mensagem enviada.",
    partialText:
      "Não conseguimos confirmar a reunião automaticamente. Vamos contactá-lo para combinar o horário.",
    tooManyTitle: "Já recebemos várias mensagens suas.",
    tooManyText: "Aguarde um pouco antes de enviar outra.",
    failedTitle: "Não foi possível enviar.",
    failedText: "Tente outra vez daqui a nada.",
  },
  // Mensagens devolvidas por /api/contacto (o route handler não tem acesso ao dicionário
  // por root-params, por isso importa este slice diretamente).
  api: {
    invalidRequest: "Pedido inválido.",
    unavailable: "Serviço indisponível. Tente outra vez daqui a nada.",
    tooManyRequests: "Já recebemos várias mensagens suas. Aguarde um pouco.",
  },
};
