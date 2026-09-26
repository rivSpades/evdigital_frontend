"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { BackLink } from "@/components/area-cliente/back-link";
import { enviarLead, segundosDesde } from "@/components/contacto/enviar-lead";
import { EscolhaHorario } from "@/components/contacto/escolha-horario";
import { dividirFrases, formatosData, useSlots } from "@/components/contacto/use-slots";
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

// Assistente de contacto com um consultor, migrado de «Consultores · assistente» do
// design-system.pen: desktop FvMDO (escolha), ILGp5 (marcar hora), pDxlQ (mensagem), ukzh1
// (resumo), l8EKiP (erro no envio), gIOuG (enviado), eRDT5 (enviado sem confirmar a reunião);
// mobile m55ukM, p9cbq, nmnrA, mDqPc, QK6S8, R1vxMe, tNUPf. Mesma casca do ContactoWizard
// (ds/navigation/passo-assistente em lg, progresso compacto abaixo, ds/layout/folha só com a
// acção que avança), com o título do passo visível (ds/display/cabecalho-passo, pb $space-xl).
//
// Introdução: ds/navigation/voltar (volta ao passo anterior; no primeiro, à página do
// consultor), título «Vamos conversar» em display ($font-size-display-sm-narrow em mobile) e o
// subtítulo «<nome> · <headline>» (body-lg; body em mobile). Padding [$space-xl, 0,
// $space-2xl, 0], gap $space-lg ([$space-lg, 0, $space-xl, 0] e $space-md em mobile). No fim
// (enviado) não há Voltar.
//
// Passos: 1 «Escolha uma opção» (Marcar hora | Enviar mensagem, ds/form/radio); 2 a opção
// escolhida: Marcar hora = dia e hora (EscolhaHorario, partilhada com o /contacto) + Nome e
// Email; Enviar mensagem = Nome, Email, Telefone (opcional) e Mensagem; 3 «Resumo».
// `opcaoInicial` (?opcao= das acções da página do consultor) já responde ao passo 1: o
// assistente abre no passo 2, e o Voltar leva ao passo 1 para trocar.
//
// Envio: POST /api/contacto com `consultantSlug` (lead com `source=consultor-<slug>` no
// Django) e, na marcação, a reunião no Cal.com no mesmo pedido. A mensagem só é obrigatória no
// caminho «Enviar mensagem» (no servidor é opcional para leads de consultor). Mensagens e
// validação iguais às do /contacto (dicionário `contacto`).

export type OpcaoConsultor = "hora" | "mensagem";

type Passo = "escolha" | "dados" | "resumo";
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
  opcao: OpcaoConsultor,
  t: Dict["form"]["validation"],
): Erros {
  const erros: Erros = {};
  if (!valores.nome.trim()) erros.nome = t.nameRequired;
  const erroEmail = erroDoEmail(valores.email, t);
  if (erroEmail) erros.email = erroEmail;
  if (opcao === "mensagem" && !valores.mensagem.trim()) erros.mensagem = t.messageRequired;
  return erros;
}

export function ConsultorWizard({
  lang,
  t,
  tc,
  consultor,
  opcaoInicial,
  privacyLinkLabel,
  optionalLabel,
  retryLabel,
  homeLabel,
}: {
  lang: Locale;
  t: Dict;
  tc: Dictionary["consultores"];
  consultor: { slug: string; nome: string; headline: string };
  opcaoInicial?: OpcaoConsultor;
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

  const [passo, setPasso] = useState<Passo>(opcaoInicial ? "dados" : "escolha");
  const [opcao, setOpcao] = useState<OpcaoConsultor>(opcaoInicial ?? "hora");
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

  const [diaEscolhido, setDiaEscolhido] = useState<string | null>(null);
  const [horaEscolhida, setHoraEscolhida] = useState<string | null>(null);
  const { slots, erroSlots, fusoHorario } = useSlots(passo === "dados" && opcao === "hora");

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
    validar({ ...valores, [campo]: valor }, opcao, t.form.validation)[campo];

  const rotuloOpcao = opcao === "hora" ? tc.detalhe.marcarHora : tc.detalhe.enviarMensagem;

  // Sem horários (ou erro a carregá-los) a marcação não pode bloquear: o aviso diz "pode
  // continuar sem marcar", e a lead segue sem reunião.
  const semHorarios = slots !== null && Object.keys(slots).length === 0;
  const reuniaoEmFalta = opcao === "hora" && (slots === null || (!semHorarios && !horaEscolhida));

  function escolherOpcao(proxima: OpcaoConsultor) {
    setOpcao(proxima);
    // Os erros da mensagem não se aplicam à marcação (e o inverso).
    setErros((anteriores) => ({ ...anteriores, mensagem: undefined }));
  }

  function avancarParaResumo() {
    const proximosErros = validar(valores, opcao, t.form.validation);
    setErros(proximosErros);
    if (Object.keys(proximosErros).length > 0) {
      focarDepois(primeiroInvalido(proximosErros, ORDEM));
      return;
    }
    if (reuniaoEmFalta) return;
    setPasso("resumo");
  }

  const reuniaoMarcada = opcao === "hora" && horaEscolhida ? horaEscolhida : null;
  const resumoReuniao = reuniaoMarcada ? resumoData(reuniaoMarcada) : null;

  async function finalizar() {
    setEstado("a-enviar");
    const reuniao = reuniaoMarcada ? { start: reuniaoMarcada, timeZone: fusoHorario() } : undefined;

    const resultado = await enviarLead({
      lang,
      name: nome,
      email,
      phone: opcao === "mensagem" ? telefone : "",
      need: "nao_sei",
      service: "",
      message: opcao === "mensagem" ? mensagem : "",
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
      const locais = validar(valores, opcao, t.form.validation);
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
      setPasso("dados");
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
    : passo === "dados"
      ? () => setPasso("escolha")
      : passo === "resumo"
        ? () => setPasso("dados")
        : null;

  const introducao = (
    <div className="flex flex-col gap-md pt-lg pb-xl lg:gap-lg lg:pt-xl lg:pb-2xl">
      {terminado ? (
        // Sem Voltar no fim, mas o título fica no mesmo sítio (frames gIOuG / eRDT5).
        <div aria-hidden className="h-11" />
      ) : (
        <BackLink
          href={voltar ? undefined : `/consultants/${consultor.slug}`}
          onClick={voltar ?? undefined}
          disabled={estado === "a-enviar"}
          label={t.actions.back}
        />
      )}
      <div className="flex flex-col gap-sm lg:gap-md">
        <h1 className="font-heading text-[length:var(--font-size-display-sm-narrow)] leading-[var(--line-height-display)] font-bold tracking-[var(--letter-spacing-display)] text-text-primary md:text-display-sm lg:text-display">
          {t.page.title}
        </h1>
        <p className="font-body text-body text-text-secondary md:text-body-lg">
          {consultor.nome} · {consultor.headline}
        </p>
      </div>
    </div>
  );

  if (terminado) {
    const parcial = estado === "parcial";
    const frasesParcial = dividirFrases(t.result.partialText);
    return (
      <div className="flex flex-col pb-3xl lg:pb-4xl">
        {introducao}
        <div className="flex flex-col">
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

  const passoNumero = passo === "escolha" ? 1 : passo === "dados" ? 2 : 3;
  const estadoDe = (numero: number): EstadoPasso =>
    numero === passoNumero ? "agora" : numero < passoNumero ? "feito" : "por-fazer";

  const passos = [
    { titulo: tc.wizard.escolha, resposta: rotuloOpcao },
    {
      titulo: rotuloOpcao,
      resposta: opcao === "hora" ? (resumoReuniao ?? t.summary.noMeeting) : nome.trim(),
    },
    { titulo: t.steps.summary, resposta: undefined },
  ];

  const cabecalho =
    passo === "escolha" ? tc.wizard.escolha : passo === "dados" ? rotuloOpcao : t.summary.title;

  const acao = (conteudo: ReactNode) => <div className="flex justify-end">{conteudo}</div>;

  const campoNome = (
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
  );

  const campoEmail = (
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
        onBlur={(event) => aoSair(setErros, "email", erroDe("email", event.target.value))}
      />
    </Field>
  );

  let folha: ReactNode = null;

  if (passo === "escolha") {
    folha = (
      <Folha
        actions={acao(
          <Button size="action" onClick={() => setPasso("dados")} className={acaoClasses}>
            {t.actions.continue}
          </Button>,
        )}
      >
        <fieldset className="flex min-w-0 flex-col gap-xs pb-md">
          <legend className="sr-only">{tc.wizard.escolha}</legend>
          <OpcaoRadio
            compacta
            id="opcao-hora"
            name="opcao"
            value="hora"
            checked={opcao === "hora"}
            onChange={() => escolherOpcao("hora")}
            label={tc.detalhe.marcarHora}
          />
          <OpcaoRadio
            compacta
            id="opcao-mensagem"
            name="opcao"
            value="mensagem"
            checked={opcao === "mensagem"}
            onChange={() => escolherOpcao("mensagem")}
            label={tc.detalhe.enviarMensagem}
          />
        </fieldset>
      </Folha>
    );
  }

  if (passo === "dados") {
    folha = (
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          avancarParaResumo();
        }}
      >
        <Folha
          actions={acao(
            <Button type="submit" size="action" disabled={reuniaoEmFalta} className={acaoClasses}>
              {t.actions.continue}
            </Button>,
          )}
        >
          {opcao === "hora" ? (
            <>
              <div className="flex flex-col gap-xl pb-lg">
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
              {campoNome}
              {campoEmail}
            </>
          ) : (
            <>
              {campoNome}
              {campoEmail}
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
              <Field htmlFor="mensagem" label={t.form.messageLabel} error={erros.mensagem}>
                <Textarea
                  id="mensagem"
                  name="mensagem"
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
            </>
          )}

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
            {opcao === "mensagem" ? (
              <>
                <LinhaResumo
                  rotulo={t.summary.phoneLabel}
                  valor={telefone || t.summary.notProvided}
                  vazio={!telefone}
                />
                <LinhaResumo rotulo={t.summary.messageLabel} valor={mensagem} />
              </>
            ) : (
              <LinhaResumo
                rotulo={t.summary.meetingLabel}
                // Com o ano, como no frame ukzh1 («ter 29 set 2026 · 10:00»).
                valor={reuniaoMarcada ? resumoData(reuniaoMarcada, true) : t.summary.noMeeting}
                mono={Boolean(reuniaoMarcada)}
                vazio={!reuniaoMarcada}
              />
            )}
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
    <div className="flex flex-col pb-3xl lg:pb-4xl">
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
          <CabecalhoPasso
            as="h2"
            tamanho="passo"
            title={cabecalho}
            titleRef={tituloPassoRef}
            className="pb-xl"
          />
          <div className="w-full">{folha}</div>
        </div>
      </div>
    </div>
  );
}
