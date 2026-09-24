"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CompositorThread } from "@/components/ui/compositor-thread";
import { useHrefAreaCliente } from "@/i18n/area-cliente-host";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

// "Responder" do Detalhe do pedido. Divulgação progressiva (design-guardrails.md §6, "Um
// campo de resposta não aparece logo"): a conversa termina num botão secundário
// "Responder" (aria-expanded/-controls) e só ao activá-lo aparece, no mesmo sítio, o
// compositor da thread (ui/compositor-thread: uma caixa com o texto e as acções, alinhada
// com as mensagens; não é uma folha de formulário, pedido do dono 2026-09-24). Sem animação
// de altura (só opacidade, 150 ms, nada com prefers-reduced-motion), foco no campo. Esc ou
// "Cancelar" fecham e devolvem o foco ao botão; o rascunho fica (o painel só é escondido com
// `hidden`, nunca desmontado). Ctrl/Cmd+Enter envia. Estados: sem texto (erro por baixo da
// caixa, foco no campo), a enviar ("A enviar...", campo readOnly) e falhou (aviso por baixo
// da caixa, o texto fica). Depois de enviar: o painel fecha, o rascunho limpa-se, o foco
// volta ao botão e a nova mensagem é anunciada pela conversa (role="log" na página).
//
// O "Responder" do bloco da vez (`AbrirResposta`) é o mesmo comando: abre o painel (ou, se
// já está aberto, foca o campo) e faz scroll suave até ele. A ligação `#resposta` vinda de
// outras páginas (ex. "Os seus projetos") abre o painel ao carregar.
//
// Conversa ainda vazia (decisão do dono, 2026-09-24): não há nada a que responder, por isso
// o botão, a acção de envio e o do bloco da vez dizem "Iniciar conversa", e o campo usa
// "Escreva a sua mensagem" (nome acessível e placeholder). Com mensagens fica "Responder".

const PAINEL_ID = "resposta-painel";
const CAMPO_ID = "resposta";
const BOTAO_ID = "resposta-abrir";

type Foco = { alvo: "campo" | "botao"; scroll: boolean; n: number };

type RespostaContexto = {
  aberto: boolean;
  abrir: (opcoes?: { scroll?: boolean }) => void;
  fechar: () => void;
};

const Contexto = createContext<RespostaContexto | null>(null);

function useResposta(): RespostaContexto {
  const valor = useContext(Contexto);
  if (!valor) throw new Error("RespostaProvider em falta à volta do Detalhe do pedido.");
  return valor;
}

function semMovimento() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function RespostaProvider({ children }: { children: ReactNode }) {
  const [aberto, setAberto] = useState(false);
  const [foco, setFoco] = useState<Foco | null>(null);

  const abrir = useCallback((opcoes?: { scroll?: boolean }) => {
    setAberto(true);
    setFoco((f) => ({ alvo: "campo", scroll: opcoes?.scroll ?? false, n: (f?.n ?? 0) + 1 }));
  }, []);

  const fechar = useCallback(() => {
    setAberto(false);
    setFoco((f) => ({ alvo: "botao", scroll: false, n: (f?.n ?? 0) + 1 }));
  }, []);

  // Ligação para #resposta (vinda de outra página, ou uma âncora na mesma): abre a folha já
  // com o foco no campo. Ao carregar, depois do primeiro frame (a hidratação fica igual ao
  // HTML do servidor, com a folha fechada).
  useEffect(() => {
    const verHash = () => {
      if (window.location.hash === `#${CAMPO_ID}`) abrir({ scroll: true });
    };
    const frame = requestAnimationFrame(verHash);
    window.addEventListener("hashchange", verHash);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", verHash);
    };
  }, [abrir]);

  // O foco muda depois do commit, quando a folha (ou o botão) já deixou de estar `hidden`.
  useEffect(() => {
    if (!foco) return;
    const elemento = document.getElementById(foco.alvo === "campo" ? CAMPO_ID : BOTAO_ID);
    if (!elemento) return;
    if (foco.scroll) {
      elemento.focus({ preventScroll: true });
      elemento.scrollIntoView({ behavior: semMovimento() ? "auto" : "smooth", block: "center" });
    } else {
      elemento.focus();
    }
  }, [foco]);

  return (
    <Contexto.Provider value={{ aberto, abrir, fechar }}>{children}</Contexto.Provider>
  );
}

/** "Responder" do bloco da vez: o mesmo comando que o botão no fim da conversa. */
export function AbrirResposta({ label, className }: { label: string; className?: string }) {
  const { aberto, abrir } = useResposta();
  return (
    <Button
      size="action"
      aria-expanded={aberto}
      aria-controls={PAINEL_ID}
      onClick={() => abrir({ scroll: true })}
      className={className}
    >
      {label}
    </Button>
  );
}

export function ComentarForm({
  pedidoId,
  lang,
  t,
  conversaVazia,
}: {
  pedidoId: string;
  lang: Locale;
  t: Dictionary["areaCliente"]["detalhe"]["comment"];
  /** Sem mensagens ainda: "Iniciar conversa" em vez de "Responder" (decisão do dono). */
  conversaVazia: boolean;
}) {
  const router = useRouter();
  const hrefAreaCliente = useHrefAreaCliente();
  const { aberto, abrir, fechar } = useResposta();
  const [texto, setTexto] = useState("");
  const [erroCampo, setErroCampo] = useState("");
  const [erroEnvio, setErroEnvio] = useState(false);
  const [aEnviar, setAEnviar] = useState(false);
  const acao = conversaVazia ? t.startConversation : t.submit;

  function fecharFolha() {
    if (aEnviar) return;
    // O rascunho fica; os erros não sobrevivem ao fechar.
    setErroCampo("");
    setErroEnvio(false);
    fechar();
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErroCampo("");
    setErroEnvio(false);
    if (!texto.trim()) {
      setErroCampo(t.errEmpty);
      document.getElementById(CAMPO_ID)?.focus();
      return;
    }

    setAEnviar(true);
    try {
      const resposta = await fetch(`/api/area-cliente/pedidos/${pedidoId}/comentarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: texto }),
      });

      if (resposta.status === 401) {
        router.push(hrefAreaCliente(lang, "/area-cliente/entrar"));
        return;
      }

      if (!resposta.ok) {
        setErroEnvio(true);
        return;
      }

      setTexto("");
      fechar();
      router.refresh();
    } catch {
      setErroEnvio(true);
    } finally {
      setAEnviar(false);
    }
  }

  return (
    <>
      <div className="flex" hidden={aberto}>
        <Button
          id={BOTAO_ID}
          variant="secondary"
          size="action"
          aria-expanded={aberto}
          aria-controls={PAINEL_ID}
          onClick={() => abrir()}
          className="tracking-[var(--letter-spacing-label)]"
        >
          {acao}
        </Button>
      </div>

      <form
        id={PAINEL_ID}
        hidden={!aberto}
        noValidate
        onSubmit={onSubmit}
        className="w-full motion-safe:transition-opacity motion-safe:duration-150 motion-safe:starting:opacity-0"
      >
        <CompositorThread
          id={CAMPO_ID}
          value={texto}
          onChange={(valor) => {
            setTexto(valor);
            if (erroCampo && valor.trim()) setErroCampo("");
          }}
          ariaLabel={conversaVazia ? t.ariaLabelFirst : t.ariaLabel}
          placeholder={conversaVazia ? t.placeholderFirst : t.placeholder}
          submitLabel={acao}
          busyLabel={t.submitting}
          busy={aEnviar}
          cancelLabel={t.cancel}
          onCancel={fecharFolha}
          error={erroCampo || undefined}
          sendError={erroEnvio ? t.errSend : undefined}
        />
      </form>
    </>
  );
}
