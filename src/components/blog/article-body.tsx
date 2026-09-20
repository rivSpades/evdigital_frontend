// Frames: "Corpo do artigo" (CHJcg no wide, gWTpy no narrow). O .pen modela o corpo como
// secções (subtítulo H2 + parágrafos), com gap maior entre secções do que dentro delas.
//
// O corpo dos artigos é markdown. O projeto não tem (ainda) um renderer de markdown: esta
// função cobre o que o .pen desenha, que é também o que o pipeline editorial produz
// (títulos de nível 2 e parágrafos). Quando o primeiro artigo real precisar de listas,
// citações ou blocos de código, é aqui que entra um renderer a sério.

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
        <section
          key={section.heading ?? index}
          className="flex flex-col gap-xs lg:gap-sm"
        >
          {section.heading ? (
            <h2 className="font-heading text-body-lg font-semibold leading-[var(--line-height-title)] tracking-[var(--letter-spacing-title)] text-text-primary lg:text-title-sm">
              {section.heading}
            </h2>
          ) : null}

          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className="font-body text-body text-text-secondary">
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}
