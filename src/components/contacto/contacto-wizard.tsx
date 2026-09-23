"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Info, Mail, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

// Frames: "Formulário" dentro de Página · Contacto (Nwccs / c9CDDw) do design-system.pen.
// Wizard de 3 passos ainda não desenhado no .pen (excepção pontual, registada em
// site/Context.md) — usa só tokens e componentes já existentes (Card, Button, Input,
// Select), sem primitivo novo em components/ui.
//
// O campo "O que precisa" lista o catálogo inteiro (`servicos`, vindo de
// `getAllServices` no Server Component pai) mais "Ainda não sei" — não os 4 baldes
// genéricos do `Need` do backend. `servicoInicial` (query string `?servico=`, da CTA
// "Pedir uma proposta" de /servicos/[slug], PRD-servicos.md §6) só pré-seleciona qual
// dessas opções já vem escolhida; continua editável, nunca bloqueado.

// Valores do modelo `Need` do backend (apps/leads/models.py) — obrigatório lá,
// invisível aqui. O visitante escolhe um produto do catálogo (ou "não sei"); este mapa
// traduz essa escolha para o balde de segmentação de persona que o backend exige,
// sem lhe voltar a perguntar a mesma coisa por outras palavras.
type Need = "site" | "melhorar" | "avancado" | "nao_sei";

// Produtos de entrada (site, loja) → "pôr o negócio online"; produtos que pressupõem
// uma presença já existente (marcações, Google, domínio/email) → "melhorar o que já
// tenho"; toda a família B → "avançado".
const NEED_BY_SERVICE: Record<string, Need> = {
  "site-profissional": "site",
  "loja-online": "site",
  "marcacoes-e-reservas": "melhorar",
  "negocio-no-google": "melhorar",
  "dominio-e-email": "melhorar",
  "ferramentas-a-medida": "avancado",
  "automacao-e-integracoes": "avancado",
  "assistentes-ia": "avancado",
  "auditoria-mvp-ia": "avancado",
  "microsoft-365-azure": "avancado",
};

const DATE_LOCALE: Record<Locale, string> = { pt: "pt-PT", en: "en-GB", pl: "pl-PL" };
const DIAS_JANELA = 14;

type Passo = "descrever" | "reuniao" | "resumo";
type Campo = "nome" | "email" | "assunto" | "mensagem";
type Erros = Partial<Record<Campo, string>>;
type Dict = Dictionary["contacto"];
type Slot = { start: string };
type SlotsPorDia = Record<string, Slot[]>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validar(
  valores: { nome: string; email: string; assunto: string; mensagem: string },
  t: Dict["form"]["validation"],
): Erros {
  const erros: Erros = {};

  if (!valores.nome.trim()) erros.nome = t.nameRequired;

  if (!valores.email.trim()) erros.email = t.emailRequired;
  else if (!EMAIL_PATTERN.test(valores.email.trim())) erros.email = t.emailInvalid;

  if (!valores.assunto) erros.assunto = t.needRequired;

  if (!valores.mensagem.trim()) erros.mensagem = t.messageRequired;

  return erros;
}

function isoParaDia(iso: string): string {
  return iso.slice(0, 10);
}

type Estado = "parado" | "a-enviar" | "enviado" | "parcial" | "falhou" | "demasiados-pedidos";

export function ContactoWizard({
  lang,
  t,
  servicos,
  servicoInicial,
}: {
  lang: Locale;
  t: Dict;
  servicos: { slug: string; titulo: string }[];
  servicoInicial?: string;
}) {
  const OPCOES: SelectOption[] = [
    ...servicos.map((servico) => ({ value: servico.slug, label: servico.titulo })),
    { value: "nao_sei", label: t.form.needOptions.nao_sei },
  ];
  const locale = DATE_LOCALE[lang];

  const [passo, setPasso] = useState<Passo>("descrever");

  // Passo 1
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  // Valor de "O que precisa": um slug de `servicos`, ou "nao_sei".
  const [assunto, setAssunto] = useState(servicoInicial ?? "");
  const [mensagem, setMensagem] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [tentouEnviar, setTentouEnviar] = useState(false);

  // Passo 2
  const [querReuniao, setQuerReuniao] = useState<"sim" | "nao" | null>(null);
  // `slots === null` enquanto está a carregar; `{}` depois de carregado (com ou sem
  // resultados, ou em erro — `erroSlots` distingue os dois últimos casos).
  const [slots, setSlots] = useState<SlotsPorDia | null>(null);
  const [erroSlots, setErroSlots] = useState(false);
  const [diaEscolhido, setDiaEscolhido] = useState<string | null>(null);
  const [horaEscolhida, setHoraEscolhida] = useState<string | null>(null);
  const timezoneRef = useRef("");

  const [estado, setEstado] = useState<Estado>("parado");

  // Honeypot: campo escondido que só bots preenchem (PRD-backend.md §4.4).
  const [website, setWebsite] = useState("");
  // Momento em que o formulário foi montado, para o backend distinguir um humano
  // de um bot que submete instantaneamente. Nenhuma fricção para o visitante.
  const montadoEm = useRef<number | null>(null);
  useEffect(() => {
    montadoEm.current = Date.now();
    timezoneRef.current = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }, []);

  const valores = { nome, email, assunto, mensagem };

  function revalidar(proximos: Partial<typeof valores>) {
    if (!tentouEnviar) return;
    setErros(validar({ ...valores, ...proximos }, t.form.validation));
  }

  function avancarParaReuniao() {
    setTentouEnviar(true);
    const proximosErros = validar(valores, t.form.validation);
    setErros(proximosErros);
    if (Object.keys(proximosErros).length > 0) return;
    setPasso("reuniao");
  }

  // Busca os horários assim que o visitante escolhe "Sim" no passo 2. Janela fixa de
  // DIAS_JANELA dias a partir de amanhã — o Cal.com já filtra pelo horário de
  // disponibilidade do event type, não há dias úteis a excluir aqui.
  useEffect(() => {
    if (passo !== "reuniao" || querReuniao !== "sim" || slots !== null) return;

    let cancelado = false;

    const inicio = new Date();
    inicio.setDate(inicio.getDate() + 1);
    const fim = new Date();
    fim.setDate(fim.getDate() + 1 + DIAS_JANELA);
    const paraISO = (data: Date) => data.toISOString().slice(0, 10);

    const params = new URLSearchParams({
      start: paraISO(inicio),
      end: paraISO(fim),
      timeZone: timezoneRef.current,
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
  }, [passo, querReuniao, slots]);

  function escolherQuerReuniao(escolha: "sim" | "nao") {
    setQuerReuniao(escolha);
    if (escolha === "nao") {
      setDiaEscolhido(null);
      setHoraEscolhida(null);
    }
  }

  // Sem horários disponíveis, o passo 2 não pode ficar bloqueado: a mensagem já diz
  // "pode continuar sem marcar", o botão tem de cumprir isso.
  const semHorariosDisponiveis =
    querReuniao === "sim" && slots !== null && Object.keys(slots).length === 0;
  const podeAvancarDeReuniao =
    querReuniao === "nao" ||
    semHorariosDisponiveis ||
    (querReuniao === "sim" && horaEscolhida !== null);

  async function finalizar() {
    setEstado("a-enviar");

    const reuniaoEscolhida =
      querReuniao === "sim" && horaEscolhida
        ? { start: horaEscolhida, timeZone: timezoneRef.current }
        : undefined;

    const service = assunto === "nao_sei" ? "" : assunto;
    const need = assunto === "nao_sei" ? "nao_sei" : (NEED_BY_SERVICE[assunto] ?? "nao_sei");

    try {
      const resposta = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang,
          name: nome,
          email,
          phone: telefone,
          need,
          service,
          message: mensagem,
          website,
          elapsedSeconds:
            montadoEm.current === null
              ? undefined
              : Math.round((Date.now() - montadoEm.current) / 1000),
          meeting: reuniaoEscolhida,
        }),
      });

      if (resposta.status === 429) {
        setEstado("demasiados-pedidos");
        return;
      }

      if (resposta.status === 400) {
        // O backend valida outra vez; se discordar, voltamos ao passo 1 com os erros.
        const dados = await resposta.json();
        const doBackend = dados.errors ?? {};
        setErros({
          nome: doBackend.name?.[0],
          email: doBackend.email?.[0],
          assunto: doBackend.need?.[0],
          mensagem: doBackend.message?.[0],
        });
        setPasso("descrever");
        setEstado("parado");
        return;
      }

      if (!resposta.ok) {
        setEstado("falhou");
        return;
      }

      const dados: { meeting_confirmed?: boolean } = await resposta.json();
      setEstado(reuniaoEscolhida && !dados.meeting_confirmed ? "parcial" : "enviado");
    } catch {
      setEstado("falhou");
    }
  }

  const resumoReuniao =
    querReuniao === "sim" && horaEscolhida
      ? new Intl.DateTimeFormat(locale, {
          weekday: "short",
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(horaEscolhida))
      : null;

  const ESTADOS_FINAIS: Estado[] = ["enviado", "parcial"];
  const terminado = ESTADOS_FINAIS.includes(estado);
  const passoNumero = passo === "descrever" ? 1 : passo === "reuniao" ? 2 : 3;

  if (terminado) {
    return (
      <Card className="flex items-start gap-md p-lg lg:p-xl">
        <CheckCircle2
          size={24}
          strokeWidth={2}
          aria-hidden
          className="shrink-0 text-feedback-success-fg"
        />
        <div className="flex flex-col gap-2xs">
          <p className="font-body text-body font-semibold text-text-primary">
            {estado === "parcial" ? t.result.partialTitle : t.result.successTitle}
          </p>
          <p className="font-body text-body text-text-secondary">
            {estado === "parcial" ? t.result.partialText : t.result.successText}
          </p>
          {estado === "enviado" && resumoReuniao ? (
            <p className="font-body text-body text-text-secondary">
              {t.result.meetingConfirmedText}
            </p>
          ) : null}
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-lg">
      <ol className="flex gap-md" aria-label={t.steps.describe}>
        {(["descrever", "reuniao", "resumo"] as const).map((p, indice) => {
          const numero = indice + 1;
          const activo = p === passo;
          const concluido = passoNumero > numero;
          return (
            <li key={p} className="flex items-center gap-xs">
              <span
                aria-hidden
                className={
                  "flex h-6 w-6 items-center justify-center rounded-full font-body text-caption font-semibold " +
                  (activo || concluido
                    ? "bg-accent-primary text-text-on-accent"
                    : "bg-bg-surface-sunken text-text-tertiary")
                }
              >
                {numero}
              </span>
              <span
                className={
                  "font-body text-caption " +
                  (activo ? "text-text-primary" : "text-text-tertiary")
                }
              >
                {p === "descrever" ? t.steps.describe : p === "reuniao" ? t.steps.meeting : t.steps.summary}
              </span>
            </li>
          );
        })}
      </ol>

      {passo === "descrever" ? (
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            avancarParaReuniao();
          }}
          className="flex flex-col gap-lg"
        >
          <Field htmlFor="nome" label={t.form.nameLabel} error={erros.nome}>
            <Input
              id="nome"
              name="nome"
              type="text"
              autoComplete="name"
              placeholder={t.form.namePlaceholder}
              value={nome}
              invalid={Boolean(erros.nome)}
              aria-describedby={erros.nome ? "nome-erro" : undefined}
              onChange={(event) => {
                setNome(event.target.value);
                revalidar({ nome: event.target.value });
              }}
              icon={<User size={20} strokeWidth={2} />}
            />
          </Field>

          <Field htmlFor="email" label={t.form.emailLabel} error={erros.email}>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder={t.form.emailPlaceholder}
              value={email}
              invalid={Boolean(erros.email)}
              aria-describedby={erros.email ? "email-erro" : undefined}
              onChange={(event) => {
                setEmail(event.target.value);
                revalidar({ email: event.target.value });
              }}
              icon={<Mail size={20} strokeWidth={2} />}
            />
          </Field>

          <Field htmlFor="telefone" label={t.form.phoneLabel} optional>
            <Input
              id="telefone"
              name="telefone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder={t.form.phonePlaceholder}
              value={telefone}
              onChange={(event) => setTelefone(event.target.value)}
              icon={<Phone size={20} strokeWidth={2} />}
            />
          </Field>

          <Field htmlFor="assunto" label={t.form.needLabel} error={erros.assunto}>
            <Select
              id="assunto"
              name="assunto"
              value={assunto}
              options={OPCOES}
              placeholder={t.form.needPlaceholder}
              invalid={Boolean(erros.assunto)}
              describedBy={erros.assunto ? "assunto-erro" : undefined}
              onChange={(proximo) => {
                setAssunto(proximo);
                revalidar({ assunto: proximo });
              }}
            />
          </Field>

          <Field
            htmlFor="mensagem"
            label={t.form.messageLabel}
            error={erros.mensagem}
          >
            <Textarea
              id="mensagem"
              name="mensagem"
              rows={4}
              placeholder={t.form.messagePlaceholder}
              value={mensagem}
              invalid={Boolean(erros.mensagem)}
              aria-describedby={
                erros.mensagem ? "mensagem-ajuda mensagem-erro" : "mensagem-ajuda"
              }
              onChange={(event) => {
                setMensagem(event.target.value);
                revalidar({ mensagem: event.target.value });
              }}
            />
          </Field>

          {/* Honeypot. Escondido de pessoas (incluindo leitores de ecrã) e do teclado;
              visível para bots que preenchem tudo o que encontram. */}
          <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
            <label htmlFor="website">{t.form.honeypotLabel}</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
            />
          </div>

          <Button type="submit" size="lg" className="w-full lg:w-auto lg:self-start">
            {t.actions.continue}
          </Button>
        </form>
      ) : null}

      {passo === "reuniao" ? (
        <div className="flex flex-col gap-lg">
          <div className="flex flex-col gap-xs">
            <p className="font-body text-body font-semibold text-text-primary">
              {t.meeting.question}
            </p>
            <p className="font-body text-body text-text-secondary">{t.meeting.hint}</p>
          </div>

          <div className="flex flex-col gap-sm sm:flex-row">
            <Button
              type="button"
              variant={querReuniao === "sim" ? "primary" : "secondary"}
              onClick={() => escolherQuerReuniao("sim")}
            >
              {t.meeting.yes}
            </Button>
            <Button
              type="button"
              variant={querReuniao === "nao" ? "primary" : "secondary"}
              onClick={() => escolherQuerReuniao("nao")}
            >
              {t.meeting.no}
            </Button>
          </div>

          {querReuniao === "sim" ? (
            <Card className="flex flex-col gap-md p-lg">
              {slots === null ? (
                <p className="font-body text-body text-text-secondary">{t.meeting.loading}</p>
              ) : erroSlots && Object.keys(slots ?? {}).length === 0 ? (
                <p className="font-body text-body text-text-secondary">{t.meeting.loadError}</p>
              ) : Object.keys(slots ?? {}).length === 0 ? (
                <p className="font-body text-body text-text-secondary">{t.meeting.noSlots}</p>
              ) : diaEscolhido === null ? (
                <div className="flex flex-col gap-sm">
                  <p className="font-body text-label font-medium text-text-primary">
                    {t.meeting.chooseDay}
                  </p>
                  <div className="flex flex-wrap gap-sm">
                    {Object.keys(slots ?? {})
                      .sort()
                      .map((dia) => (
                        <Button
                          key={dia}
                          type="button"
                          variant="secondary"
                          size="compact"
                          onClick={() => setDiaEscolhido(dia)}
                        >
                          {new Intl.DateTimeFormat(locale, {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          }).format(new Date(`${dia}T12:00:00Z`))}
                        </Button>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-sm">
                  <div className="flex items-center justify-between gap-sm">
                    <p className="font-body text-label font-medium text-text-primary">
                      {t.meeting.chooseTime}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setDiaEscolhido(null);
                        setHoraEscolhida(null);
                      }}
                      className="font-body text-caption text-text-link underline"
                    >
                      {t.meeting.changeDay}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-sm">
                    {(slots?.[diaEscolhido] ?? [])
                      .filter((slot) => isoParaDia(slot.start) === diaEscolhido)
                      .map((slot) => (
                        <Button
                          key={slot.start}
                          type="button"
                          variant={horaEscolhida === slot.start ? "primary" : "secondary"}
                          size="compact"
                          onClick={() => setHoraEscolhida(slot.start)}
                        >
                          {new Intl.DateTimeFormat(locale, {
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(new Date(slot.start))}
                        </Button>
                      ))}
                  </div>
                </div>
              )}
            </Card>
          ) : null}

          <div className="flex gap-sm">
            <Button type="button" variant="secondary" onClick={() => setPasso("descrever")}>
              {t.actions.back}
            </Button>
            <Button
              type="button"
              disabled={!podeAvancarDeReuniao}
              onClick={() => setPasso("resumo")}
            >
              {t.actions.continue}
            </Button>
          </div>
        </div>
      ) : null}

      {passo === "resumo" ? (
        <div className="flex flex-col gap-lg">
          <Card className="flex flex-col gap-md p-lg">
            <p className="font-body text-title-sm font-semibold text-text-primary">
              {t.summary.title}
            </p>

            <dl className="flex flex-col gap-sm">
              {[
                [t.summary.nameLabel, nome],
                [t.summary.emailLabel, email],
                [t.summary.phoneLabel, telefone || t.summary.notProvided],
                [t.summary.needLabel, OPCOES.find((opcao) => opcao.value === assunto)?.label ?? ""],
                [t.summary.messageLabel, mensagem],
                [t.summary.meetingLabel, resumoReuniao ?? t.summary.noMeeting],
              ].map(([label, valor]) => (
                <div key={label} className="flex flex-col gap-2xs">
                  <dt className="font-body text-caption text-text-tertiary">{label}</dt>
                  <dd className="font-body text-body text-text-primary">{valor}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <div className="flex gap-sm">
            <Button
              type="button"
              variant="secondary"
              disabled={estado === "a-enviar"}
              onClick={() => setPasso("reuniao")}
            >
              {t.actions.back}
            </Button>
            <Button type="button" disabled={estado === "a-enviar"} onClick={finalizar}>
              {estado === "a-enviar" ? t.actions.sending : t.actions.finish}
            </Button>
          </div>

          {estado === "falhou" || estado === "demasiados-pedidos" ? (
            <div
              role="alert"
              className="flex items-start gap-md rounded-[var(--card-radius)] border border-feedback-error-border bg-feedback-error-bg p-[var(--space-component-inset-md)]"
            >
              <Info
                size={24}
                strokeWidth={2}
                aria-hidden
                className="shrink-0 text-feedback-error-fg"
              />
              <div className="flex flex-col gap-2xs">
                <p className="font-body text-body font-semibold text-text-primary">
                  {estado === "demasiados-pedidos" ? t.result.tooManyTitle : t.result.failedTitle}
                </p>
                <p className="font-body text-body text-text-secondary">
                  {estado === "demasiados-pedidos" ? t.result.tooManyText : t.result.failedText}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
