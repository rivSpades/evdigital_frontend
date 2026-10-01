"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { BotMessageSquare, ChevronDown, X } from "lucide-react";
import { stripLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import { definirAssistenteAberto, semAssistente, useAssistenteAberto } from "./estado";

// Botão flutuante do assistente + balão «Precisa de ajuda?» + painel (ds/action/
// assistente-lancador, ds/overlay/balao-assistente e ds/overlay/assistente do design-system.pen,
// «Ecrã · Assistente», 2026-10-01). Vive dentro da pilha fixa do `ScrollToTop` (canto inferior
// direito): o botão é a âncora e nunca se mexe; o «Voltar ao topo» aparece por cima dele.
//
// Botão: círculo de 56 em $accent-primary, ícone Lucide bot-message-square 24 (robô num balão
// de conversa: «assistente que conversa»), sem texto. Hover/pressionado nos tons do accent,
// foco com anel de 3px $border-focus a 2px. Aberto: $bg-surface-raised, contorno $border-strong
// e chevron-down («recolher», para não repetir o X do cabeçalho do painel).
//
// Balão: à esquerda do botão, depois de 10 s de página visível, uma só vez por visita (estado
// só em memória: recarregar a página recomeça do zero e pode voltar a aparecer); nunca com o
// painel aberto nem depois de o visitante o abrir; só depois de o aviso de cookies estar
// resolvido; dispensa-se com o X, com Esc, ao abrir o assistente, ou sai sozinho aos 20 s.
//
// O painel só é carregado à primeira abertura (não pesa no LCP) e fica montado depois, para a
// conversa não se perder. Não existe na Área de Cliente (subdomínio) nem em rotas de contacto.

const Painel = dynamic(() => import("./painel-assistente").then((m) => m.PainelAssistente), {
  ssr: false,
});

const ESPERA_MS = 10_000;
const VIDA_MS = 20_000;
const SAIDA_MS = 160;

type FaseBalao = "escondido" | "entra" | "sai";

export function Assistente({
  t,
  contacto,
  lang,
  clientesHost,
}: {
  t: Dictionary["assistente"];
  contacto: Dictionary["contacto"];
  lang: Locale;
  clientesHost?: string;
}) {
  const pathname = usePathname();
  const aberto = useAssistenteAberto();
  const botaoRef = useRef<HTMLButtonElement>(null);
  const [montado, setMontado] = useState(false);
  const [fase, setFase] = useState<FaseBalao>("escondido");
  // O balão só aparece uma vez por visita: depois de mostrado, dispensado ou de abrir o
  // assistente não volta até recarregar a página (que conta como recomeçar do zero).
  const [encerrado, setEncerrado] = useState(false);
  // Host do browser (vazio no servidor e na hidratação: o botão só aparece depois).
  const host = useSyncExternalStore(
    () => () => {},
    () => window.location.host,
    () => "",
  );
  const escondido = !host || host === clientesHost || semAssistente(stripLocale(pathname));

  // Monta o painel na primeira abertura (ajuste de estado durante o render, sem efeito).
  if (aberto && !montado) setMontado(true);
  // Abrir o assistente acaba com o balão para sempre: não volta ao fechar o painel.
  if (aberto && !encerrado) setEncerrado(true);
  if (aberto && fase !== "escondido") setFase("escondido");

  const retornarFoco = useCallback(() => botaoRef.current?.focus(), []);

  const dispensar = useCallback(() => {
    setFase((atual) => (atual === "entra" ? "sai" : atual));
  }, []);

  // Fechar-se sozinho em páginas sem assistente.
  useEffect(() => {
    if (escondido) definirAssistenteAberto(false);
  }, [escondido]);

  // Temporizador do balão: só conta com a página visível e sem aviso de cookies por resolver.
  useEffect(() => {
    if (escondido || aberto || encerrado) return;
    let acumulado = 0;
    const relogio = window.setInterval(() => {
      const pendente = !!document.querySelector("[data-aviso-cookies]");
      if (document.visibilityState === "visible" && !pendente) acumulado += 500;
      if (acumulado >= ESPERA_MS) {
        window.clearInterval(relogio);
        setEncerrado(true);
        setFase("entra");
      }
    }, 500);
    return () => window.clearInterval(relogio);
  }, [escondido, aberto, encerrado]);

  // Vida do balão: sai sozinho aos 20 s; depois da animação de saída desmonta.
  useEffect(() => {
    if (fase === "entra") {
      const id = window.setTimeout(() => setFase("sai"), VIDA_MS);
      return () => window.clearTimeout(id);
    }
    if (fase === "sai") {
      const id = window.setTimeout(() => setFase("escondido"), SAIDA_MS);
      return () => window.clearTimeout(id);
    }
  }, [fase]);

  // Esc dispensa o balão.
  useEffect(() => {
    if (fase !== "entra") return;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispensar();
    };
    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [fase, dispensar]);

  if (escondido) return null;

  const balaoVisivel = fase !== "escondido" && !aberto;

  return (
    <div className="pointer-events-none relative flex size-14 items-center justify-center">
      {balaoVisivel ? (
        <div
          className={cn(
            "pointer-events-auto absolute top-1/2 right-full mr-sm flex -translate-y-1/2 items-center",
            "rounded-[var(--radius-md)] border border-border-default bg-bg-surface-raised shadow-elevation-2",
            fase === "entra" ? "balao-entra" : "balao-sai",
          )}
        >
          <button
            type="button"
            onClick={() => definirAssistenteAberto(true)}
            className="cursor-pointer py-sm pr-xs pl-md font-body text-label font-medium whitespace-nowrap text-text-primary"
          >
            {t.balloon}
          </button>
          <button
            type="button"
            onClick={dispensar}
            aria-label={t.dismissHint}
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center text-text-secondary transition-colors hover:text-text-primary"
          >
            <X size={16} aria-hidden="true" />
          </button>
          {/* Cauda de 8×16 a apontar para o botão. */}
          <span
            aria-hidden
            className="absolute top-1/2 -right-[7px] size-3.5 -translate-y-1/2 rotate-45 border-t border-r border-border-default bg-bg-surface-raised"
          />
        </div>
      ) : null}

      <button
        ref={botaoRef}
        type="button"
        onClick={() => definirAssistenteAberto(!aberto)}
        aria-label={aberto ? t.close : t.open}
        aria-expanded={aberto}
        aria-haspopup="dialog"
        className={cn(
          "pointer-events-auto flex size-14 cursor-pointer items-center justify-center rounded-pill shadow-elevation-2",
          "transition-colors duration-200 motion-reduce:transition-none",
          "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base",
          aberto
            ? "border border-border-strong bg-bg-surface-raised text-text-primary hover:bg-bg-surface-hover"
            : "bg-accent-primary text-text-on-accent hover:bg-accent-primary-hover active:bg-accent-primary-pressed",
        )}
      >
        {aberto ? (
          <ChevronDown size={24} aria-hidden="true" />
        ) : (
          <BotMessageSquare size={24} aria-hidden="true" />
        )}
      </button>

      {montado ? (
        <Painel
          t={t}
          contacto={contacto}
          lang={lang}
          aberto={aberto && !escondido}
          retornarFoco={retornarFoco}
        />
      ) : null}
    </div>
  );
}
