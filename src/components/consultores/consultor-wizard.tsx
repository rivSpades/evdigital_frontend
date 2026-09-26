"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { enviarLead, segundosDesde } from "@/components/contacto/enviar-lead";
import { EscolhaHorario } from "@/components/contacto/escolha-horario";
import { dividirFrases, formatosData, useSlots } from "@/components/contacto/use-slots";
import { BarraPagina } from "@/components/layout/barra-pagina";
import { BlocoDaVez } from "@/components/ui/bloco-da-vez";
import { Button, ButtonLink } from "@/components/ui/button";
import { CabecalhoPasso } from "@/components/ui/cabecalho-passo";
import { Folha } from "@/components/ui/folha";
import { aoMudar, aoSair, primeiroInvalido, useFocoPendente } from "@/components/ui/formulario";
import { Field, Input, Textarea } from "@/components/ui/input";
import { LinhaResumo } from "@/components/ui/linha-resumo";
import { Notice } from "@/components/ui/notice";
import { OpcaoRadio } from "@/components/ui/opcao-radio";
import { PassoAssistente, ProgressoCompacto, type EstadoPasso } from "@/components/ui/passo-assistente";
import { intlLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import LocaleLink from "@/i18n/locale-link";
import { cn } from "@/lib/cn";
import { erroDoEmail } from "@/lib/email";

// Assistente de contacto com um consultor. Mesmo fluxo e mesma casca do ContactoWizard
// (/contacto): 1 «Fale-nos do que precisa» (Nome, Email, Telefone opcional e Mensagem);
// 2 «Deseja marcar uma reunião?» (opcional: Sim/Não + EscolhaHorario, partilhada com o
// /contacto); 3 «Resumo». Sem o passo «Escolha uma opção»: a mensagem vem sempre primeiro.
//
// Envio: POST /api/contacto com `consultantSlug` (lead com `source=consultor-<slug>` no
// Django) e, se houver hora escolhida, a reunião no Cal.com no mesmo pedido. Mensagens e
// validação iguais às do /contacto (dicionário `contacto`).

type Passo = "descrever" | "reuniao" | "resumo";
type Campo = "nome" | "email" | "mensagem";
type Erros = Partial<Record<Campo, string>>;
type Estado = "parado" | "a-enviar" | "enviado" | "parcial" | "falhou" | "demasiados-pedidos";
type Dict = Dictionary["contacto"];

const TOTAL_PASSOS = 3;
const ID_AVISO_ENVIO = "consultor-envio-aviso";
const ORDEM: [string, string][] = [
  ["nome", "nome"],
  ["email", "email"],
  ["mensagem", "mensagem"],
];
const acaoClasses = "tracking-[var(--letter-spacing-label)]";

function validar(
  valores: { nome: string; email: string; mensagem: string },
  t: Dict["form"]["validation"],
): Erros {
  const erros: Erros = {};
  if (!valores.nome.trim()) erros.nome = t.nameRequired;
  const erroEmail = erroDoEmail(valores.email, t);
  if (erroEmail) erros.email = erroEmail;
  if (!valores.mensagem.trim()) erros.mensagem = t.messageRequired;
  return erros;
}

export function ConsultorWizard({
  lang,
  t,
  consultor,
  privacyLinkLabel,
  optionalLabel,
  retryLabel,
  homeLabel,
}: {
  lang: Locale;
  t: Dict;
  consultor: { slug: string; nome: string; headline: string };
  /** institucional.termos.form.privacyLinkLabel */
  privacyLinkLabel: string;
  /** areaCliente.definicoes.perfil.optional */
  optionalLabel: string;
  /** erros.pagina.retry */
  retryLabel: string;
  /** erros.naoEncontrada.home */
  homeLabel: string;
}) {
  const locale = intlLocale[lang];
  const { resumoData } = formatosData(locale);

  const [passo, setPasso] = useState<Passo>("descrever");
  const tituloPassoRef = useRef<HTMLHeadingElement>(null);
  const tituloFimRef = useRef<HTMLHeadingElement>(null);
  const passoAnterior = useRef<Passo>(passo);

  useEffect(() => {
    if (passoAnterior.current === passo) return;
    passoAnterior.current = passo;
    window.scrollTo({ top: 0 });
    tituloPassoRef.current?.focus({ preventScroll: true });
  }, [passo]);

  const focarDepois = useFocoPendente();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erros, setErros] = useState<Erros>({});

  const [querReuniao, setQuerReuniao] = useState<"sim" | "nao" | null>(null);
  const [diaEscolhido, setDiaEscolhido] = useState<string | null>(null);
  const [horaEscolhida, setHoraEscolhida] = useState<string | null>(null);
  const { slots, erroSlots, fusoHorario } = useSlots(
    passo === "reuniao" && querReuniao === "sim",
    "consultoria",
  );

  const [estado, setEstado] = useState<Estado>("parado");

  // Honeypot e tempo desde a montagem (anti-spam invisível, PRD-backend.md §4.4).
  const [website, setWebsite] = useState("");
  const montadoEm = useRef<number | null>(null);
  useEffect(() => {
    montadoEm.current = Date.now();
  }, []);

  const terminado = estado === "enviado" || estado === "parcial";
  useEffect(() => {
    if (!terminado) return;
    window.scrollTo({ top: 0 });
    tituloFimRef.current?.focus({ preventScroll: true });
  }, [terminado]);

  const valores = { nome, email, mensagem };
  const erroDe = (campo: Campo, valor: string) =>
    validar({ ...valores, [campo]: valor }, t.form.validation)[campo];

  function avancarParaReuniao() {
    const proximosErros = validar(valores, t.form.validation);
    setErros(proximosErros);
    if (Object.keys(proximosErros).length > 0) {
      focarDepois(primeiroInvalido(proximosErros, ORDEM));
      return;
    }
    setPasso("reuniao");
  }

  function escolherQuerReuniao(escolha: "sim" | "nao") {
    setQuerReuniao(escolha);
    if (escolha === "nao") {
      setDiaEscolhido(null);
      setHoraEscolhida(null);
    }
  }

  // Sem horários (ou erro a carregá-los) a marcação não pode bloquear: o aviso diz "pode
  // continuar sem marcar", e a lead segue sem reunião.
  const semHorarios =
    querReuniao === "sim" && slots !== null && Object.keys(slots).length === 0;
  const podeAvancarDeReuniao =
    querReuniao === "nao" ||
    semHorarios ||
    (querReuniao === "sim" && horaEscolhida !== null);

  const reuniaoMarcada = querReuniao === "sim" && horaEscolhida ? horaEscolhida : null;
  const resumoReuniao = reuniaoMarcada ? resumoData(reuniaoMarcada) : null;

  async function finalizar() {
    setEstado("a-enviar");
    const reuniao = reuniaoMarcada ? { start: reuniaoMarcada, timeZone: fusoHorario() } : undefined;

    const resultado = await enviarLead({
      lang,
      name: nome,
      email,
      phone: telefone,
      need: "nao_sei",
      service: "",
      message: mensagem,
      website,
      elapsedSeconds: segundosDesde(montadoEm.current),
      meeting: reuniao,
      consultantSlug: consultor.slug,
    });

    if (resultado.tipo === "demasiados-pedidos") {
      setEstado("demasiados-pedidos");
      focarDepois(ID_AVISO_ENVIO);
      return;
    }

    if (resultado.tipo === "invalido") {
      const doBackend = resultado.erros;
      const locais = validar(valores, t.form.validation);
      const frase = (texto: string | undefined, local: string | undefined) =>
        texto ? (lang === "pt" ? texto : (local ?? t.result.failedTitle)) : undefined;
      const doServidor: Erros = {
        nome: frase(doBackend.name?.[0], locais.nome),
        email: frase(doBackend.email?.[0], locais.email ?? t.form.validation.emailFormat),
        mensagem: frase(doBackend.message?.[0], locais.mensagem),
      };
      // Erro sem campo a mostrar (ex. consultor despublicado entretanto): falha do envio.
      if (!Object.values(doServidor).some(Boolean)) {
        setEstado("falhou");
        focarDepois(ID_AVISO_ENVIO);
        return;
      }
      setErros(doServidor);
      focarDepois(primeiroInvalido(doServidor, ORDEM));
      setPasso("descrever");
      setEstado("parado");
      return;
    }

    if (resultado.tipo === "falhou") {
      setEstado("falhou");
      focarDepois(ID_AVISO_ENVIO);
      return;
    }

    setEstado(reuniao && !resultado.reuniaoConfirmada ? "parcial" : "enviado");
  }

  const voltar = terminado
    ? null
    : passo === "reuniao"
      ? () => setPasso("descrever")
      : passo === "resumo"
        ? () => setPasso("reuniao")
        : null;

  const introducao = (
    <BarraPagina
      className="mb-md lg:mb-lg"
      titulo={`${t.page.title} · ${consultor.nome}`}
      voltarLabel={t.actions.back}
      voltarHref={voltar ? undefined : `/consultants/${consultor.slug}`}
      onVoltar={voltar ?? undefined}
      voltarDisabled={estado === "a-enviar"}
    />
  );

  if (terminado) {
    const parcial = estado === "parcial";
    const frasesParcial = dividirFrases(t.result.partialText);
    return (
      <div className="flex flex-col">
        {introducao}
        <div className="flex flex-col pt-md">
          <h2
            ref={tituloFimRef}
            tabIndex={-1}
            className="font-heading text-title leading-[var(--line-height-headline)] font-semibold tracking-[var(--letter-spacing-headline)] text-text-primary outline-none! lg:text-headline"
          >
            {parcial ? t.result.partialTitle : t.result.successTitle}
          </h2>
          <p className="max-w-[640px] pt-md font-body text-body-lg text-text-secondary">
            {t.result.successText}
          </p>

          {!parcial && reuniaoMarcada ? (
            <div className="w-full max-w-[704px] pt-xl">
              <BlocoDaVez
                fact={
                  <p className="font-mono text-body-lg text-text-primary">
                    {resumoData(reuniaoMarcada, true)}
                  </p>
                }
                title={t.result.meetingConfirmedText}
                fraseTom="secundario"
              />
            </div>
          ) : null}

          {parcial ? (
            <div className="flex w-full max-w-[704px] flex-col gap-md pt-xl">
              <Notice tone="warn" title={frasesParcial.titulo} />
              {frasesParcial.descricao ? (
                <BlocoDaVez title={frasesParcial.descricao} fraseTom="secundario" />
              ) : null}
            </div>
          ) : null}

          <div className="flex pt-2xl">
            <ButtonLink href="/" variant="outline" size="action" className={acaoClasses}>
              {homeLabel}
            </ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  const passoNumero = passo === "descrever" ? 1 : passo === "reuniao" ? 2 : 3;
  const estadoDe = (numero: number): EstadoPasso =>
    numero === passoNumero ? "agora" : numero < passoNumero ? "feito" : "por-fazer";

  const passos = [
    { titulo: t.steps.describe, resposta: nome.trim() },
    { titulo: t.steps.meeting, resposta: resumoReuniao ?? t.summary.noMeeting },
    { titulo: t.steps.summary, resposta: undefined },
  ];

  const cabecalho =
    passo === "descrever"
      ? { title: t.steps.describe, subtitle: undefined }
      : passo === "reuniao"
        ? { title: t.meeting.question, subtitle: t.meeting.hint }
        : { title: t.summary.title, subtitle: undefined };

  const acao = (conteudo: ReactNode) => <div className="flex justify-end">{conteudo}</div>;

  let folha: ReactNode = null;

  if (passo === "descrever") {
    folha = (
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          avancarParaReuniao();
        }}
      >
        <Folha
          actions={acao(
            <Button type="submit" size="action" className={acaoClasses}>
              {t.actions.continue}
            </Button>,
          )}
        >
          <div className="flex flex-col gap-lg pb-xl">
            <Field htmlFor="nome" label={t.form.nameLabel} error={erros.nome}>
              <Input
                id="nome"
                name="nome"
                type="text"
                autoComplete="name"
                placeholder={t.form.namePlaceholder}
                value={nome}
                onChange={(event) => {
                  setNome(event.target.value);
                  aoMudar(setErros, "nome", erroDe("nome", event.target.value));
                }}
                onBlur={(event) => aoSair(setErros, "nome", erroDe("nome", event.target.value))}
              />
            </Field>

            <div className="flex flex-col gap-lg md:flex-row">
              <div className="min-w-0 flex-1">
                <Field htmlFor="email" label={t.form.emailLabel} error={erros.email}>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder={t.form.emailPlaceholder}
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      aoMudar(setErros, "email", erroDe("email", event.target.value));
                    }}
                    onBlur={(event) =>
                      aoSair(setErros, "email", erroDe("email", event.target.value))
                    }
                  />
                </Field>
              </div>
              <div className="min-w-0 flex-1">
                <Field
                  htmlFor="telefone"
                  label={t.form.phoneLabel}
                  optional
                  optionalLabel={optionalLabel}
                >
                  <Input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder={t.form.phonePlaceholder}
                    value={telefone}
                    onChange={(event) => setTelefone(event.target.value)}
                  />
                </Field>
              </div>
            </div>

            <Field htmlFor="mensagem" label={t.form.messageLabel} error={erros.mensagem}>
              <Textarea
                id="mensagem"
                name="mensagem"
                placeholder={t.form.messagePlaceholder}
                value={mensagem}
                className="h-40 py-sm"
                onChange={(event) => {
                  setMensagem(event.target.value);
                  aoMudar(setErros, "mensagem", erroDe("mensagem", event.target.value));
                }}
                onBlur={(event) =>
                  aoSair(setErros, "mensagem", erroDe("mensagem", event.target.value))
                }
              />
            </Field>
          </div>

          {/* Honeypot. Escondido de pessoas (incluindo leitores de ecrã) e do teclado. */}
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
        </Folha>
      </form>
    );
  }

  if (passo === "reuniao") {
    folha = (
      <Folha
        actions={acao(
          <Button
            size="action"
            disabled={!podeAvancarDeReuniao}
            onClick={() => setPasso("resumo")}
            className={acaoClasses}
          >
            {t.actions.continue}
          </Button>,
        )}
      >
        <fieldset className="flex min-w-0 flex-col gap-xs">
          <legend className="sr-only">{t.meeting.question}</legend>
          <OpcaoRadio
            compacta
            id="reuniao-sim"
            name="reuniao"
            value="sim"
            checked={querReuniao === "sim"}
            onChange={() => escolherQuerReuniao("sim")}
            label={t.meeting.yes}
          />
          <OpcaoRadio
            compacta
            id="reuniao-nao"
            name="reuniao"
            value="nao"
            checked={querReuniao === "nao"}
            onChange={() => escolherQuerReuniao("nao")}
            label={t.meeting.no}
          />
        </fieldset>

        {querReuniao === "sim" ? (
          <div className="flex flex-col gap-xl pt-xl">
            <EscolhaHorario
              t={t.meeting}
              locale={locale}
              slots={slots}
              erroSlots={erroSlots}
              dia={diaEscolhido}
              hora={horaEscolhida}
              onDia={setDiaEscolhido}
              onHora={setHoraEscolhida}
            />
          </div>
        ) : null}
      </Folha>
    );
  }

  if (passo === "resumo") {
    const aEnviar = estado === "a-enviar";
    const falhou = estado === "falhou";
    const limite = estado === "demasiados-pedidos";
    folha = (
      <Folha
        actions={acao(
          <Button
            size="action"
            busy={aEnviar}
            rotuloEspera={t.actions.sending}
            disabled={limite}
            onClick={finalizar}
            className={acaoClasses}
          >
            {aEnviar ? t.actions.sending : falhou ? retryLabel : t.actions.finish}
          </Button>,
        )}
      >
        {falhou || limite ? (
          <div className={cn("flex flex-col", falhou && "pb-lg")}>
            <Notice
              id={ID_AVISO_ENVIO}
              focavel
              tone={limite ? "warn" : "error"}
              role="alert"
              title={limite ? t.result.tooManyTitle : t.result.failedTitle}
              description={limite ? t.result.tooManyText : t.result.failedText}
            />
          </div>
        ) : null}

        {limite ? null : (
          <dl className={cn("flex flex-col border-t border-border-default", aEnviar && "opacity-60")}>
            <LinhaResumo rotulo={t.summary.nameLabel} valor={nome} />
            <LinhaResumo rotulo={t.summary.emailLabel} valor={email} mono />
            <LinhaResumo
              rotulo={t.summary.phoneLabel}
              valor={telefone || t.summary.notProvided}
              vazio={!telefone}
            />
            <LinhaResumo rotulo={t.summary.messageLabel} valor={mensagem} />
            <LinhaResumo
              rotulo={t.summary.meetingLabel}
              valor={reuniaoMarcada ? resumoData(reuniaoMarcada, true) : t.summary.noMeeting}
              mono={Boolean(reuniaoMarcada)}
              vazio={!reuniaoMarcada}
            />
          </dl>
        )}

        {/* Na falha o aviso de privacidade continua (frame l8EKiP); só sai a enviar e no limite. */}
        {aEnviar || limite ? null : (
          <p className="py-lg font-body text-caption tracking-[var(--letter-spacing-caption)] text-text-tertiary">
            {t.summary.privacyBefore.trimEnd()}
            <br />
            <LocaleLink href="/privacidade" className="text-text-link hover:text-text-accent">
              {privacyLinkLabel}
            </LocaleLink>
            {t.summary.privacyAfter}
          </p>
        )}
      </Folha>
    );
  }

  return (
    <div className="flex flex-col">
      {introducao}

      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-lg">
        <ol className="hidden border-t border-border-default lg:flex lg:w-[278px] lg:shrink-0 lg:flex-col">
          {passos.map((p, indice) => (
            <PassoAssistente
              key={indice}
              numero={indice + 1}
              total={TOTAL_PASSOS}
              titulo={p.titulo}
              estado={estadoDe(indice + 1)}
              resposta={p.resposta}
            />
          ))}
        </ol>

        <div className="flex min-w-0 flex-1 flex-col">
          <ProgressoCompacto
            className="lg:hidden"
            numero={passoNumero}
            total={TOTAL_PASSOS}
            titulo={passos[passoNumero - 1].titulo}
          />
          <div className="sr-only">
            <CabecalhoPasso
              as="h2"
              tamanho="passo"
              title={cabecalho.title}
              subtitle={cabecalho.subtitle}
              titleRef={tituloPassoRef}
            />
          </div>
          <div className="w-full max-w-[704px] pt-lg lg:pt-0">{folha}</div>
        </div>
      </div>
    </div>
  );
}
