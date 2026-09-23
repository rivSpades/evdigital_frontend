"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { localizePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Perfil } from "@/lib/area-cliente/types";

type Erros = Partial<Record<"name" | "geral", string>>;

export function PerfilForm({
  perfil,
  lang,
  t,
}: {
  perfil: Perfil;
  lang: Locale;
  t: Dictionary["areaCliente"]["definicoes"]["perfil"];
}) {
  const router = useRouter();
  const [nome, setNome] = useState(perfil.name);
  const [telefone, setTelefone] = useState(perfil.phone);
  const [empresa, setEmpresa] = useState(perfil.company);
  const [nif, setNif] = useState(perfil.nif);
  // Baseline dos valores guardados — separado do prop `perfil` porque um
  // `router.refresh()` não reinicia o `useState` (o componente não desmonta). Move-se a
  // par de cada gravação com sucesso, para o botão voltar a desactivar sem alterações.
  const [guardado, setGuardado] = useState({
    name: perfil.name,
    phone: perfil.phone,
    company: perfil.company,
    nif: perfil.nif,
  });
  const [erros, setErros] = useState<Erros>({});
  const [aGuardar, setAGuardar] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const temAlteracoes =
    nome !== guardado.name ||
    telefone !== guardado.phone ||
    empresa !== guardado.company ||
    nif !== guardado.nif;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErros({});
    setSucesso(false);

    if (!nome.trim()) {
      setErros({ name: t.errName });
      return;
    }

    setAGuardar(true);
    try {
      const resposta = await fetch("/api/area-cliente/definicoes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nome, phone: telefone, company: empresa, nif }),
      });

      if (resposta.status === 401) {
        router.push(localizePath(lang, "/area-cliente/entrar"));
        return;
      }

      if (resposta.status === 400) {
        const dados = await resposta.json();
        const e = dados.errors ?? {};
        setErros({ name: e.name?.[0] });
        return;
      }

      if (!resposta.ok) {
        setErros({ geral: t.errGeneral });
        return;
      }

      setGuardado({ name: nome, phone: telefone, company: empresa, nif });
      setSucesso(true);
      router.refresh();
    } catch {
      setErros({ geral: t.errGeneral });
    } finally {
      setAGuardar(false);
    }
  }

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-lg">
      <Field htmlFor="perfil-nome" label={t.name} error={erros.name}>
        <Input
          id="perfil-nome"
          placeholder={t.namePlaceholder}
          value={nome}
          invalid={Boolean(erros.name)}
          onChange={(e) => setNome(e.target.value)}
        />
      </Field>

      <Field htmlFor="perfil-email" label={t.email} hint={t.emailNote}>
        <Input id="perfil-email" value={perfil.email} disabled />
      </Field>

      <Field htmlFor="perfil-telefone" label={t.phone} optional>
        <Input
          id="perfil-telefone"
          type="tel"
          autoComplete="tel"
          placeholder={t.phonePlaceholder}
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
      </Field>

      <Field htmlFor="perfil-empresa" label={t.company} optional>
        <Input
          id="perfil-empresa"
          placeholder={t.companyPlaceholder}
          value={empresa}
          onChange={(e) => setEmpresa(e.target.value)}
        />
      </Field>

      <Field htmlFor="perfil-nif" label={t.nif} optional>
        <Input
          id="perfil-nif"
          placeholder={t.nifPlaceholder}
          value={nif}
          onChange={(e) => setNif(e.target.value)}
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

      <Button
        type="submit"
        size="lg"
        disabled={aGuardar || !temAlteracoes}
        className="w-full sm:w-auto"
      >
        {aGuardar ? t.submitting : t.submit}
      </Button>
    </form>
  );
}
