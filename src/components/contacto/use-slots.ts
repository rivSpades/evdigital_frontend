"use client";

import { useEffect, useRef, useState } from "react";

// Partilhado pelos assistentes de /contacto (ContactoWizard) e do consultor
// (ConsultorWizard): horários livres do Cal.com (via /api/contacto/slots, proxy do backend) e
// a formatação das datas no formato do .pen ("ter 29 set · 10:00"). Só formatação do Intl,
// sem copy própria.

export type Slot = { start: string };
export type SlotsPorDia = Record<string, Slot[]>;
/** Event type do Cal.com: serviços digitais (por omissão) ou consultoria (páginas de consultor). */
export type TipoReuniao = "digital" | "consultoria";

// Janela fixa a partir de amanhã; o Cal.com já filtra pelo horário de disponibilidade do
// event type, não há dias úteis a excluir aqui.
const DIAS_JANELA = 14;

/**
 * Busca os horários assim que `activo` passa a verdadeiro (uma vez). `slots === null`
 * enquanto carrega; `{}` depois de carregado (com ou sem resultados, ou em erro:
 * `erroSlots` distingue os dois últimos casos). `fusoHorario()` é o fuso do browser, lido ao
 * montar, para o pedido dos horários e para a marcação.
 */
export function useSlots(activo: boolean, tipo: TipoReuniao = "digital") {
  const [slots, setSlots] = useState<SlotsPorDia | null>(null);
  const [erroSlots, setErroSlots] = useState(false);
  const fusoRef = useRef("");

  useEffect(() => {
    fusoRef.current = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }, []);

  useEffect(() => {
    if (!activo || slots !== null) return;

    let cancelado = false;

    const inicio = new Date();
    inicio.setDate(inicio.getDate() + 1);
    const fim = new Date();
    fim.setDate(fim.getDate() + 1 + DIAS_JANELA);
    const paraISO = (data: Date) => data.toISOString().slice(0, 10);

    const params = new URLSearchParams({
      start: paraISO(inicio),
      end: paraISO(fim),
      timeZone: fusoRef.current,
      tipo,
    });

    fetch(`/api/contacto/slots?${params.toString()}`, { signal: AbortSignal.timeout(10_000) })
      .then((resposta) => {
        if (!resposta.ok) throw new Error("pedido falhou");
        return resposta.json();
      })
      .then((dados: { data?: SlotsPorDia }) => {
        if (cancelado) return;
        setSlots(dados.data ?? {});
      })
      .catch(() => {
        if (cancelado) return;
        setErroSlots(true);
        setSlots({});
      });

    return () => {
      cancelado = true;
    };
  }, [activo, slots, tipo]);

  return { slots, erroSlots, fusoHorario: () => fusoRef.current };
}

export function isoParaDia(iso: string): string {
  return iso.slice(0, 10);
}

/** Divide uma frase do dicionário em título (1.ª frase) e descrição (o resto). */
export function dividirFrases(texto: string): { titulo: string; descricao?: string } {
  const [titulo, ...resto] = texto.split(/(?<=[.!?])\s+/);
  return { titulo, descricao: resto.length > 0 ? resto.join(" ") : undefined };
}

// Abreviaturas do Intl sem o ponto final ("ter." → "ter"), como no .pen.
const semPonto = (texto: string) => texto.replace(/\.$/, "");
// Dia da semana curto com três letras no máximo: o Intl de pt-PT devolve "sexta",
// "segunda" em `weekday: "short"`; o .pen escreve "sex", "seg".
const semanaCurta = (texto: string) => semPonto(texto).slice(0, 3);
const maiuscula = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1);

/** Formatadores de data/hora no locale do Intl da página (`intlLocale[lang]`). */
export function formatosData(locale: string) {
  function partesDia(dia: string) {
    const data = new Date(`${dia}T12:00:00Z`);
    const formatar = (opcoes: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat(locale, { timeZone: "UTC", ...opcoes }).format(data);
    return {
      diaSemana: semanaCurta(formatar({ weekday: "short" })),
      dia: formatar({ day: "numeric" }),
      mes: semPonto(formatar({ month: "short" })),
      extenso: maiuscula(formatar({ weekday: "long", day: "numeric", month: "long" })),
    };
  }

  const formatarHora = (iso: string) =>
    new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

  function resumoData(iso: string, comAno = false) {
    const data = new Date(iso);
    const parte = (opcoes: Intl.DateTimeFormatOptions) =>
      semPonto(new Intl.DateTimeFormat(locale, opcoes).format(data));
    const dia = [
      semanaCurta(parte({ weekday: "short" })),
      parte({ day: "numeric" }),
      parte({ month: "short" }),
      comAno ? parte({ year: "numeric" }) : null,
    ]
      .filter(Boolean)
      .join(" ");
    return `${dia} · ${formatarHora(iso)}`;
  }

  return { partesDia, formatarHora, resumoData };
}
