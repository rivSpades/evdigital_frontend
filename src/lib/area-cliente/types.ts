// Espelha os serializers de apps/clients e apps/client_requests no backend.
// Mantido à mão (sem geração automática) — mudou-se um lado, muda-se o outro.

export type Perfil = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  nif: string;
};

export type Projeto = {
  id: string;
  title: string;
  service: string;
  service_label: string;
  status: "em_curso" | "entregue" | "em_pausa";
  status_label: string;
  latest_update: string;
  latest_update_at: string | null;
  started_at: string | null;
  delivered_at: string | null;
};

export type PedidoResumo = {
  id: string;
  title: string;
  type: "ticket" | "feature" | "novo_projeto";
  priority: "quando_possivel" | "esta_semana" | "urgente";
  status: string;
  status_label: string;
  project: { id: string; title: string; service: string } | null;
  created_at: string;
  updated_at: string;
};

export type MudancaDeEstado = {
  to_status: string;
  status_label: string;
  status_description: string;
  created_at: string;
};

export type Comentario = {
  id: string;
  body: string;
  author_name: string;
  is_team: boolean;
  created_at: string;
};

export type PedidoDetalhe = PedidoResumo & {
  description: string;
  reason: string;
  status_description: string;
  status_changes: MudancaDeEstado[];
  comments: Comentario[];
};
