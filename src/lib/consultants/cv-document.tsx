import path from "node:path";
import { Document, Font, Image, Link, Page, Text, View } from "@react-pdf/renderer";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Consultor, EtapaPercurso } from "./backend";
import { cv } from "./cv-tokens";
import {
  competencias,
  formatarEuros,
  iniciais,
  itensPerfil,
  paragrafos,
  periodoEtapa,
} from "./format";

// CV do consultor em PDF (@react-pdf/renderer, só no servidor: route handler
// src/app/api/consultants/[slug]/cv/route.ts). Fiel aos frames «Consultores · CV · página 1»
// (ZMWy6) e «página 2» (AoWpt) do design-system.pen, A4 595x842 pt, tema light do .pen.
// Cada bloco espelha um componente ds/cv/*:
// - Cabecalho (ds/cv/cabecalho zMHW3): retrato 72x90 (ds/display/retrato), Identidade (Nome
//   print-name Sora 700, Headline print-lead) e Contactos (132, mono print-caption, email em
//   $text-link). Régua $border-default em baixo, padding-bottom 16, gap 16.
// - CabecalhoContinuacao (ds/cv/cabecalho--continuacao C0ugr): só da página 2 em diante;
//   Nome print-title + Headline print-body, régua em baixo, padding-bottom 10, gap 12. Repete
//   o título «Percurso» da coluna principal, como no frame AoWpt.
// - TituloSecao (ds/cv/titulo-secao RdIrd): print-title Sora 600 + régua $border-default de
//   1, gap 6.
// - Facto (ds/cv/facto B27kF): Termo print-caption $text-tertiary, Valor print-value (mono
//   no salário), padding [6, 0], régua $border-subtle em baixo, gap 2.
// - Etapa (ds/cv/etapa gxthO): carril de 10 em $accent-primary (linha antes 2x5, marca 8x2,
//   linha depois até ao fim da etapa; a última sem ela) + Conteúdo (gap 2, padding-bottom
//   14): Período mono print-caption, Função print-title, Organização print-body 500,
//   História print-body. Nunca se parte entre páginas (`wrap={false}`).
// - Rodape (ds/cv/rodape U8Z2qh): «EvDigital» + domínio, e a paginação N/M; régua
//   $border-subtle em cima, padding-top 8. Fixo em todas as páginas.
// Página: padding 48, gap 20; corpo em duas colunas (lateral 148 + principal, gap 24).
// Contactos vazios (email, telefone, localização) não aparecem.

const DIR_FONTES = path.join(process.cwd(), "src/lib/consultants/fonts");

let fontesRegistadas = false;
function registarFontes() {
  if (fontesRegistadas) return;
  Font.register({
    family: "Sora",
    fonts: [
      { src: path.join(DIR_FONTES, "Sora-600.ttf"), fontWeight: 600 },
      { src: path.join(DIR_FONTES, "Sora-700.ttf"), fontWeight: 700 },
    ],
  });
  Font.register({
    family: "Inter",
    fonts: [
      { src: path.join(DIR_FONTES, "Inter-400.ttf"), fontWeight: 400 },
      { src: path.join(DIR_FONTES, "Inter-500.ttf"), fontWeight: 500 },
    ],
  });
  Font.register({
    family: "JetBrains Mono",
    fonts: [{ src: path.join(DIR_FONTES, "JetBrainsMono-400.ttf"), fontWeight: 400 }],
  });
  // Sem hifenização automática (o .pen não parte palavras).
  Font.registerHyphenationCallback((palavra) => [palavra]);
  fontesRegistadas = true;
}

const { cor, tamanho, entrelinha, peso } = cv;

const MARGEM = 48;
// A4 = 595 pt de largura; a área útil entre margens (ds/cv/rodape tem 499).
const LARGURA_UTIL = 595 - 2 * MARGEM;
const GAP_PAGINA = 20;
const ALTURA_RODAPE = 8 + tamanho.rodape * entrelinha.legenda;

const texto = {
  titulo: {
    fontFamily: "Sora",
    fontWeight: peso.titulo,
    fontSize: tamanho.titulo,
    lineHeight: entrelinha.titulo,
    color: cor.textoPrimario,
  },
  corpo: {
    fontFamily: "Inter",
    fontWeight: peso.corpo,
    fontSize: tamanho.corpo,
    lineHeight: entrelinha.legenda,
    color: cor.textoSecundario,
  },
  mono: {
    fontFamily: "JetBrains Mono",
    fontWeight: peso.corpo,
    lineHeight: entrelinha.legenda,
  },
} as const;

export type Foto = { data: Buffer; format: "jpg" | "png" } | null;

type T = Dictionary["consultores"];

function TituloSecao({ children }: { children: string }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={texto.titulo}>{children}</Text>
      <View style={{ height: 1, backgroundColor: cor.reguaForte }} />
    </View>
  );
}

function Facto({ termo, valor, mono }: { termo?: string; valor: string; mono?: boolean }) {
  return (
    <View
      style={{
        gap: 2,
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: cor.reguaSubtil,
      }}
      wrap={false}
    >
      {termo ? (
        <Text style={{ ...texto.corpo, fontSize: tamanho.legenda, color: cor.textoTerciario }}>
          {termo}
        </Text>
      ) : null}
      <Text
        style={
          mono
            ? { ...texto.mono, fontSize: tamanho.valor, color: cor.textoPrimario }
            : { ...texto.corpo, fontSize: tamanho.valor, color: cor.textoPrimario }
        }
      >
        {valor}
      </Text>
    </View>
  );
}

function Etapa({
  etapa,
  ultima,
  t,
}: {
  etapa: EtapaPercurso;
  ultima: boolean;
  t: T["detalhe"];
}) {
  return (
    <View style={{ flexDirection: "row", gap: 10 }} wrap={false}>
      <View style={{ width: 10 }}>
        <View style={{ width: 2, height: 5, backgroundColor: cor.accent }} />
        <View style={{ width: 8, height: 2, backgroundColor: cor.accent }} />
        {ultima ? null : <View style={{ width: 2, flexGrow: 1, backgroundColor: cor.accent }} />}
      </View>
      <View style={{ flex: 1, gap: 2, paddingBottom: ultima ? 0 : 14 }}>
        <Text style={{ ...texto.mono, fontSize: tamanho.legenda, color: cor.textoTerciario }}>
          {periodoEtapa(etapa, t)}
        </Text>
        <Text style={texto.titulo}>{etapa.role}</Text>
        <Text style={{ ...texto.corpo, fontWeight: peso.label }}>{etapa.organisation}</Text>
        <Text style={texto.corpo}>{etapa.story}</Text>
      </View>
    </View>
  );
}

function Retrato({ foto, nome }: { foto: Foto; nome: string }) {
  const caixa = {
    width: 72,
    height: 90,
    borderWidth: 1,
    borderColor: cor.reguaSubtil,
    backgroundColor: cor.avatarFundo,
  } as const;
  if (foto) {
    return (
      <View style={caixa}>
        {/* Image do @react-pdf (PDF), não um <img>: não tem `alt`. */}
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image src={foto} style={{ width: 70, height: 88, objectFit: "cover" }} />
      </View>
    );
  }
  return (
    <View style={{ ...caixa, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ ...texto.titulo, fontSize: tamanho.nome, color: cor.avatarTexto }}>
        {iniciais(nome)}
      </Text>
    </View>
  );
}

export function CvDocumento({
  consultor,
  foto,
  lang,
  t,
}: {
  consultor: Consultor;
  foto: Foto;
  lang: Locale;
  t: T;
}) {
  registarFontes();
  const d = t.detalhe;
  const contactoUrl = `https://www.evdigital.eu/${lang}/consultants/${consultor.slug}/contacto`;
  // Sem email nem outras ligações (decisão do dono): só a ligação ao formulário do site.
  const contactos = [
    consultor.phone ? { valor: consultor.phone } : null,
    consultor.location ? { valor: consultor.location } : null,
    // Contacto pelo formulário do site (o CV público não mostra email por defeito).
    { valor: "evdigital.eu/contacto", href: contactoUrl },
  ].filter((c): c is { valor: string; href?: string } => c !== null);

  const salarios = [
    { termo: d.contrato, valor: formatarEuros(consultor.contract_monthly_eur, lang) },
    { termo: d.freelancer, valor: formatarEuros(consultor.freelance_hourly_eur, lang) },
  ].filter((s): s is { termo: string; valor: string } => s.valor !== null);
  const listaCompetencias = competencias(consultor.skills);
  const apresentacao = paragrafos(consultor.bio);
  const idiomas = itensPerfil(consultor.languages);
  const habilitacoes = itensPerfil(consultor.qualifications);

  return (
    <Document
      title={`${consultor.name} · CV`}
      author="EvDigital"
      creator="EvDigital"
      producer="EvDigital"
      language={lang}
    >
      <Page
        size="A4"
        style={{
          backgroundColor: cor.papel,
          paddingTop: MARGEM,
          paddingHorizontal: MARGEM,
          paddingBottom: MARGEM + ALTURA_RODAPE + GAP_PAGINA,
        }}
      >
        {/* Da página 2 em diante: cabeçalho de continuação + título do Percurso. */}
        <View
          fixed
          render={({ pageNumber }) =>
            pageNumber > 1 ? (
              // Gap de 10 entre o título do Percurso e as etapas (frame AoWpt).
              <View style={{ marginBottom: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    gap: 12,
                    paddingBottom: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: cor.reguaForte,
                  }}
                >
                  <Text style={texto.titulo}>{consultor.name}</Text>
                  <Text style={{ ...texto.corpo, flex: 1 }}>{consultor.headline}</Text>
                </View>
                <View style={{ flexDirection: "row", gap: 24, marginTop: GAP_PAGINA }}>
                  <View style={{ width: 148 }} />
                  <View style={{ flex: 1 }}>
                    <TituloSecao>{d.percurso}</TituloSecao>
                  </View>
                </View>
              </View>
            ) : null
          }
        />

        {/* Cabeçalho (página 1). */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            gap: 16,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: cor.reguaForte,
          }}
        >
          <Retrato foto={foto} nome={consultor.name} />
          <View style={{ flex: 1, gap: 4 }}>
            <Text
              style={{
                fontFamily: "Sora",
                fontWeight: peso.display,
                fontSize: tamanho.nome,
                lineHeight: entrelinha.titulo,
                letterSpacing: cv.espacamento.titulo,
                color: cor.textoPrimario,
              }}
            >
              {consultor.name}
            </Text>
            <Text style={{ ...texto.corpo, fontSize: tamanho.headline }}>
              {consultor.headline}
            </Text>
          </View>
          {contactos.length > 0 ? (
            <View style={{ width: 132, gap: 3, alignItems: "flex-end" }}>
              {contactos.map((contacto) =>
                contacto.href ? (
                  <Link
                    key={contacto.valor}
                    src={contacto.href}
                    style={{
                      ...texto.mono,
                      fontSize: tamanho.legenda,
                      color: cor.ligacao,
                      textDecoration: "none",
                    }}
                  >
                    {contacto.valor}
                  </Link>
                ) : (
                  <Text
                    key={contacto.valor}
                    style={{
                      ...texto.mono,
                      fontSize: tamanho.legenda,
                      color: cor.textoSecundario,
                      textAlign: "right",
                    }}
                  >
                    {contacto.valor}
                  </Text>
                ),
              )}
            </View>
          ) : null}
        </View>

        {/* Corpo: lateral 148 + principal. */}
        <View style={{ flexDirection: "row", gap: 24, marginTop: GAP_PAGINA }}>
          <View style={{ width: 148, gap: GAP_PAGINA }}>
            {salarios.length > 0 ? (
              <View style={{ gap: 4 }}>
                <TituloSecao>{d.salario}</TituloSecao>
                {salarios.map((s) => (
                  <Facto key={s.termo} termo={s.termo} valor={s.valor} mono />
                ))}
              </View>
            ) : null}
            {listaCompetencias.length > 0 ? (
              <View style={{ gap: 4 }}>
                <TituloSecao>{t.cv.competencias}</TituloSecao>
                {listaCompetencias.map((c, i) => (
                  <Facto key={`${c.area ?? ""}-${i}`} termo={c.area} valor={c.itens} />
                ))}
              </View>
            ) : null}
            {/* Idiomas (Facto: língua em cima, nível em baixo) e Habilitações (instituição e
                anos em cima, curso em baixo; sem valor, como «Carta de condução», só o rótulo).
                Cada bloco inteiro numa página: com o conteúdo real caem na página 2 (AoWpt). */}
            {idiomas.length > 0 ? (
              <View style={{ gap: 4 }} wrap={false}>
                <TituloSecao>{d.idiomas}</TituloSecao>
                {idiomas.map((item, i) =>
                  item.value ? (
                    <Facto key={`${item.label}-${i}`} termo={item.label} valor={item.value} />
                  ) : (
                    <Facto key={`${item.label}-${i}`} valor={item.label} />
                  ),
                )}
              </View>
            ) : null}
            {habilitacoes.length > 0 ? (
              <View style={{ gap: 4 }} wrap={false}>
                <TituloSecao>{d.habilitacoes}</TituloSecao>
                {habilitacoes.map((item, i) =>
                  item.value ? (
                    <Facto key={`${item.label}-${i}`} termo={item.value} valor={item.label} />
                  ) : (
                    <Facto key={`${item.label}-${i}`} valor={item.label} />
                  ),
                )}
              </View>
            ) : null}
          </View>

          <View style={{ flex: 1, gap: GAP_PAGINA }}>
            {apresentacao.length > 0 ? (
              <View style={{ gap: 8 }}>
                <TituloSecao>{t.cv.apresentacao}</TituloSecao>
                {apresentacao.map((paragrafo, i) => (
                  <Text key={i} style={texto.corpo}>
                    {paragrafo}
                  </Text>
                ))}
              </View>
            ) : null}
            {consultor.steps.length > 0 ? (
              <View style={{ gap: 10 }}>
                <TituloSecao>{d.percurso}</TituloSecao>
                <View>
                  {consultor.steps.map((etapa, i) => (
                    <Etapa
                      key={`${etapa.period_start}-${i}`}
                      etapa={etapa}
                      ultima={i === consultor.steps.length - 1}
                      t={d}
                    />
                  ))}
                </View>
              </View>
            ) : null}
          </View>
        </View>

        {/* Rodapé fixo. */}
        <View
          fixed
          style={{
            position: "absolute",
            left: MARGEM,
            bottom: MARGEM,
            width: LARGURA_UTIL,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: cor.reguaSubtil,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text
              style={{
                fontFamily: "Sora",
                fontWeight: peso.titulo,
                fontSize: tamanho.rodape,
                lineHeight: entrelinha.legenda,
                color: cor.textoPrimario,
              }}
            >
              EvDigital
            </Text>
            <Text style={{ ...texto.corpo, fontSize: tamanho.rodape, color: cor.textoTerciario }}>
              {t.cv.dominio}
            </Text>
          </View>
          {/* Sem lineHeight: no @react-pdf 4.x um Text com `render` e lineHeight faz desaparecer
              a View fixa inteira (rodapé em branco). A altura da linha vem do texto ao lado. */}
          <Text
            style={{
              fontFamily: "JetBrains Mono",
              fontWeight: peso.corpo,
              fontSize: tamanho.rodape,
              color: cor.textoTerciario,
            }}
            render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}
