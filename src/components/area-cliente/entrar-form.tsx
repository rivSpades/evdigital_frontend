"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BackLink } from "@/components/area-cliente/back-link";
import { AuthSection } from "@/components/area-cliente/auth-shell";
import { FactoEmail, useFormularioAuth } from "@/components/area-cliente/formulario-auth";
import { SEM_ANEL, aoMudar, aoSair, primeiroInvalido } from "@/components/ui/formulario";
import { BlocoDaVez } from "@/components/ui/bloco-da-vez";
import { Button } from "@/components/ui/button";
import { DivisorTexto } from "@/components/ui/divisor-texto";
import { Folha } from "@/components/ui/folha";
import { Field, Input, PasswordInput } from "@/components/ui/input";
import { Ligacao } from "@/components/ui/ligacao";
import { Notice } from "@/components/ui/notice";
import { SeparadoresPaginas } from "@/components/ui/separadores";
import { useHrefAreaCliente } from "@/i18n/area-cliente-host";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

// Frames "Ecrã · Entrar" do grupo "v2 · A vez" (flhgP) do design-system.pen: entrar
// (Iid42 / uoTG9), criar conta (YiF5F / p0u2CK), a entrar (FKNAa / polCG), credenciais
// erradas (g1GyRy / LBb5j), email por confirmar (HRqnS / uKaGO), falha Google (d30jk /
// c5VSrp), criar conta com erros (W8bOT / qsf9f) e conta criada (UsrBf / oyNGn). O pedido
// de ligação para repor a palavra-passe tem rota própria (/recuperar-palavra-passe,
// `RecuperarForm`).
// Duas páginas (decisão do dono, 2026-09-24): /entrar e /criar-conta, cada uma com o seu
// <h1> (sr-only) e, no topo da coluna, "Entrar | Criar conta" como navegação entre as duas
// (`SeparadoresPaginas`: <nav> com aria-current, não separadores). Por baixo da folha só
// "ou" e "Continuar com Google". Na coluna de 448 centrada e encostada ao topo do
// `AuthSection`. Em /entrar, "Esqueceu a palavra-passe?" é uma ligação para
// /recuperar-palavra-passe. Sem convite de contacto (retirado pelo dono, 2026-09-24).
//
// Acessibilidade: rótulos visíveis, autocomplete por campo, erros por campo ligados por
// aria-describedby e anunciados (role="alert"); ao submeter com erros de campo o foco vai
// para o primeiro campo inválido. Nada recebe foco ao carregar: o foco só acompanha as
// mudanças de estado que o utilizador provoca (confirmações).

type Modo = "entrar" | "criar-conta" | "por-confirmar";

type ErrosEntrar = Partial<Record<"email" | "password" | "geral", string>>;
type ErrosRegisto = Partial<
  Record<"name" | "email" | "phone" | "password" | "confirmPassword" | "geral", string>
>;

// Frase exacta do Django para email já registado (`RegisterSerializer.validate_email`):
// é a única forma de a distinguir de outros erros do campo fora de pt.
const CONTA_JA_EXISTE = "Já existe uma conta com este email.";

/**
 * Frases por campo para os erros de validação do backend fora de pt (o Django responde
 * em português). Chaves já existentes noutros namespaces com o mesmo sentido: contacto
 * (nome, email) e definições (comprimento da palavra-passe), passadas pela página.
 */
export type EntrarCampos = {
  nameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  emailFormat: string;
  passwordLength: string;
  optional: string;
};

// Ordem visual dos campos; sem erro de campo, o foco vai para o aviso geral (erro do
// servidor), nunca fica em <body> depois de o botão em espera se desactivar.
const ORDEM_ENTRAR: [string, string][] = [
  ["email", "entrar-email"],
  ["password", "entrar-password"],
  ["geral", "entrar-erro"],
];
const ORDEM_REGISTO: [string, string][] = [
  ["name", "registo-nome"],
  ["email", "registo-email"],
  ["password", "registo-password"],
  ["confirmPassword", "registo-confirmar-password"],
  ["geral", "registo-erro"],
];

/** Mínimo de caracteres da palavra-passe nova (validador do Django, `passwordHint`). */
const PASSWORD_MIN = 8;

export function EntrarForm({
  pagina,
  erroGoogle = false,
  reposta = false,
  lang,
  campos,
  t,
}: {
  /** Página: /entrar ou /criar-conta. */
  pagina: "entrar" | "criar-conta";
  erroGoogle?: boolean;
  /** Chegou de /repor-palavra-passe com a palavra-passe nova definida. */
  reposta?: boolean;
  lang: Locale;
  campos: EntrarCampos;
  t: Dictionary["areaCliente"]["entrar"];
}) {
  const router = useRouter();
  const hrefAreaCliente = useHrefAreaCliente();

  // Validação, erros do backend e foco no primeiro inválido: partilhados com o
  // `RecuperarForm` (formulario-auth.tsx, micro-interacções de design-guardrails.md §6).
  const { focarDepois, validarEmail, doBackend, erroEmail } = useFormularioAuth(lang, campos);

  const [modo, setModo] = useState<Modo>(pagina);

  // --- Entrar -------------------------------------------------------------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errosEntrar, setErrosEntrar] = useState<ErrosEntrar>({});
  const [aEntrar, setAEntrar] = useState(false);

  async function onEntrar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (aEntrar) return;
    const locais: ErrosEntrar = {
      email: validarEmail(email),
      password: password ? undefined : t.errPasswordRequired,
    };
    if (locais.email || locais.password) {
      setErrosEntrar(locais);
      focarDepois(primeiroInvalido(locais, ORDEM_ENTRAR));
      return;
    }
    setErrosEntrar({});
    setAEntrar(true);
    try {
      const resposta = await fetch("/api/area-cliente/entrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // `lang`: se a conta estiver por confirmar, a ligação reenviada abre neste idioma.
        body: JSON.stringify({ email, password, lang }),
      });

      if (resposta.status === 403) {
        const dados = await resposta.json();
        if (dados.error === "conta_por_confirmar") {
          // Frame "Entrar · email por confirmar" (HRqnS / uKaGO): o bloco da vez troca a
          // folha, com o email da conta como facto; o Django já reenviou a ligação.
          setModo("por-confirmar");
          return;
        }
      }

      if (resposta.status === 400) {
        const dados = await resposta.json();
        const e = dados.errors ?? {};
        // Campos vazios ou email inválido: erro em cada campo (aria-invalid + ligado por
        // aria-describedby, via `Field`). Credenciais erradas: aviso geral.
        if (e.email || e.password) {
          const doServidor: ErrosEntrar = {
            email: erroEmail(e.email?.[0], email, t.errCredentials),
            // O Django só devolve erro no campo quando vem vazio.
            password: doBackend(e.password?.[0], t.errPasswordRequired),
          };
          setErrosEntrar(doServidor);
          focarDepois(primeiroInvalido(doServidor, ORDEM_ENTRAR));
          return;
        }
        setErrosEntrar({
          // As mensagens de validação do backend vêm em português: só as usamos em pt.
          geral: (lang === "pt" ? e.non_field_errors?.[0] : undefined) ?? t.errCredentials,
        });
        focarDepois("entrar-erro");
        return;
      }

      if (!resposta.ok) {
        setErrosEntrar({ geral: t.errLogin });
        focarDepois("entrar-erro");
        return;
      }

      router.push(hrefAreaCliente(lang, "/area-cliente/projetos"));
      router.refresh();
    } catch {
      setErrosEntrar({ geral: t.errLogin });
      focarDepois("entrar-erro");
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

  const validarNome = (valor: string) => (valor.trim() ? undefined : campos.nameRequired);
  const validarPassword = (valor: string) =>
    valor.length >= PASSWORD_MIN ? undefined : campos.passwordLength;
  const validarConfirmacao = (valor: string, original = passwordRegisto) =>
    valor === original ? undefined : t.errPasswordMismatch;

  async function onRegistar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (aRegistar) return;
    const locais: ErrosRegisto = {
      name: validarNome(nome),
      email: validarEmail(emailRegisto),
      password: validarPassword(passwordRegisto),
      confirmPassword: validarConfirmacao(confirmarPasswordRegisto),
    };
    if (Object.values(locais).some(Boolean)) {
      setErrosRegisto(locais);
      focarDepois(primeiroInvalido(locais, ORDEM_REGISTO));
      return;
    }
    setErrosRegisto({});

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
          lang,
        }),
      });

      if (resposta.status === 400) {
        const dados = await resposta.json();
        const erros = dados.errors ?? {};
        const doServidor: ErrosRegisto = {
          name: doBackend(erros.name?.[0], campos.nameRequired),
          email: erroEmail(
            erros.email?.[0],
            emailRegisto,
            erros.email?.[0] === CONTA_JA_EXISTE ? t.errEmailTaken : t.errRegister,
          ),
          password: doBackend(erros.password?.[0], campos.passwordLength),
          // Telefone e non_field_errors não têm erro por campo: chegam em `geral`.
          geral: erros.geral ? t.errRegister : undefined,
        };
        setErrosRegisto(doServidor);
        focarDepois(primeiroInvalido(doServidor, ORDEM_REGISTO));
        return;
      }

      if (!resposta.ok) {
        setErrosRegisto({ geral: t.errRegister });
        focarDepois("registo-erro");
        return;
      }

      setContaCriada(true);
    } catch {
      setErrosRegisto({ geral: t.errRegister });
      focarDepois("registo-erro");
    } finally {
      setARegistar(false);
    }
  }

  const blocoRef = useRef<HTMLDivElement>(null);

  // Ao mudar de estado o foco acompanha: nas confirmações vai para o bloco (que é anunciado
  // por role="status"). Só quando o estado muda de facto: ao carregar nada recebe foco.
  // Comparar com o estado anterior (e não usar uma flag de "primeira vez") aguenta o duplo
  // efeito do StrictMode em dev.
  const modoAnterior = useRef(modo);
  useEffect(() => {
    if (modoAnterior.current === modo) return;
    modoAnterior.current = modo;
    if (modo === "por-confirmar") blocoRef.current?.focus();
  }, [modo]);

  useEffect(() => {
    if (contaCriada) blocoRef.current?.focus();
  }, [contaCriada]);

  // "Continuar com Google": em espera até o browser sair para o Google. Ao voltar pelo
  // histórico (bfcache) a página reaparece como ficou: tira-se a espera.
  const [aIrGoogle, setAIrGoogle] = useState(false);
  useEffect(() => {
    const aoMostrar = (event: PageTransitionEvent) => {
      if (event.persisted) setAIrGoogle(false);
    };
    window.addEventListener("pageshow", aoMostrar);
    return () => window.removeEventListener("pageshow", aoMostrar);
  }, []);

  const irParaEntrar = () => setModo("entrar");

  // --- Email por confirmar -------------------------------------------------------
  // Frames HRqnS / uKaGO: o bloco da vez no lugar da folha, com o email como facto. A
  // frase é a do React (errUnconfirmed), que já diz que a ligação foi reenviada.
  if (modo === "por-confirmar") {
    return (
      <AuthSection back={<BackLink onClick={irParaEntrar} label={t.backToLogin} />}>
        <div ref={blocoRef} tabIndex={-1} role="status" className="mt-xl" style={SEM_ANEL}>
          <BlocoDaVez fact={<FactoEmail>{email}</FactoEmail>} title={t.errUnconfirmed} titleAs="h1" />
        </div>
      </AuthSection>
    );
  }

  // --- Conta criada ---------------------------------------------------------------
  // Frames UsrBf / oyNGn: o bloco da vez sozinho, sem folha.
  if (modo === "criar-conta" && contaCriada) {
    return (
      <AuthSection>
        <div ref={blocoRef} tabIndex={-1} role="status" className="mt-xl" style={SEM_ANEL}>
          <BlocoDaVez fact={<FactoEmail>{emailRegisto}</FactoEmail>} title={t.createdTitle} titleAs="h1">
            <p className="font-body text-body text-text-secondary">
              {t.createdBody.replace("{email}", emailRegisto)}
            </p>
          </BlocoDaVez>
        </div>
      </AuthSection>
    );
  }

  // --- Entrar e Criar conta (duas páginas) ------------------------------------------
  // "Continuar com Google" fica EM CIMA do formulário, com o divisor "ou" a separá-lo dos
  // campos (como estava antes e como o .pen: pedido do dono, 2026-09-24).
  const google = (
    <div className="flex w-full flex-col gap-lg pt-lg">
      {/* Navegação completa (não fetch): o fluxo OAuth redireciona para o Google. Não é um
          link (o `ButtonLink` prefixaria o idioma e /api não vive em [lang]); o idioma
          vai em `?lang=` para o handler o levar de volta no regresso. */}
      <Button
        type="button"
        variant="secondary"
        size="action"
        fullWidth
        busy={aIrGoogle}
        onClick={() => {
          setAIrGoogle(true);
          window.location.assign(`/api/area-cliente/google?lang=${lang}`);
        }}
      >
        {aIrGoogle ? null : <GoogleIcon />}
        {t.google}
      </Button>
      <DivisorTexto>{t.or}</DivisorTexto>
    </div>
  );

  // "Entrar | Criar conta": duas ligações lado a lado no topo da coluna, na mesma posição
  // nas duas páginas (decisão do dono, 2026-09-24). Cada página tem o seu <h1>, escondido à
  // vista porque os separadores já dizem onde se está (evita "Entrar" duas vezes seguidas).
  const separadores = (
    <SeparadoresPaginas
      className="mt-md"
      label={t.heading}
      current={pagina}
      items={[
        { value: "entrar", label: t.tabEntrar, href: "/area-cliente/entrar" },
        { value: "criar-conta", label: t.tabCriarConta, href: "/area-cliente/criar-conta" },
      ]}
    />
  );

  if (modo === "entrar") {
    return (
      <AuthSection>
        <h1 className="sr-only">{t.tabEntrar}</h1>
        {separadores}
        {google}
        <form noValidate onSubmit={onEntrar} className="w-full pt-lg">
          <Folha
            contentGap="xl"
            actions={
              <Button type="submit" size="action" fullWidth busy={aEntrar}>
                {aEntrar ? t.submitting : t.submit}
              </Button>
            }
          >
            {reposta ? (
              <Notice
                tone="ok"
                role="status"
                title={t.passwordResetTitle}
                description={t.passwordResetBody}
              />
            ) : null}
            {erroGoogle ? <Notice tone="error" role="alert" title={t.googleError} /> : null}
            {errosEntrar.geral ? (
              <Notice id="entrar-erro" focavel tone="error" role="alert" title={errosEntrar.geral} />
            ) : null}
            <Field htmlFor="entrar-email" label={t.email} error={errosEntrar.email} variant="folha">
              <Input
                id="entrar-email"
                type="email"
                autoComplete="username"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  aoMudar(setErrosEntrar, "email", validarEmail(e.target.value));
                }}
                onBlur={(e) => aoSair(setErrosEntrar, "email", validarEmail(e.target.value))}
              />
            </Field>
            <Field
              htmlFor="entrar-password"
              label={t.password}
              error={errosEntrar.password}
              variant="folha"
              aside={
                <Ligacao href="/area-cliente/recuperar-palavra-passe" variant="em-linha">
                  {t.forgotPassword}
                </Ligacao>
              }
            >
              <PasswordInput
                id="entrar-password"
                autoComplete="current-password"
                value={password}
                showLabel={t.showPassword}
                hideLabel={t.hidePassword}
                onChange={(e) => {
                  setPassword(e.target.value);
                  aoMudar(setErrosEntrar, "password", e.target.value ? undefined : t.errPasswordRequired);
                }}
                onBlur={(e) =>
                  aoSair(setErrosEntrar, "password", e.target.value ? undefined : t.errPasswordRequired)
                }
              />
            </Field>
          </Folha>
        </form>
      </AuthSection>
    );
  }

  return (
    <AuthSection>
      <h1 className="sr-only">{t.tabCriarConta}</h1>
      {separadores}
      {google}
      <form noValidate onSubmit={onRegistar} className="w-full pt-lg">
        <Folha
          contentGap="xl"
          actions={
            <Button type="submit" size="action" fullWidth busy={aRegistar}>
              {aRegistar ? t.registering : t.register}
            </Button>
          }
        >
          {errosRegisto.geral ? (
            <Notice id="registo-erro" focavel tone="error" role="alert" title={errosRegisto.geral} />
          ) : null}
          <Field htmlFor="registo-nome" label={t.name} error={errosRegisto.name} variant="folha">
            <Input
              id="registo-nome"
              autoComplete="name"
              placeholder={t.namePlaceholder}
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
                aoMudar(setErrosRegisto, "name", validarNome(e.target.value));
              }}
              onBlur={(e) => aoSair(setErrosRegisto, "name", validarNome(e.target.value))}
            />
          </Field>
          <Field htmlFor="registo-email" label={t.email} error={errosRegisto.email} variant="folha">
            <Input
              id="registo-email"
              type="email"
              autoComplete="email"
              placeholder={t.emailPlaceholder}
              value={emailRegisto}
              onChange={(e) => {
                setEmailRegisto(e.target.value);
                aoMudar(setErrosRegisto, "email", validarEmail(e.target.value));
              }}
              onBlur={(e) => aoSair(setErrosRegisto, "email", validarEmail(e.target.value))}
            />
          </Field>
          <Field
            htmlFor="registo-telefone"
            label={t.phone}
            optional
            optionalLabel={campos.optional}
            variant="folha"
          >
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
            variant="folha"
          >
            <PasswordInput
              id="registo-password"
              autoComplete="new-password"
              value={passwordRegisto}
              showLabel={t.showPassword}
              hideLabel={t.hidePassword}
              onChange={(e) => {
                setPasswordRegisto(e.target.value);
                aoMudar(setErrosRegisto, "password", validarPassword(e.target.value));
                // A confirmação depende desta: se já mostra erro, reavalia-se.
                aoMudar(
                  setErrosRegisto,
                  "confirmPassword",
                  validarConfirmacao(confirmarPasswordRegisto, e.target.value),
                );
              }}
              onBlur={(e) => aoSair(setErrosRegisto, "password", validarPassword(e.target.value))}
            />
          </Field>
          <Field
            htmlFor="registo-confirmar-password"
            label={t.confirmPassword}
            error={errosRegisto.confirmPassword}
            variant="folha"
          >
            <PasswordInput
              id="registo-confirmar-password"
              autoComplete="new-password"
              value={confirmarPasswordRegisto}
              showLabel={t.showPassword}
              hideLabel={t.hidePassword}
              onChange={(e) => {
                setConfirmarPasswordRegisto(e.target.value);
                aoMudar(setErrosRegisto, "confirmPassword", validarConfirmacao(e.target.value));
              }}
              onBlur={(e) =>
                aoSair(setErrosRegisto, "confirmPassword", validarConfirmacao(e.target.value))
              }
            />
          </Field>
          {/* «Nota» do .pen: última linha do conteúdo da folha, antes da acção. */}
          <p className="font-body text-caption tracking-[var(--letter-spacing-caption)] text-text-tertiary">
            {t.registerNote}
          </p>
        </Folha>
      </form>
    </AuthSection>
  );
}

// Logótipo oficial do Google a quatro cores (marca de terceiros: excepção legítima à regra
// de uma só cor de destaque, decisão do dono, 2026-09-24).
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden className="shrink-0">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z" />
      <path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.600 10.8l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.500 0 11.900-2.100 15.900-5.800l-7.6-5.900c-2.100 1.400-4.900 2.300-8.300 2.300-6.300 0-11.600-4.100-13.500-9.800l-7.900 6.100C6.500 42.600 14.600 48 24 48z" />
    </svg>
  );
}
