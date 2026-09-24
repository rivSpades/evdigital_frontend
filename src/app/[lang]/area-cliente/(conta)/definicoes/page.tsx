import type { Metadata } from "next";
import { getLocale, getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/i18n/metadata";
import { ApagarConta } from "@/components/area-cliente/apagar-conta";
import { PaginaFormulario } from "@/components/area-cliente/cabecalho-pagina";
import { PerfilForm } from "@/components/area-cliente/perfil-form";
import { PasswordForm } from "@/components/area-cliente/password-form";
import { Separadores } from "@/components/ui/separadores";
import { separadorId, separadorPainelId } from "@/components/ui/separadores-ids";
import { requireSession } from "@/lib/area-cliente/session";

// Frames "Ecrã · Definições · Perfil" e "Ecrã · Definições · Segurança" do grupo
// "v2 · A vez" (flhgP) do design-system.pen.
//
// Estrutura comum das páginas de formulário (`PaginaFormulario`, design-guardrails.md §6):
// Voltar à margem da página e, numa coluna centrada de 704, o título, a introdução, os
// separadores Perfil | Segurança (ds/navigation/separadores, a $space-xl da introdução) e o
// painel a $space-2xl. Em Segurança, a zona de perigo fica no fim, separada da folha por
// uma régua horizontal neutra ($border-subtle) a $space-3xl da folha e a $space-2xl da zona.
// Onde o .pen ainda tem tudo encostado à margem esquerda, manda a regra (pedido do dono).

const TABS_ID = "definicoes";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);
  return {
    title: t.meta.definicoesTitle,
    robots: { index: false },
    ...pageMetadata(lang, "/area-cliente/definicoes"),
  };
}

export default async function AreaClienteDefinicoes({
  searchParams,
}: PageProps<"/[lang]/area-cliente/definicoes">) {
  const lang = await getLocale();
  const { areaCliente: t } = await getDictionary(lang);
  // O perfil é o próprio /api/me/ que a sessão já pediu (partilhado com o layout).
  const { me: perfil } = await requireSession(lang);

  const { tab } = await searchParams;
  const aba = tab === "seguranca" ? "seguranca" : "perfil";

  return (
    <PaginaFormulario
      voltarHref="/area-cliente/projetos"
      voltar={t.back}
      titulo={t.definicoes.heading}
      introducao={t.definicoes.intro}
      separadores={
        <Separadores
          id={TABS_ID}
          label={t.definicoes.heading}
          current={aba}
          items={[
            {
              value: "perfil",
              label: t.definicoes.perfil.heading,
              href: "/area-cliente/definicoes",
            },
            {
              value: "seguranca",
              label: t.definicoes.seguranca.heading,
              href: "/area-cliente/definicoes?tab=seguranca",
            },
          ]}
        />
      }
    >
      <div
        id={separadorPainelId(TABS_ID)}
        role="tabpanel"
        aria-labelledby={separadorId(TABS_ID, aba)}
        className="flex flex-col"
      >
        {aba === "perfil" ? (
          <PerfilForm perfil={perfil} lang={lang} t={t.definicoes.perfil} />
        ) : (
          <>
            <PasswordForm
              temPassword={perfil.has_usable_password}
              lang={lang}
              t={t.definicoes.seguranca}
            />
            <hr className="mt-3xl mb-2xl border-0 border-t border-border-subtle" />
            <ApagarConta lang={lang} t={t.definicoes.apagar} />
          </>
        )}
      </div>
    </PaginaFormulario>
  );
}
