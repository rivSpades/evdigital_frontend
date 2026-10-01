"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { ArrowRight, X } from "lucide-react";
import { trackEvent } from "@/components/analytics/track";
import { AProcurar } from "@/components/ui/a-procurar";
import { ButtonLink } from "@/components/ui/button";
import { CompositorThread } from "@/components/ui/compositor-thread";
import { LigacaoBotao } from "@/components/ui/ligacao";
import { Notice } from "@/components/ui/notice";
import { enviarLead } from "@/components/contacto/enviar-lead";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import { definirAssistenteAberto } from "./estado";
import { Fala } from "./fala";
import { ResumoPedido, type ErroEnvio } from "./resumo-pedido";
import type { Mensagem, Rascunho } from "./tipos";

// Coluna do assistente, conforme o grupo «Ecrã · Assistente» do design-system.pen (conceito
// «O balcão», 2026-10-01; master ds/overlay/assistente e --mobile):
// - lg+: coluna de 480 colada à direita, da barra de topo (72) até ao fundo (ou até ao aviso de
//   cookies), NÃO modal: a página fica usável à esquerda. Cantos a direito, contorno hairline,
//   sombra de profundidade. Abaixo de lg: ecrã inteiro, modal, por cima da barra e dos cookies.
// - Cabeçalho (72/64): título Sora, «Nova conversa» (só com conversa) e fechar (44).
// - Corpo: transcrição (`Fala`), ancorada ao fim; só acompanha as falas novas se o visitante
//   já estava no fim (ou se foi ele que falou).
// - Rodapé: aviso de IA (até «Entendi») por cima do compositor; com o resumo à espera o
//   compositor recolhe; indisponível/limite trocam o compositor por um aviso com «Ir para o
//   contacto».
// O assistente só PROPÕE o pedido (`leadDraft`): é o «Enviar pedido» do resumo que o envia
// por /api/contacto, tal como o formulário. Estado em sessionStorage (sobrevive a navegar e a
// recarregar, não a fechar o separador); o servidor não guarda conversas.

const KEY = "ev-assistente-v2";
const MAX_TURNOS = 20;
const FIM_PX = 48;

type Estado = {
  messages: Mensagem[];
  rascunho: Rascunho | null;
  enviado: boolean;
  /** UUID da conversa, gerado aqui: o servidor grava as trocas e liga a lead a esta conversa. */
  conversationId: string;
};

function novoEstado(): Estado {
  return { messages: [], rascunho: null, enviado: false, conversationId: crypto.randomUUID() };
}

function ler(): Estado {
  try {
    const bruto = sessionStorage.getItem(KEY);
    if (!bruto) return novoEstado();
    const d = JSON.parse(bruto) as Partial<Estado>;
    return {
      messages: Array.isArray(d.messages) ? d.messages : [],
      rascunho: d.rascunho && typeof d.rascunho === "object" ? d.rascunho : null,
      enviado: d.enviado === true,
      conversationId: typeof d.conversationId === "string" ? d.conversationId : crypto.randomUUID(),
    };
  } catch {
    return novoEstado();
  }
}

function guardar(estado: Estado) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(estado));
  } catch {
    // Sem armazenamento: a conversa vale só enquanto o painel existir.
  }
}

// lg (1024): coluna não modal; abaixo, ecrã inteiro modal.
function useLargo() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(min-width: 1024px)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => true,
  );
}

export function PainelAssistente({
  t,
  contacto,
  lang,
  aberto,
  retornarFoco,
}: {
  t: Dictionary["assistente"];
  contacto: Dictionary["contacto"];
  lang: Locale;
  aberto: boolean;
  /** Devolve o foco ao botão do assistente quando o painel fecha. */
  retornarFoco: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const corpoRef = useRef<HTMLDivElement>(null);
  const noFim = useRef(true);
  const modoModal = useRef(false);
  const fechoProgramado = useRef(false);
  const [estado, setEstado] = useState<Estado>(ler);
  const [texto, setTexto] = useState("");
  const [aResponder, setAResponder] = useState(false);
  const [aEnviar, setAEnviar] = useState(false);
  const [indisponivel, setIndisponivel] = useState<string | null>(null);
  const [erroEnvio, setErroEnvio] = useState<ErroEnvio | null>(null);
  const largo = useLargo();

  const atualizar = useCallback((seguinte: Estado) => {
    setEstado(seguinte);
    guardar(seguinte);
  }, []);

  const fechar = useCallback(() => {
    definirAssistenteAberto(false);
    retornarFoco();
  }, [retornarFoco]);

  // Abre/fecha o <dialog>: modal abaixo de lg, não modal em lg+ (a página continua usável).
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (aberto) {
      // Já aberto no modo certo (ex. segunda passagem do StrictMode): nada a fazer.
      if (dialog.open && modoModal.current === !largo) return;
      if (dialog.open) {
        // Troca de modo (a janela passou o limite lg): o `close` é nosso, não do visitante.
        fechoProgramado.current = true;
        dialog.close();
      }
      modoModal.current = !largo;
      if (largo) dialog.show();
      else dialog.showModal();
      document.getElementById("assistente-mensagem")?.focus();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [aberto, largo]);

  // Fechar o painel limpa os avisos de falha (a conversa e o rascunho ficam). Ajuste de
  // estado durante o render ao mudar `aberto`, sem efeito.
  const [abertoAntes, setAbertoAntes] = useState(aberto);
  if (abertoAntes !== aberto) {
    setAbertoAntes(aberto);
    if (!aberto) {
      setIndisponivel(null);
      setErroEnvio(null);
    }
  }

  // Transcrição ancorada ao fim: só acompanha se o visitante já lá estava.
  const aoRolar = () => {
    const c = corpoRef.current;
    if (c) noFim.current = c.scrollHeight - c.scrollTop - c.clientHeight < FIM_PX;
  };
  const ultima = estado.messages[estado.messages.length - 1];
  useLayoutEffect(() => {
    const c = corpoRef.current;
    if (c && (noFim.current || ultima?.role === "user")) c.scrollTop = c.scrollHeight;
  }, [
    estado.messages,
    estado.rascunho,
    estado.enviado,
    aResponder,
    indisponivel,
    erroEnvio,
    aberto,
    ultima?.role,
  ]);

  const turnos = estado.messages.filter((m) => m.role === "user").length;
  const noLimite = turnos >= MAX_TURNOS;
  const vazia = estado.messages.length === 0;
  const aEspera = estado.rascunho !== null && !estado.enviado;
  const semCompositor = aEspera || indisponivel !== null || noLimite;

  async function enviar(conteudo: string) {
    const limpo = conteudo.trim();
    if (!limpo || aResponder || semCompositor) return;

    const antes = estado;
    const messages: Mensagem[] = [...antes.messages, { role: "user", content: limpo }];
    atualizar({ ...antes, messages });
    setTexto("");
    setAResponder(true);
    if (antes.messages.length === 0) trackEvent("assistant_start");

    try {
      const resposta = await fetch("/api/assistente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang,
          messages,
          browserLang: navigator.language,
          leadSent: antes.enviado,
          conversationId: antes.conversationId,
        }),
      });
      const dados: { answer?: string; leadDraft?: Rascunho | null; message?: string } =
        await resposta.json().catch(() => ({}));

      if (!resposta.ok || !dados.answer) {
        setIndisponivel(dados.message ?? t.errors.unavailable);
        return;
      }
      atualizar({
        ...antes,
        messages: [...messages, { role: "assistant", content: dados.answer }],
        rascunho: antes.enviado ? antes.rascunho : (dados.leadDraft ?? antes.rascunho),
      });
    } catch {
      setIndisponivel(t.errors.unavailable);
    } finally {
      setAResponder(false);
    }
  }

  async function enviarPedido() {
    const r = estado.rascunho;
    if (!r || aEnviar) return;
    setAEnviar(true);
    setErroEnvio(null);
    const resultado = await enviarLead({
      lang,
      name: r.name,
      email: r.email,
      phone: r.phone,
      need: r.need,
      service: r.service,
      message: r.message,
      website: "",
      origem: "assistente",
      conversationId: estado.conversationId,
    });
    setAEnviar(false);
    if (resultado.tipo === "enviado") {
      atualizar({ ...estado, enviado: true });
    } else if (resultado.tipo === "demasiados-pedidos") {
      setErroEnvio({ titulo: contacto.result.tooManyTitle, texto: contacto.result.tooManyText });
    } else {
      setErroEnvio({ titulo: contacto.result.failedTitle, texto: contacto.result.failedText });
    }
  }

  function novaConversa() {
    atualizar(novoEstado());
    setIndisponivel(null);
    setErroEnvio(null);
    setTexto("");
    noFim.current = true;
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="assistente-titulo"
      onClose={() => {
        if (fechoProgramado.current) {
          fechoProgramado.current = false;
          return;
        }
        fechar();
      }}
      onKeyDown={(e) => {
        // Em lg+ o diálogo não é modal: o Esc não o fecha sozinho.
        if (e.key === "Escape" && largo) {
          e.preventDefault();
          fechar();
        }
      }}
      className={cn(
        "pointer-events-auto m-0 border-0 bg-transparent p-0 text-text-primary backdrop:bg-bg-overlay-scrim",
        "h-dvh max-h-none w-full max-w-none",
        // lg+: cartão ancorado ao botão do assistente (o dialog está dentro do seu contentor
        // relativo), 16 acima dele, alinhado à direita. Altura 720 limitada ao ecrã: 100dvh
        // menos o que a pilha subiu (`--reserva`), o botão (56), a folga (16+24) e a barra (72+16).
        "lg:absolute lg:inset-auto lg:right-0 lg:bottom-full lg:mb-md lg:h-[720px] lg:w-[420px]",
        "lg:max-h-[calc(100dvh-var(--reserva,0px)-208px)]",
      )}
    >
      <div
        className={cn(
          "flex h-full w-full flex-col overflow-hidden bg-bg-surface",
          "lg:rounded-[var(--modal-radius)] lg:border lg:border-border-default lg:shadow-elevation-3",
        )}
      >
        <header className="flex h-16 shrink-0 items-center gap-sm border-b border-border-subtle px-lg lg:h-16">
          <h2
            id="assistente-titulo"
            className="min-w-0 flex-1 font-heading text-body-lg leading-[var(--line-height-title)] font-semibold tracking-[var(--letter-spacing-title)] text-text-primary lg:text-title-sm"
          >
            {t.title}
          </h2>
          {!vazia || estado.rascunho ? (
            <LigacaoBotao variant="discreta" onClick={novaConversa}>
              {t.newConversation}
            </LigacaoBotao>
          ) : null}
          <button
            type="button"
            onClick={fechar}
            aria-label={t.close}
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-[var(--button-radius)] border border-border-default text-text-primary transition-colors hover:bg-bg-surface-hover"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div ref={corpoRef} onScroll={aoRolar} className="min-h-0 flex-1 overflow-y-auto">
          <div className="flex min-h-full flex-col justify-end gap-lg p-lg">
            {vazia ? (
              <>
                <p className="font-heading text-body-lg leading-[var(--line-height-title)] font-semibold tracking-[var(--letter-spacing-title)] text-text-primary">
                  {t.intro}
                </p>
                <ul className="border-t border-border-default">
                  {t.suggestions.map((sugestao) => (
                    <li key={sugestao}>
                      <button
                        type="button"
                        onClick={() => void enviar(sugestao)}
                        className="group flex min-h-11 w-full cursor-pointer items-center justify-between gap-lg border-b border-border-default py-md text-left font-body text-label font-medium text-text-primary transition-colors hover:text-text-secondary"
                      >
                        <span>{sugestao}</span>
                        <ArrowRight
                          aria-hidden
                          className="size-5 shrink-0 text-text-secondary"
                          strokeWidth={1.5}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="flex flex-col gap-lg" aria-live="polite">
                {estado.messages.map((m, i) => (
                  <Fala
                    key={i}
                    papel={m.role}
                    autor={
                      estado.messages[i - 1]?.role === m.role
                        ? undefined
                        : m.role === "user"
                          ? t.authors.you
                          : t.authors.assistant
                    }
                  >
                    {m.content}
                  </Fala>
                ))}
                {aResponder ? (
                  <div className="flex flex-col gap-2xs">
                    <p className="font-mono text-caption text-text-tertiary">
                      {t.authors.assistant}
                    </p>
                    <AProcurar>{t.thinking}</AProcurar>
                  </div>
                ) : null}
              </div>
            )}

            {estado.rascunho ? (
              <ResumoPedido
                rascunho={estado.rascunho}
                enviado={estado.enviado}
                aEnviar={aEnviar}
                erro={erroEnvio}
                t={t}
                contacto={contacto}
                onGuardar={(rascunho) => atualizar({ ...estado, rascunho })}
                onEnviar={() => void enviarPedido()}
                onCancelar={() => atualizar({ ...estado, rascunho: null })}
              />
            ) : null}
          </div>
        </div>

        {!indisponivel && !noLimite && aEspera ? null : (
          <footer className="flex shrink-0 flex-col gap-md border-t border-border-subtle px-lg pt-md pb-lg">
            {indisponivel !== null || noLimite ? (
              <div className="flex flex-col gap-sm">
                <Notice
                  tone={indisponivel !== null ? "error" : "info"}
                  role={indisponivel !== null ? "alert" : undefined}
                  title={indisponivel ?? t.errors.limit}
                />
                <ButtonLink href="/contacto" variant="secondary" onClick={fechar}>
                  {t.contactLink}
                </ButtonLink>
              </div>
            ) : aEspera ? null : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void enviar(texto);
                }}
              >
                <CompositorThread
                  id="assistente-mensagem"
                  value={texto}
                  onChange={setTexto}
                  ariaLabel={t.composer.label}
                  placeholder={t.composer.placeholder}
                  submitLabel={t.composer.send}
                  busyLabel={t.composer.sending}
                  busy={aResponder}
                  linhas={1}
                  enterEnvia
                />
              </form>
            )}
          </footer>
        )}
      </div>
    </dialog>
  );
}
