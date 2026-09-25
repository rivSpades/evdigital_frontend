"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Folha } from "@/components/ui/folha";
import { Field, Input } from "@/components/ui/input";
import { aoMudar, aoSair, primeiroInvalido, useFocoPendente } from "@/components/ui/formulario";
import { Notice } from "@/components/ui/notice";
import { useHrefAreaCliente } from "@/i18n/area-cliente-host";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Perfil } from "@/lib/area-cliente/types";

// Frames "Definições · Perfil" (B4z4zG / r8ue7 e estados) do grupo "v2 · A vez" do
// design-system.pen: o formulário numa ds/layout/folha, email desactivado com a nota
// "Para mudar o email, fale connosco.", sucesso e erro como ds/feedback/notice no topo.

//
// Micro-interacções (design-guardrails.md §6): o erro do nome em blur ou ao submeter, some
// quando fica válido; ao submeter com erros o foco vai para o nome (ou para o aviso geral,
// num erro do servidor); botão em espera com aria-busy e a mesma largura.

type Erros = Partial<Record<"name" | "geral", string>>;

const ORDEM: [string, string][] = [
  ["name", "perfil-nome"],
  ["geral", "perfil-erro"],
];

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
  const hrefAreaCliente = useHrefAreaCliente();
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
  const focarDepois = useFocoPendente();

  const validarNome = (valor: string) => (valor.trim() ? undefined : t.errName);

  // Erros com o foco no primeiro inválido (ou no aviso geral).
  function mostrarErros(proximos: Erros) {
    setErros(proximos);
    focarDepois(primeiroInvalido(proximos, ORDEM));
  }

  const temAlteracoes =
    nome !== guardado.name ||
    telefone !== guardado.phone ||
    empresa !== guardado.company ||
    nif !== guardado.nif;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (aGuardar) return;
    setSucesso(false);

    const erroNome = validarNome(nome);
    if (erroNome) {
      mostrarErros({ name: erroNome });
      return;
    }
    setErros({});

    setAGuardar(true);
    try {
      const resposta = await fetch("/api/area-cliente/definicoes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nome, phone: telefone, company: empresa, nif }),
      });

      if (resposta.status === 401) {
        router.push(hrefAreaCliente(lang, "/area-cliente/entrar"));
        return;
      }

      if (resposta.status === 400) {
        const dados = await resposta.json();
        const e = dados.errors ?? {};
        // Erros sem campo próprio (telefone, empresa, NIF, non_field_errors) chegam em `geral`.
        // A frase do Django (em português) só em pt; nos outros idiomas a chave do campo.
        const name = e.name?.[0] ? (lang === "pt" ? e.name[0] : t.errName) : undefined;
        // Um 400 sem nenhum erro conhecido não pode ficar sem aviso.
        mostrarErros({ name, geral: e.geral || !name ? t.errGeneral : undefined });
        return;
      }

      if (!resposta.ok) {
        mostrarErros({ geral: t.errGeneral });
        return;
      }

      setGuardado({ name: nome, phone: telefone, company: empresa, nif });
      setSucesso(true);
      // O botão desactivou-se (em espera e depois sem alterações): o foco vai para a
      // confirmação em vez de ficar em <body>.
      focarDepois("perfil-ok");
      router.refresh();
    } catch {
      mostrarErros({ geral: t.errGeneral });
    } finally {
      setAGuardar(false);
    }
  }

  return (
    <form noValidate onSubmit={onSubmit} className="w-full">
      <Folha
        actions={
          <Button
            type="submit"
            size="action"
            busy={aGuardar}
            disabled={!temAlteracoes}
            className="w-full sm:w-fit"
          >
            {aGuardar ? t.submitting : t.submit}
          </Button>
        }
      >
        {erros.geral ? (
          <Notice id="perfil-erro" focavel tone="error" role="alert" title={erros.geral} />
        ) : null}
        {sucesso ? <Notice id="perfil-ok" focavel tone="ok" role="status" title={t.success} /> : null}

        <Field htmlFor="perfil-nome" label={t.name} error={erros.name}>
          <Input
            id="perfil-nome"
            autoComplete="name"
            placeholder={t.namePlaceholder}
            value={nome}
            onChange={(e) => {
              setNome(e.target.value);
              aoMudar(setErros, "name", validarNome(e.target.value));
            }}
            onBlur={(e) => aoSair(setErros, "name", validarNome(e.target.value))}
          />
        </Field>

        <Field htmlFor="perfil-email" label={t.email} hint={t.emailNote}>
          <Input id="perfil-email" value={perfil.email} disabled />
        </Field>

        <Field
          htmlFor="perfil-telefone"
          label={t.phone}
          optional
          optionalLabel={t.optional}
        >
          <Input
            id="perfil-telefone"
            type="tel"
            autoComplete="tel"
            placeholder={t.phonePlaceholder}
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </Field>

        <Field
          htmlFor="perfil-empresa"
          label={t.company}
          optional
          optionalLabel={t.optional}
        >
          <Input
            id="perfil-empresa"
            autoComplete="organization"
            placeholder={t.companyPlaceholder}
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
          />
        </Field>

        <Field
          htmlFor="perfil-nif"
          label={t.nif}
          optional
          optionalLabel={t.optional}
        >
          <Input
            id="perfil-nif"
            placeholder={t.nifPlaceholder}
            value={nif}
            onChange={(e) => setNif(e.target.value)}
          />
        </Field>
      </Folha>
    </form>
  );
}
