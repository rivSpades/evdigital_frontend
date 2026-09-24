import { SecaoLeitura } from "@/components/ui/secao-leitura";

// Frames "v2 · A vez" / Ecrã · Blog: "Corpo do artigo" (HPbU7 desktop, ebHXa mobile;
// exemplo de layout). Cada secção do markdown (subtítulo + parágrafos) é uma
// ds/display/secao-leitura; gap $space-xl entre secções em lg e $space-lg abaixo.
//
// O corpo dos artigos é markdown. O projeto não tem (ainda) um renderer de markdown: esta
// função cobre o que o .pen desenha, que é também o que o pipeline editorial produz
// (títulos e parágrafos). Quando o primeiro artigo real precisar de listas, citações ou
// blocos de código, é aqui que entra um renderer a sério.

type ArticleSection = {
  heading?: string;
  paragraphs: string[];
};

export function parseArticleSections(markdown: string): ArticleSection[] {
  const blocks = markdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  const sections: ArticleSection[] = [];

  for (const block of blocks) {
    const heading = block.match(/^#{1,3}\s+(.*)$/);
    if (heading) {
      sections.push({ heading: heading[1].trim(), paragraphs: [] });
      continue;
    }

    const paragraph = block.replace(/\s*\n\s*/g, " ");
    const current = sections[sections.length - 1];
    if (current) {
      current.paragraphs.push(paragraph);
    } else {
      sections.push({ paragraphs: [paragraph] });
    }
  }

  return sections;
}

export function ArticleBody({ content }: { content: string }) {
  const sections = parseArticleSections(content);
  if (sections.length === 0) return null;

  return (
    <div className="flex flex-col gap-lg lg:gap-xl">
      {sections.map((section, index) => (
        <SecaoLeitura key={section.heading ?? index} titulo={section.heading}>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </SecaoLeitura>
      ))}
    </div>
  );
}
