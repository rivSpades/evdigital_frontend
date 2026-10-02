export type Mensagem = {
  role: "user" | "assistant";
  content: string;
  /** Sugestões de ação (botões rápidos) que acompanham uma resposta do assistente. */
  suggestions?: string[];
};

/** Pedido proposto pelo assistente e revisto pelo visitante antes de enviar. */
export type Rascunho = {
  name: string;
  email: string;
  phone: string;
  need: string;
  service: string;
  message: string;
};
