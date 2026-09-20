"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Info, Mail, Phone, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

// Frames: "Formulário" dentro de Página · Contacto (Nwccs / c9CDDw) do design-system.pen.
// Campos exactamente os do copy-draft.md §5: Nome, Email, Telefone (opcional),
// O que precisa (select) e Mensagem. Sem campos extra visíveis.
//
// `servicoInicial` chega da query string de /contacto (PRD-servicos.md §6, via CTA
// "Pedir uma proposta" nas fichas de /servicos/[slug]) e viaja como campo `service` no
// POST — não é um campo do formulário, é contexto que a ficha já sabia.

// Valores iguais aos do modelo `Need` do backend (apps/leads/models.py). Um único
// vocabulário entre site e backend, em vez de uma tabela de tradução que deriva
// silenciosamente com o tempo. As etiquetas é que são visíveis; os valores, não.
const NEED_VALUES = ["site", "melhorar", "avancado", "nao_sei"] as const;

type Campo = "nome" | "email" | "assunto" | "mensagem";
type Erros = Partial<Record<Campo, string>>;
type Dict = Dictionary["contacto"]["form"];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validar(
  valores: { nome: string; email: string; assunto: string; mensagem: string },
  t: Dict["validation"],
): Erros {
  const erros: Erros = {};

  if (!valores.nome.trim()) erros.nome = t.nameRequired;

  if (!valores.email.trim()) erros.email = t.emailRequired;
  else if (!EMAIL_PATTERN.test(valores.email.trim())) erros.email = t.emailInvalid;

  if (!valores.assunto) erros.assunto = t.needRequired;

  if (!valores.mensagem.trim()) erros.mensagem = t.messageRequired;

  return erros;
}

type Estado = "parado" | "a-enviar" | "enviado" | "falhou" | "demasiados-pedidos";

export function Formulario({
  lang,
  t,
  servicoInicial,
}: {
  lang: Locale;
  t: Dict;
  servicoInicial?: { slug: string; titulo: string };
}) {
  const OPCOES: SelectOption[] = NEED_VALUES.map((value) => ({
    value,
    label: t.needOptions[value],
  }));
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [servico, setServico] = useState(servicoInicial?.slug ?? "");
  const [erros, setErros] = useState<Erros>({});
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [estado, setEstado] = useState<Estado>("parado");

  // Honeypot: campo escondido que só bots preenchem (PRD-backend.md §4.4).
  const [website, setWebsite] = useState("");
  // Momento em que o formulário foi montado, para o backend distinguir um humano
  // de um bot que submete instantaneamente. Nenhuma fricção para o visitante.
  const montadoEm = useRef<number | null>(null);
  useEffect(() => {
    montadoEm.current = Date.now();
  }, []);

  const valores = { nome, email, assunto, mensagem };

  function revalidar(proximos: Partial<typeof valores>) {
    if (!tentouEnviar) return;
    setErros(validar({ ...valores, ...proximos }, t.validation));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTentouEnviar(true);

    const proximosErros = validar(valores, t.validation);
    setErros(proximosErros);
    if (Object.keys(proximosErros).length > 0) return;

    setEstado("a-enviar");

    try {
      const resposta = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang,
          name: nome,
          email,
          phone: telefone,
          need: assunto,
          service: servico,
          message: mensagem,
          website,
          elapsedSeconds:
            montadoEm.current === null
              ? undefined
              : Math.round((Date.now() - montadoEm.current) / 1000),
        }),
      });

      if (resposta.status === 429) {
        setEstado("demasiados-pedidos");
        return;
      }

      if (resposta.status === 400) {
        // O backend valida outra vez; se discordar, mostramos o que ele diz.
        const dados = await resposta.json();
        const doBackend = dados.errors ?? {};
        setErros({
          nome: doBackend.name?.[0],
          email: doBackend.email?.[0],
          assunto: doBackend.need?.[0],
          mensagem: doBackend.message?.[0],
        });
        setEstado("parado");
        return;
      }

      if (!resposta.ok) {
        setEstado("falhou");
        return;
      }

      setEstado("enviado");
      setNome("");
      setEmail("");
      setTelefone("");
      setAssunto("");
      setMensagem("");
      setErros({});
      setTentouEnviar(false);
    } catch {
      setEstado("falhou");
    }
  }

  return (
    <form noValidate onSubmit={onSubmit} className="relative flex flex-col gap-lg">
      {servico ? (
        <div className="flex items-center justify-between gap-sm rounded-[var(--radius-md)] border border-border-interactive bg-accent-primary-subtle px-md py-sm">
          <p className="font-body text-caption text-text-primary">
            {t.requestingProposal}{" "}
            <span className="font-semibold">{servicoInicial?.titulo}</span>.
          </p>
          <button
            type="button"
            onClick={() => setServico("")}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-text-secondary transition-colors hover:bg-bg-surface-hover hover:text-text-primary"
            aria-label={t.removeServiceAria}
          >
            <X size={16} strokeWidth={2} aria-hidden />
          </button>
        </div>
      ) : null}

      <Field htmlFor="nome" label={t.nameLabel} error={erros.nome}>
        <Input
          id="nome"
          name="nome"
          type="text"
          autoComplete="name"
          placeholder={t.namePlaceholder}
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

      <Field htmlFor="email" label={t.emailLabel} error={erros.email}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={t.emailPlaceholder}
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

      <Field htmlFor="telefone" label={t.phoneLabel} optional>
        <Input
          id="telefone"
          name="telefone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder={t.phonePlaceholder}
          value={telefone}
          onChange={(event) => setTelefone(event.target.value)}
          icon={<Phone size={20} strokeWidth={2} />}
        />
      </Field>

      <Field htmlFor="assunto" label={t.needLabel} error={erros.assunto}>
        <Select
          id="assunto"
          name="assunto"
          value={assunto}
          options={OPCOES}
          placeholder={t.needPlaceholder}
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
        label={t.messageLabel}
        hint={t.messageHint}
        error={erros.mensagem}
      >
        <Textarea
          id="mensagem"
          name="mensagem"
          rows={4}
          placeholder={t.messagePlaceholder}
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
        <label htmlFor="website">{t.honeypotLabel}</label>
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

      <Button
        type="submit"
        size="lg"
        className="w-full lg:w-auto lg:self-start"
        disabled={estado === "a-enviar"}
      >
        {estado === "a-enviar" ? t.sending : t.submit}
      </Button>

      {estado === "enviado" ? (
        <div
          role="status"
          className="flex items-start gap-md rounded-[var(--card-radius)] border border-feedback-success-border bg-feedback-success-bg p-[var(--space-component-inset-md)]"
        >
          <CheckCircle2
            size={24}
            strokeWidth={2}
            aria-hidden
            className="shrink-0 text-feedback-success-fg"
          />
          <div className="flex flex-col gap-2xs">
            <p className="font-body text-body font-semibold text-text-primary">
              {t.successTitle}
            </p>
            <p className="font-body text-body text-text-secondary">
              {t.successText}
            </p>
          </div>
        </div>
      ) : null}

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
              {estado === "demasiados-pedidos"
                ? t.tooManyTitle
                : t.failedTitle}
            </p>
            <p className="font-body text-body text-text-secondary">
              {estado === "demasiados-pedidos"
                ? t.tooManyText
                : t.failedText}
            </p>
          </div>
        </div>
      ) : null}
    </form>
  );
}
