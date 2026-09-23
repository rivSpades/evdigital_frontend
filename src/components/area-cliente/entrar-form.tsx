"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Info } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, Input, PasswordInput } from "@/components/ui/input";
import { localizePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";

// Ecrã "Área de Cliente · Entrar e criar conta" (m2pAVi) do design-system.pen.
// Um só cartão, dois separadores — não duas páginas distintas, para o pedido de
// autenticação e o de registo partilharem o mesmo enquadramento visual.

type Aba = "entrar" | "criar-conta";

type ErrosEntrar = Partial<Record<"email" | "password" | "geral", string>>;
type ErrosRegisto = Partial<
  Record<"name" | "email" | "phone" | "password" | "confirmPassword" | "geral", string>
>;

export function EntrarForm({
  erroGoogle = false,
  lang,
  t,
}: {
  erroGoogle?: boolean;
  lang: Locale;
  t: Dictionary["areaCliente"]["entrar"];
}) {
  const router = useRouter();
  const [aba, setAba] = useState<Aba>("entrar");

  // --- Entrar -------------------------------------------------------------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errosEntrar, setErrosEntrar] = useState<ErrosEntrar>({});
  const [aEntrar, setAEntrar] = useState(false);

  async function onEntrar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrosEntrar({});
    setAEntrar(true);
    try {
      const resposta = await fetch("/api/area-cliente/entrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (resposta.status === 403) {
        const dados = await resposta.json();
        if (dados.error === "conta_por_confirmar") {
          setErrosEntrar({
            geral: t.errUnconfirmed,
          });
          return;
        }
      }

      if (resposta.status === 400) {
        const dados = await resposta.json();
        setErrosEntrar({
          // As mensagens de validação do backend vêm em português: só as usamos em pt.
          geral:
            (lang === "pt"
              ? (dados.errors?.non_field_errors?.[0] ?? dados.errors?.email?.[0])
              : undefined) ?? t.errCredentials,
        });
        return;
      }

      if (!resposta.ok) {
        setErrosEntrar({ geral: t.errLogin });
        return;
      }

      router.push(localizePath(lang, "/area-cliente/projetos"));
      router.refresh();
    } catch {
      setErrosEntrar({ geral: t.errLogin });
    } finally {
      setAEntrar(false);
    }
  }

  // --- Criar conta ----------------------------------------------------------
  const [nome, setNome] = useState("");
  const [emailRegisto, setEmailRegisto] = useState("");
  const [telefone, setTelefone] = useState("");
  const [passwordRegisto, setPasswordRegisto] = useState("");
  const [confirmarPasswordRegisto, setConfirmarPasswordRegisto] = useState("");
  const [errosRegisto, setErrosRegisto] = useState<ErrosRegisto>({});
  const [aRegistar, setARegistar] = useState(false);
  const [contaCriada, setContaCriada] = useState(false);

  async function onRegistar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrosRegisto({});

    if (passwordRegisto !== confirmarPasswordRegisto) {
      setErrosRegisto({ confirmPassword: t.errPasswordMismatch });
      return;
    }

    setARegistar(true);
    try {
      const resposta = await fetch("/api/area-cliente/registar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nome,
          email: emailRegisto,
          phone: telefone,
          password: passwordRegisto,
        }),
      });

      if (resposta.status === 400) {
        const dados = await resposta.json();
        const erros = dados.errors ?? {};
        setErrosRegisto({
          name: erros.name?.[0],
          email: erros.email?.[0],
          password: erros.password?.[0],
        });
        return;
      }

      if (!resposta.ok) {
        setErrosRegisto({ geral: t.errRegister });
        return;
      }

      setContaCriada(true);
    } catch {
      setErrosRegisto({ geral: t.errRegister });
    } finally {
      setARegistar(false);
    }
  }

  return (
    <div className="flex w-full max-w-[520px] flex-col gap-lg rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface p-lg lg:p-xl">
      <div className="flex gap-3xs rounded-[var(--radius-pill)] bg-bg-surface-sunken p-3xs">
        {(["entrar", "criar-conta"] as const).map((valor) => (
          <button
            key={valor}
            type="button"
            onClick={() => setAba(valor)}
            className={cn(
              "h-11 flex-1 rounded-[var(--radius-pill)] font-body text-label font-semibold transition-colors",
              aba === valor
                ? "bg-accent-primary text-text-on-accent"
                : "text-text-secondary hover:text-text-primary",
            )}
          >
            {valor === "entrar" ? t.tabEntrar : t.tabCriarConta}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-md">
        {erroGoogle ? (
          <p role="alert" className="flex items-start gap-sm font-body text-body text-feedback-error-fg">
            <Info size={20} strokeWidth={2} aria-hidden className="mt-0.5 shrink-0" />
            {t.googleError}
          </p>
        ) : null}
        {/* Navegação completa (não fetch): o fluxo OAuth redireciona para o Google. Não é um
            link (o `ButtonLink` prefixaria o idioma e /api não vive em [lang]); o idioma
            vai em `?lang=` para o handler o levar de volta no regresso. */}
        <Button
          type="button"
          variant="secondary"
          size="lg"
          fullWidth
          onClick={() => window.location.assign(`/api/area-cliente/google?lang=${lang}`)}
        >
          <GoogleIcon />
          {t.google}
        </Button>
        <div className="flex items-center gap-md" aria-hidden>
          <span className="h-px flex-1 bg-border-subtle" />
          <span className="font-body text-caption text-text-tertiary">{t.or}</span>
          <span className="h-px flex-1 bg-border-subtle" />
        </div>
      </div>

      {aba === "entrar" ? (
        <form noValidate onSubmit={onEntrar} className="flex flex-col gap-lg">
          <Field htmlFor="entrar-email" label={t.email}>
            <Input
              id="entrar-email"
              type="email"
              autoComplete="email"
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field htmlFor="entrar-password" label={t.password}>
            <PasswordInput
              id="entrar-password"
              autoComplete="current-password"
              value={password}
              showLabel={t.showPassword}
              hideLabel={t.hidePassword}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          {errosEntrar.geral ? (
            <p role="alert" className="flex items-start gap-sm font-body text-body text-feedback-error-fg">
              <Info size={20} strokeWidth={2} aria-hidden className="mt-0.5 shrink-0" />
              {errosEntrar.geral}
            </p>
          ) : null}

          <Button type="submit" size="lg" fullWidth disabled={aEntrar}>
            {aEntrar ? t.submitting : t.submit}
          </Button>
        </form>
      ) : contaCriada ? (
        <div className="flex items-start gap-md rounded-[var(--card-radius)] border border-feedback-success-border bg-feedback-success-bg p-md">
          <CheckCircle2 size={24} strokeWidth={2} aria-hidden className="shrink-0 text-feedback-success-fg" />
          <div className="flex flex-col gap-2xs">
            <p className="font-body text-body font-semibold text-text-primary">
              {t.createdTitle}
            </p>
            <p className="font-body text-body text-text-secondary">
              {t.createdBody.replace("{email}", emailRegisto)}
            </p>
          </div>
        </div>
      ) : (
        <form noValidate onSubmit={onRegistar} className="flex flex-col gap-lg">
          <Field htmlFor="registo-nome" label={t.name} error={errosRegisto.name}>
            <Input
              id="registo-nome"
              placeholder={t.namePlaceholder}
              value={nome}
              invalid={Boolean(errosRegisto.name)}
              onChange={(e) => setNome(e.target.value)}
            />
          </Field>
          <Field htmlFor="registo-email" label={t.email} error={errosRegisto.email}>
            <Input
              id="registo-email"
              type="email"
              autoComplete="email"
              placeholder={t.emailPlaceholder}
              value={emailRegisto}
              invalid={Boolean(errosRegisto.email)}
              onChange={(e) => setEmailRegisto(e.target.value)}
            />
          </Field>
          <Field htmlFor="registo-telefone" label={t.phone} optional>
            <Input
              id="registo-telefone"
              type="tel"
              autoComplete="tel"
              placeholder={t.phonePlaceholder}
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </Field>
          <Field
            htmlFor="registo-password"
            label={t.password}
            hint={t.passwordHint}
            error={errosRegisto.password}
          >
            <PasswordInput
              id="registo-password"
              autoComplete="new-password"
              value={passwordRegisto}
              invalid={Boolean(errosRegisto.password)}
              showLabel={t.showPassword}
              hideLabel={t.hidePassword}
              onChange={(e) => setPasswordRegisto(e.target.value)}
            />
          </Field>
          <Field
            htmlFor="registo-confirmar-password"
            label={t.confirmPassword}
            error={errosRegisto.confirmPassword}
          >
            <PasswordInput
              id="registo-confirmar-password"
              autoComplete="new-password"
              value={confirmarPasswordRegisto}
              invalid={Boolean(errosRegisto.confirmPassword)}
              showLabel={t.showPassword}
              hideLabel={t.hidePassword}
              onChange={(e) => setConfirmarPasswordRegisto(e.target.value)}
            />
          </Field>

          {errosRegisto.geral ? (
            <p role="alert" className="font-body text-body text-feedback-error-fg">
              {errosRegisto.geral}
            </p>
          ) : null}

          <Button type="submit" size="lg" fullWidth disabled={aRegistar}>
            {aRegistar ? t.registering : t.register}
          </Button>
          <p className="text-center font-body text-caption text-text-tertiary">
            {t.registerNote}
          </p>
        </form>
      )}

      {aba === "entrar" ? (
        <div className="flex flex-col items-center gap-xs border-t border-border-subtle pt-lg">
          <p className="font-body text-body text-text-secondary">
            {t.contactPrompt}
          </p>
          <ButtonLink href="/contacto" variant="tertiary">
            {t.contactCta}
          </ButtonLink>
        </div>
      ) : null}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z" />
      <path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.600 10.8l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.500 0 11.900-2.100 15.900-5.800l-7.6-5.900c-2.100 1.400-4.900 2.300-8.300 2.300-6.300 0-11.600-4.100-13.500-9.800l-7.900 6.100C6.500 42.600 14.600 48 24 48z" />
    </svg>
  );
}
