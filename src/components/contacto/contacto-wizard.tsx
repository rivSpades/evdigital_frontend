"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { BackLink } from "@/components/area-cliente/back-link";
import { AProcurar } from "@/components/ui/a-procurar";
import { BlocoDaVez } from "@/components/ui/bloco-da-vez";
import { Button, ButtonLink } from "@/components/ui/button";
import { CabecalhoPasso } from "@/components/ui/cabecalho-passo";
import { EscolhaDia } from "@/components/ui/escolha-dia";
import { EscolhaHora } from "@/components/ui/escolha-hora";
import { EsqueletoBloco } from "@/components/ui/esqueleto";
import { Folha } from "@/components/ui/folha";
import { aoMudar, aoSair, primeiroInvalido, useFocoPendente } from "@/components/ui/formulario";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Ligacao } from "@/components/ui/ligacao";
import { LinhaResumo } from "@/components/ui/linha-resumo";
import { Notice } from "@/components/ui/notice";
import { OpcaoRadio } from "@/components/ui/opcao-radio";
import { PassoAssistente, ProgressoCompacto, type EstadoPasso } from "@/components/ui/passo-assistente";
import { Select, type SelectOption } from "@/components/ui/select";
import { intlLocale, type Locale } from "@/i18n/config";
import LocaleLink from "@/i18n/locale-link";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import { erroDoEmail } from "@/lib/email";

// Migrado do grupo "Ecrã · Contacto" em "v2 · A vez" (flhgP) do design-system.pen: frames
// desktop 1280 e mobile 375 do passo 1 (e com erros), passo 2 (horários, a carregar, sem
// horários, erro), passo 3 (resumo, a enviar, falha, limite) e sucesso / sucesso parcial.
//
// Página: Introdução (Voltar nos passos 2 e 3, como primeira linha a seguir à barra de topo e
// alinhado à margem; título "Vamos conversar") e Assistente: em lg, coluna de 278 com os
// passos (ds/navigation/passo-assistente) + Painel; abaixo de lg, o progresso compacto no
// topo do Painel. Painel = cabeçalho do passo (ds/display/cabecalho-passo) + ds/layout/folha
// de 704 com o conteúdo do passo e, no fundo, só a acção que avança.
//
// Copy: só frases dos dicionários (o React manda, design-guardrails.md §8). Ficam de fora,
// por não terem frase no React: o subtítulo da página, os subtítulos dos passos 1 e 3, a
// legenda "A seguir: ...", "Exemplo: ..." (o exemplo continua como placeholder), o resumo de
// erros do passo 1, "Alterar", o fuso ("horas de Lisboa, o seu fuso"), "30 min" e "Não
// precisa de fazer mais nada.". Avisos com duas frases no React dividem-se em título e
// descrição do ds/feedback/notice pela primeira frase.
//
// O campo "O que precisa" lista o catálogo inteiro (`servicos`, vindo de `getAllServices`
// no Server Component pai), agrupado por família, depois de "Ainda não sei".
// `servicoInicial` (query string `?servico=`, da CTA "Pedir uma proposta" de
// /servicos/[slug], PRD-servicos.md §6) só pré-seleciona a opção; continua editável.
//
// Ao mudar de passo, a página volta ao topo e o foco vai para o título do passo (para
// teclado e leitores de ecrã saberem onde estão).
//
// Micro-interacções do passo 1 (design-guardrails.md §6): o erro de cada campo aparece ao
// sair dele (blur) ou ao tentar continuar, e some assim que o valor passa a válido; ao
// tentar continuar com erros (ou ao voltar ao passo 1 com erros do servidor) o foco vai para
// o primeiro campo inválido. No passo 3, uma falha do envio leva o foco para o aviso.

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

const DIAS_JANELA = 14;
const TOTAL_PASSOS = 3;

type Passo = "descrever" | "reuniao" | "resumo";
type Campo = "nome" | "email" | "assunto" | "mensagem";
type Erros = Partial<Record<Campo, string>>;
type Dict = Dictionary["contacto"];
type Slot = { start: string };
type SlotsPorDia = Record<string, Slot[]>;

// Ordem visual dos campos do passo 1 (campo → id do controlo).
const ORDEM: [string, string][] = [
  ["nome", "nome"],
  ["email", "email"],
  ["assunto", "assunto"],
  ["mensagem", "mensagem"],
];

// Aviso de falha do envio (passo 3): recebe o foco, que não pode ficar em <body> depois de
// o botão em espera se desactivar.
const ID_AVISO_ENVIO = "contacto-envio-aviso";

function validar(
  valores: { nome: string; email: string; assunto: string; mensagem: string },
  t: Dict["form"]["validation"],
): Erros {
  const erros: Erros = {};

  if (!valores.nome.trim()) erros.nome = t.nameRequired;

  const erroEmail = erroDoEmail(valores.email, t);
  if (erroEmail) erros.email = erroEmail;

  if (!valores.assunto) erros.assunto = t.needRequired;

  if (!valores.mensagem.trim()) erros.mensagem = t.messageRequired;

  return erros;
}

function isoParaDia(iso: string): string {
  return iso.slice(0, 10);
}

/** Divide uma frase do dicionário em título (1.ª frase) e descrição (o resto). */
function dividirFrases(texto: string): { titulo: string; descricao?: string } {
  const [titulo, ...resto] = texto.split(/(?<=[.!?])\s+/);
  return { titulo, descricao: resto.length > 0 ? resto.join(" ") : undefined };
}

// Abreviaturas do Intl sem o ponto final ("ter." → "ter"), como no .pen.
const semPonto = (texto: string) => texto.replace(/\.$/, "");
// Dia da semana curto com três letras no máximo: o Intl de pt-PT devolve "sexta",
// "segunda" em `weekday: "short"`; o .pen escreve "sex", "seg".
const semanaCurta = (texto: string) => semPonto(texto).slice(0, 3);
const maiuscula = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1);

type Estado = "parado" | "a-enviar" | "enviado" | "parcial" | "falhou" | "demasiados-pedidos";

// Número/Título/Rótulo com as métricas do .pen: label $font-weight-label $letter-spacing-label.
const rotuloGrupo =
  "font-body text-label font-medium tracking-[var(--letter-spacing-label)] text-text-primary";
const acaoClasses = "tracking-[var(--letter-spacing-label)]";

export function ContactoWizard({
  lang,
  t,
  titulo,
  servicos,
  grupos,
  servicoInicial,
  privacyLinkLabel,
  optionalLabel,
  retryLabel,
  homeLabel,
  servicesLinkLabel,
}: {
  lang: Locale;
  t: Dict;
  /** Título da página ("Vamos conversar"). */
  titulo: string;
  servicos: { slug: string; titulo: string; familia: "A" | "B" }[];
  /** Rótulos das famílias no "O que precisa" (servicos.inicial / servicos.avancado). */
  grupos: { A: string; B: string };
  servicoInicial?: string;
  // Rótulo de institucional.termos.form.privacyLinkLabel (mesma tradução da ligação
  // nos Termos), passado pelo Server Component pai.
  privacyLinkLabel: string;
  /** "Opcional" no idioma da página (areaCliente.definicoes.perfil.optional). */
  optionalLabel: string;
  /** "Tentar outra vez" (erros.pagina.retry): a acção do passo 3 depois de uma falha. */
  retryLabel: string;
  /** "Início" (erros.naoEncontrada.home): volta ao início depois do envio. */
  homeLabel: string;
  /** "Ver o que fazemos" (home.hero.secondaryCta): depois do envio. */
  servicesLinkLabel: string;
}) {
  const OPCOES: SelectOption[] = [
    { value: "nao_sei", label: t.form.needOptions.nao_sei },
    ...servicos.map((servico) => ({
      value: servico.slug,
      label: servico.titulo,
      group: grupos[servico.familia],
    })),
  ];
  const locale = intlLocale[lang];

  const [passo, setPasso] = useState<Passo>("descrever");
  const tituloPassoRef = useRef<HTMLHeadingElement>(null);
  const tituloFimRef = useRef<HTMLHeadingElement>(null);
  const diasRef = useRef<HTMLDivElement>(null);
  const passoAnterior = useRef<Passo>(passo);

  useEffect(() => {
    // Só em mudanças de passo (não ao montar a página).
    if (passoAnterior.current === passo) return;
    passoAnterior.current = passo;
    window.scrollTo({ top: 0 });
    tituloPassoRef.current?.focus({ preventScroll: true });
  }, [passo]);

  // Depois do efeito do passo: quando há um campo a focar (erros), ganha ao título.
  const focarDepois = useFocoPendente();

  // Passo 1
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  // Valor de "O que precisa": um slug de `servicos`, ou "nao_sei".
  const [assunto, setAssunto] = useState(servicoInicial ?? "");
  const [mensagem, setMensagem] = useState("");
  const [erros, setErros] = useState<Erros>({});

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

  const ESTADOS_FINAIS: Estado[] = ["enviado", "parcial"];
  const terminado = ESTADOS_FINAIS.includes(estado);

  useEffect(() => {
    if (!terminado) return;
    window.scrollTo({ top: 0 });
    tituloFimRef.current?.focus({ preventScroll: true });
  }, [terminado]);

  const valores = { nome, email, assunto, mensagem };

  // Erro de um só campo com o valor dado (para blur e change).
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

  function escolherOutroDia() {
    setDiaEscolhido(null);
    setHoraEscolhida(null);
    diasRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
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
        focarDepois(ID_AVISO_ENVIO);
        return;
      }

      if (resposta.status === 400) {
        // O backend valida outra vez; se discordar, voltamos ao passo 1 com os erros.
        const dados = await resposta.json();
        const doBackend = dados.errors ?? {};
        // As mensagens do backend vêm em português: só em pt; em en/pl a validação local
        // (mesmas regras, chaves do dicionário) diz o mesmo no idioma da página.
        const locais = validar(valores, t.form.validation);
        const frase = (mensagem: string | undefined, local: string | undefined) =>
          mensagem ? (lang === "pt" ? mensagem : (local ?? t.result.failedTitle)) : undefined;
        const doServidor: Erros = {
          nome: frase(doBackend.name?.[0], locais.nome),
          email: frase(doBackend.email?.[0], locais.email ?? t.form.validation.emailFormat),
          assunto: frase(doBackend.need?.[0], locais.assunto ?? t.form.validation.needRequired),
          mensagem: frase(doBackend.message?.[0], locais.mensagem),
        };
        setErros(doServidor);
        // O efeito do passo foca o título; este foco (declarado depois) ganha-lhe.
        focarDepois(primeiroInvalido(doServidor, ORDEM));
        setPasso("descrever");
        setEstado("parado");
        return;
      }

      if (!resposta.ok) {
        setEstado("falhou");
        focarDepois(ID_AVISO_ENVIO);
        return;
      }

      const dados: { meeting_confirmed?: boolean } = await resposta.json();
      setEstado(reuniaoEscolhida && !dados.meeting_confirmed ? "parcial" : "enviado");
    } catch {
      setEstado("falhou");
      focarDepois(ID_AVISO_ENVIO);
    }
  }

  // Datas no formato do .pen ("ter 29 set · 10:00"): só formatação do Intl, sem copy.
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

  const reuniaoMarcada = querReuniao === "sim" && horaEscolhida ? horaEscolhida : null;
  const resumoReuniao = reuniaoMarcada ? resumoData(reuniaoMarcada) : null;
  const assuntoRotulo = OPCOES.find((opcao) => opcao.value === assunto)?.label ?? "";
  const passoNumero = passo === "descrever" ? 1 : passo === "reuniao" ? 2 : 3;

  const voltar = terminado
    ? null
    : passo === "reuniao"
      ? () => setPasso("descrever")
      : passo === "resumo"
        ? () => setPasso("reuniao")
        : null;

  // Introdução: no passo 1 (e no fim) o título abre a página; nos passos 2 e 3 o Voltar é a
  // primeira linha, antes do título (paddings de cada frame do .pen).
  const introducao = (
    <div
      className={cn(
        "flex flex-col pb-xl lg:pb-2xl",
        voltar ? "gap-md pt-lg lg:gap-lg lg:pt-xl" : "pt-2xl lg:pt-3xl",
      )}
    >
      {voltar ? (
        <div className="flex">
          <BackLink onClick={voltar} disabled={estado === "a-enviar"} label={t.actions.back} />
        </div>
      ) : null}
      <h1 className="font-heading text-headline leading-[var(--line-height-display)] font-bold tracking-[var(--letter-spacing-headline)] text-text-primary lg:text-display lg:tracking-[var(--letter-spacing-display)]">
        {titulo}
      </h1>
    </div>
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

          {!parcial && resumoReuniao && reuniaoMarcada ? (
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

          <div className="flex flex-col items-start gap-md pt-2xl md:flex-row md:items-center md:gap-lg">
            <ButtonLink href="/" variant="outline" size="action" className={acaoClasses}>
              {homeLabel}
            </ButtonLink>
            <Ligacao href="/servicos">{servicesLinkLabel}</Ligacao>
          </div>
        </div>
      </div>
    );
  }

  const estadoDe = (numero: number): EstadoPasso =>
    numero === passoNumero ? "agora" : numero < passoNumero ? "feito" : "por-fazer";

  const passos = [
    {
      titulo: t.steps.describe,
      resposta: [nome.trim(), assuntoRotulo].filter(Boolean).join(" · "),
    },
    {
      titulo: t.steps.meeting,
      resposta: resumoReuniao ?? t.summary.noMeeting,
    },
    { titulo: t.steps.summary, resposta: undefined },
  ];

  const cabecalho =
    passo === "descrever"
      ? { title: t.steps.describe, subtitle: undefined }
      : passo === "reuniao"
        ? { title: t.meeting.question, subtitle: t.meeting.hint }
        : { title: t.summary.title, subtitle: undefined };

  const acao = (conteudo: ReactNode) => <div className="flex justify-end">{conteudo}</div>;

  const semHorarios = dividirFrases(t.meeting.noSlots);
  const erroHorarios = dividirFrases(t.meeting.loadError);
  const diasDisponiveis = Object.keys(slots ?? {}).sort();

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
            <Field htmlFor="nome" label={t.form.nameLabel} error={erros.nome} variant="folha">
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
                <Field htmlFor="email" label={t.form.emailLabel} error={erros.email} variant="folha">
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
                  variant="folha"
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

            <Field htmlFor="assunto" label={t.form.needLabel} error={erros.assunto} variant="folha">
              <Select
                id="assunto"
                name="assunto"
                appearance="folha"
                value={assunto}
                options={OPCOES}
                placeholder={t.form.needPlaceholder}
                onChange={(proximo) => {
                  setAssunto(proximo);
                  aoMudar(setErros, "assunto", erroDe("assunto", proximo));
                }}
                onBlur={() => aoSair(setErros, "assunto", erroDe("assunto", assunto))}
              />
            </Field>

            <Field htmlFor="mensagem" label={t.form.messageLabel} error={erros.mensagem} variant="folha">
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
        </Folha>
      </form>
    );
  }

  if (passo === "reuniao") {
    const dia = diaEscolhido ? partesDia(diaEscolhido) : null;
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
        {/* Sim/Não num grupo nativo: fieldset com a pergunta como legenda (escondida à vista:
            o h2 do passo já a diz) e rádios com o mesmo name (as setas alternam). */}
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
            {slots === null ? (
              <div aria-busy className="flex flex-col gap-sm">
                <p className={rotuloGrupo}>{t.meeting.chooseDay}</p>
                <div className="flex gap-xs overflow-hidden">
                  {Array.from({ length: 5 }, (_, indice) => (
                    <EsqueletoBloco
                      key={indice}
                      className="h-[72px] w-[68px] shrink-0 rounded-[var(--input-radius)]"
                    />
                  ))}
                </div>
                <AProcurar>{t.meeting.loading}</AProcurar>
              </div>
            ) : erroSlots && diasDisponiveis.length === 0 ? (
              <Notice
                tone="warn"
                role="status"
                title={erroHorarios.titulo}
                description={erroHorarios.descricao}
              />
            ) : diasDisponiveis.length === 0 ? (
              <Notice
                tone="info"
                role="status"
                title={semHorarios.titulo}
                description={semHorarios.descricao}
              />
            ) : (
              <>
                {/* gap $space-sm = gap-xs + o pt-2xs da linha (folga do anel de foco). */}
                <div className="flex flex-col gap-xs">
                  <p id="reuniao-dia" className={rotuloGrupo}>
                    {t.meeting.chooseDay}
                  </p>
                  {/* Desliza na horizontal quando os dias não cabem (mobile). */}
                  <div
                    ref={diasRef}
                    role="group"
                    aria-labelledby="reuniao-dia"
                    className="-mx-2xs flex gap-xs overflow-x-auto px-2xs pt-2xs pb-xs"
                  >
                    {diasDisponiveis.map((chave) => {
                      const partes = partesDia(chave);
                      return (
                        <EscolhaDia
                          key={chave}
                          diaSemana={partes.diaSemana}
                          dia={partes.dia}
                          mes={partes.mes}
                          rotulo={partes.extenso}
                          escolhido={diaEscolhido === chave}
                          onEscolher={() => {
                            if (diaEscolhido !== chave) setHoraEscolhida(null);
                            setDiaEscolhido(chave);
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                {diaEscolhido && dia ? (
                  <div className="flex flex-col gap-xs">
                    <p id="reuniao-hora" className={rotuloGrupo}>
                      {t.meeting.chooseTime}
                    </p>
                    <p className="font-mono text-caption text-text-tertiary">{dia.extenso}</p>
                    <div
                      role="group"
                      aria-labelledby="reuniao-hora"
                      className="grid grid-cols-3 gap-xs pt-2xs md:grid-cols-6"
                    >
                      {(slots?.[diaEscolhido] ?? [])
                        .filter((slot) => isoParaDia(slot.start) === diaEscolhido)
                        .map((slot) => (
                          <EscolhaHora
                            key={slot.start}
                            hora={formatarHora(slot.start)}
                            escolhida={horaEscolhida === slot.start}
                            onEscolher={() => setHoraEscolhida(slot.start)}
                          />
                        ))}
                    </div>
                    <div className="flex pt-2xs">
                      <button
                        type="button"
                        onClick={escolherOutroDia}
                        className="inline-flex min-h-11 items-center rounded-[var(--button-radius)] px-sm font-body text-label font-medium tracking-[var(--letter-spacing-label)] text-text-primary transition-colors hover:bg-bg-surface-hover"
                      >
                        {t.meeting.changeDay}
                      </button>
                    </div>
                  </div>
                ) : null}
              </>
            )}
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
            <LinhaResumo rotulo={t.summary.needLabel} valor={assuntoRotulo} />
            <LinhaResumo rotulo={t.summary.messageLabel} valor={mensagem} />
            <LinhaResumo
              rotulo={t.summary.meetingLabel}
              valor={resumoReuniao ?? t.summary.noMeeting}
              mono={Boolean(resumoReuniao)}
              vazio={!resumoReuniao}
            />
          </dl>
        )}

        {/* Aviso de privacidade antes do envio (ds/display/nota-com-ligacao): caption
            $text-tertiary com a ligação na linha seguinte, em $text-link. */}
        {aEnviar || falhou || limite ? null : (
          <p className="pt-lg font-body text-caption tracking-[var(--letter-spacing-caption)] text-text-tertiary">
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
        {/* Coluna de passos (>= lg). */}
        <ol className="hidden border-t border-border-default lg:flex lg:w-[278px] lg:shrink-0 lg:flex-col">
          {passos.map((p, indice) => (
            <PassoAssistente
              key={p.titulo}
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
            title={cabecalho.title}
            subtitle={cabecalho.subtitle}
            titleRef={tituloPassoRef}
            className={cn(
              "pt-lg lg:pt-0",
              estado === "demasiados-pedidos" && passo === "resumo" ? "pb-lg" : "pb-xl",
            )}
          />
          <div className="w-full max-w-[704px]">{folha}</div>
        </div>
      </div>
    </div>
  );
}
