"use client";

import { useRef } from "react";
import { AProcurar } from "@/components/ui/a-procurar";
import { EscolhaDia } from "@/components/ui/escolha-dia";
import { EscolhaHora } from "@/components/ui/escolha-hora";
import { EsqueletoBloco } from "@/components/ui/esqueleto";
import { Notice } from "@/components/ui/notice";
import type { Dictionary } from "@/i18n/dictionaries";
import { dividirFrases, formatosData, isoParaDia, type SlotsPorDia } from "./use-slots";

// Escolha de dia e hora de uma reunião (Cal.com), partilhada pelo passo 2 do
// ContactoWizard (frames "Ecrã · Contacto" de "v2 · A vez") e pelo passo «Marcar hora» do
// ConsultorWizard (ILGp5 / p9cbq). A carregar: esqueleto de 5 dias + ds/feedback/a-procurar;
// sem horários ou erro: ds/feedback/notice (duas frases → título e descrição); depois,
// "Escolha um dia" (ds/form/escolha-dia a deslizar na horizontal em mobile) e, com um dia
// escolhido, "Escolha uma hora" (ds/form/escolha-hora, 3 colunas; 6 em md+) e "Escolher
// outro dia".

// Número/Título/Rótulo com as métricas do .pen: label $font-weight-label $letter-spacing-label.
const rotuloGrupo =
  "font-body text-label font-medium tracking-[var(--letter-spacing-label)] text-text-primary";

export function EscolhaHorario({
  t,
  locale,
  slots,
  erroSlots,
  dia,
  hora,
  onDia,
  onHora,
}: {
  t: Dictionary["contacto"]["meeting"];
  /** Locale do Intl (`intlLocale[lang]`). */
  locale: string;
  slots: SlotsPorDia | null;
  erroSlots: boolean;
  dia: string | null;
  hora: string | null;
  onDia: (dia: string | null) => void;
  onHora: (hora: string | null) => void;
}) {
  const diasRef = useRef<HTMLDivElement>(null);
  const { partesDia, formatarHora } = formatosData(locale);

  function escolherOutroDia() {
    onDia(null);
    onHora(null);
    diasRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
  }

  const semHorarios = dividirFrases(t.noSlots);
  const erroHorarios = dividirFrases(t.loadError);
  const diasDisponiveis = Object.keys(slots ?? {}).sort();
  const partes = dia ? partesDia(dia) : null;

  if (slots === null) {
    return (
      <div aria-busy className="flex flex-col gap-sm">
        <p className={rotuloGrupo}>{t.chooseDay}</p>
        <div className="flex gap-xs overflow-hidden">
          {Array.from({ length: 5 }, (_, indice) => (
            <EsqueletoBloco
              key={indice}
              className="h-[72px] w-[68px] shrink-0 rounded-[var(--input-radius)]"
            />
          ))}
        </div>
        <AProcurar>{t.loading}</AProcurar>
      </div>
    );
  }

  if (erroSlots && diasDisponiveis.length === 0) {
    return (
      <Notice
        tone="warn"
        role="status"
        title={erroHorarios.titulo}
        description={erroHorarios.descricao}
      />
    );
  }

  if (diasDisponiveis.length === 0) {
    return (
      <Notice
        tone="info"
        role="status"
        title={semHorarios.titulo}
        description={semHorarios.descricao}
      />
    );
  }

  return (
    <>
      {/* gap $space-sm = gap-xs + o pt-2xs da linha (folga do anel de foco). */}
      <div className="flex flex-col gap-xs">
        <p id="reuniao-dia" className={rotuloGrupo}>
          {t.chooseDay}
        </p>
        {/* Desliza na horizontal quando os dias não cabem (mobile). */}
        <div
          ref={diasRef}
          role="group"
          aria-labelledby="reuniao-dia"
          className="-mx-2xs flex gap-xs overflow-x-auto px-2xs pt-2xs pb-xs"
        >
          {diasDisponiveis.map((chave) => {
            const p = partesDia(chave);
            return (
              <EscolhaDia
                key={chave}
                diaSemana={p.diaSemana}
                dia={p.dia}
                mes={p.mes}
                rotulo={p.extenso}
                escolhido={dia === chave}
                onEscolher={() => {
                  if (dia !== chave) onHora(null);
                  onDia(chave);
                }}
              />
            );
          })}
        </div>
      </div>

      {dia && partes ? (
        <div className="flex flex-col gap-xs">
          <p id="reuniao-hora" className={rotuloGrupo}>
            {t.chooseTime}
          </p>
          <p className="font-mono text-caption text-text-tertiary">{partes.extenso}</p>
          <div
            role="group"
            aria-labelledby="reuniao-hora"
            className="grid grid-cols-3 gap-xs pt-2xs md:grid-cols-6"
          >
            {(slots[dia] ?? [])
              .filter((slot) => isoParaDia(slot.start) === dia)
              .map((slot) => (
                <EscolhaHora
                  key={slot.start}
                  hora={formatarHora(slot.start)}
                  escolhida={hora === slot.start}
                  onEscolher={() => onHora(slot.start)}
                />
              ))}
          </div>
          <div className="flex pt-2xs">
            <button
              type="button"
              onClick={escolherOutroDia}
              className="inline-flex min-h-11 items-center rounded-[var(--button-radius)] px-sm font-body text-label font-medium tracking-[var(--letter-spacing-label)] text-text-primary transition-colors hover:bg-bg-surface-hover"
            >
              {t.changeDay}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
