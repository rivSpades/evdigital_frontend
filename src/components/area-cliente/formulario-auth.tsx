"use client";

import type { Locale } from "@/i18n/config";
import { useFocoPendente } from "@/components/ui/formulario";
import { erroDoEmail, type FrasesEmail } from "@/lib/email";

// Peças partilhadas pelos formulários de autenticação da Área de Cliente (`EntrarForm` em
// /entrar e /criar-conta, `RecuperarForm` em /recuperar-palavra-passe): validação do email,
// erros vindos do backend e o «facto» com o email da conta no bloco da vez. As
// micro-interacções genéricas (aoSair, aoMudar, primeiroInvalido, foco pendente, SEM_ANEL)
// vivem em `components/ui/formulario.ts`, partilhadas com os restantes formulários.

/** Frases do email (chaves do contacto, passadas pela página). */
export type CamposEmail = FrasesEmail;

/**
 * Validação e erros partilhados. O erro de um campo só aparece depois de sair dele (blur)
 * ou de tentar submeter, e sai assim que o valor passa a válido; ao submeter com erros o
 * foco vai para o primeiro campo inválido (`focarDepois`, aplicado depois do render).
 */
export function useFormularioAuth(lang: Locale, campos: CamposEmail) {
  const focarDepois = useFocoPendente();

  const validarEmail = (valor: string) => erroDoEmail(valor, campos);

  // Erro de um campo vindo do backend: em pt a frase do Django; em en/pl a chave do campo
  // (`fallback`).
  const doBackend = (mensagem: string | undefined, fallback: string) =>
    mensagem ? (lang === "pt" ? mensagem : fallback) : undefined;

  // Email: vazio/inválido têm frase própria; o resto recorre a `generico`.
  const erroEmail = (mensagem: string | undefined, valor: string, generico: string) =>
    doBackend(mensagem, validarEmail(valor) ?? generico);

  return { focarDepois, validarEmail, doBackend, erroEmail };
}

// «Facto 1» do bloco da vez nos ecrãs de autenticação: o email da conta em
// $font-size-caption, $text-primary (o master usa $text-secondary).
export function FactoEmail({ children }: { children: string }) {
  return (
    <p className="font-body text-caption tracking-[var(--letter-spacing-caption)] break-all text-text-primary">
      {children}
    </p>
  );
}
