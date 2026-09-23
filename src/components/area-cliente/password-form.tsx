"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, PasswordInput } from "@/components/ui/input";
import { localizePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type Erros = Partial<Record<"oldPassword" | "newPassword" | "confirmPassword" | "geral", string>>;

export function PasswordForm({
  lang,
  t,
}: {
  lang: Locale;
  t: Dictionary["areaCliente"]["definicoes"]["seguranca"];
}) {
  const router = useRouter();
  const [passwordAntiga, setPasswordAntiga] = useState("");
  const [passwordNova, setPasswordNova] = useState("");
  const [confirmarPasswordNova, setConfirmarPasswordNova] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [aMudar, setAMudar] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErros({});
    setSucesso(false);

    if (passwordNova !== confirmarPasswordNova) {
      setErros({ confirmPassword: t.errPasswordMismatch });
      return;
    }

    setAMudar(true);
    try {
      const resposta = await fetch("/api/area-cliente/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ old_password: passwordAntiga, new_password: passwordNova }),
      });

      if (resposta.status === 401) {
        router.push(localizePath(lang, "/area-cliente/entrar"));
        return;
      }

      if (resposta.status === 400) {
        const dados = await resposta.json();
        const e = dados.errors ?? {};
        setErros({
          oldPassword: e.old_password?.[0] ? t.errOldPassword : undefined,
          newPassword: e.new_password?.[0] ? t.errNewPassword : undefined,
        });
        return;
      }

      if (!resposta.ok) {
        setErros({ geral: t.errGeneral });
        return;
      }

      setSucesso(true);
      setPasswordAntiga("");
      setPasswordNova("");
      setConfirmarPasswordNova("");
    } catch {
      setErros({ geral: t.errGeneral });
    } finally {
      setAMudar(false);
    }
  }

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-lg">
      <p className="font-body text-body text-text-secondary">{t.intro}</p>

      <Field htmlFor="password-antiga" label={t.oldPassword} error={erros.oldPassword}>
        <PasswordInput
          id="password-antiga"
          autoComplete="current-password"
          value={passwordAntiga}
          invalid={Boolean(erros.oldPassword)}
          showLabel={t.showPassword}
          hideLabel={t.hidePassword}
          onChange={(e) => setPasswordAntiga(e.target.value)}
        />
      </Field>

      <Field
        htmlFor="password-nova"
        label={t.newPassword}
        hint={t.newPasswordHint}
        error={erros.newPassword}
      >
        <PasswordInput
          id="password-nova"
          autoComplete="new-password"
          value={passwordNova}
          invalid={Boolean(erros.newPassword)}
          showLabel={t.showPassword}
          hideLabel={t.hidePassword}
          onChange={(e) => setPasswordNova(e.target.value)}
        />
      </Field>

      <Field
        htmlFor="password-confirmar"
        label={t.confirmPassword}
        error={erros.confirmPassword}
      >
        <PasswordInput
          id="password-confirmar"
          autoComplete="new-password"
          value={confirmarPasswordNova}
          invalid={Boolean(erros.confirmPassword)}
          showLabel={t.showPassword}
          hideLabel={t.hidePassword}
          onChange={(e) => setConfirmarPasswordNova(e.target.value)}
        />
      </Field>

      {erros.geral ? (
        <p role="alert" className="flex items-start gap-sm font-body text-body text-feedback-error-fg">
          <Info size={20} strokeWidth={2} aria-hidden className="mt-0.5 shrink-0" />
          {erros.geral}
        </p>
      ) : null}

      {sucesso ? (
        <p className="flex items-start gap-sm font-body text-body text-feedback-success-fg">
          <CheckCircle2 size={20} strokeWidth={2} aria-hidden className="mt-0.5 shrink-0" />
          {t.success}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={aMudar} className="w-full sm:w-auto">
        {aMudar ? t.submitting : t.submit}
      </Button>
    </form>
  );
}
