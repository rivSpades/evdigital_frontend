import { SectionTitle } from "@/components/home/section-heading";
import { getDictionary } from "@/i18n/dictionaries";
import { Accordion } from "@/components/ui/accordion";

// Frames: "Secção · Perguntas frequentes" (gtCgW / mMLDY).
// Título em português, não "FAQ" (copy-draft.md §2.8).

export async function Faq() {
  const { home } = await getDictionary();
  const t = home.faq;
  return (
    <section aria-labelledby="faq-titulo" className="flex flex-col gap-lg lg:gap-xl">
      <SectionTitle id="faq-titulo">{t.title}</SectionTitle>
      <Accordion items={t.items} className="lg:max-w-[880px]" />
    </section>
  );
}
