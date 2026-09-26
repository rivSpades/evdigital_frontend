// Envio de uma lead pelo proxy do site (`POST /api/contacto`), partilhado pelo
// ContactoWizard e pelo ConsultorWizard. Traduz a resposta num resultado; cada assistente
// decide o que mostrar (estados, foco, erros por campo).

export type Reuniao = { start: string; timeZone: string };

export type PedidoLead = {
  lang: string;
  name: string;
  email: string;
  phone: string;
  need: string;
  service: string;
  message: string;
  /** Honeypot (PRD-backend.md §4.4). */
  website: string;
  elapsedSeconds?: number;
  meeting?: Reuniao;
  /** Lead da página de um consultor: a mensagem passa a ser opcional. */
  consultantSlug?: string;
};

export type ResultadoEnvio =
  | { tipo: "enviado"; reuniaoConfirmada: boolean }
  | { tipo: "demasiados-pedidos" }
  | { tipo: "invalido"; erros: Record<string, string[] | undefined> }
  | { tipo: "falhou" };

export async function enviarLead(pedido: PedidoLead): Promise<ResultadoEnvio> {
  try {
    const resposta = await fetch("/api/contacto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedido),
    });

    if (resposta.status === 429) return { tipo: "demasiados-pedidos" };

    if (resposta.status === 400) {
      // O backend valida outra vez; quem chama volta ao passo dos dados com estes erros.
      const dados = await resposta.json();
      return { tipo: "invalido", erros: dados.errors ?? {} };
    }

    if (!resposta.ok) return { tipo: "falhou" };

    const dados: { meeting_confirmed?: boolean } = await resposta.json();
    return { tipo: "enviado", reuniaoConfirmada: Boolean(dados.meeting_confirmed) };
  } catch {
    return { tipo: "falhou" };
  }
}

/** Segundos desde que o formulário foi montado (anti-spam por tempo mínimo, sem fricção). */
export function segundosDesde(montadoEm: number | null): number | undefined {
  return montadoEm === null ? undefined : Math.round((Date.now() - montadoEm) / 1000);
}
