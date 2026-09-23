import type { blog as Source } from "../pt/blog";

// Namespace "blog" — pl. Tem de cumprir a forma do português.
export const blog: typeof Source = {
  metaTitle: "Blog",
  metaDescription: "Artykuły o cyfryzacji, prostym i technicznym językiem.",
  title: "Blog",
  levelSimple: "poziom: prosty",
  levelTechnical: "poziom: techniczny",
  filterOverline: "POZIOM",
  filterLabel: "Filtruj artykuły według poziomu",
  filterAll: "Wszystkie",
  filterSimple: "Prosty",
  filterTechnical: "Techniczny",
  countOne: "1 artykuł",
  countFew: "{n} artykuły",
  countMany: "{n} artykułów",
  filterEmpty:
    "Nie ma jeszcze opublikowanych artykułów na tym poziomie. Zobacz wszystkie artykuły, aby znaleźć to, co już zostało napisane.",
  emptyTitle: "Nie opublikowano jeszcze żadnych artykułów.",
  emptyCta: "Zobacz, czym się zajmujemy",
  readArticle: "Czytaj artykuł",
  readingShort: "{n} min",
  readingLong: "{n} min czytania",
  backToBlog: "Wróć do bloga",
  summaryOverline: "W SKRÓCIE",
  tagsOverline: "TAGI",
  relatedTitle: "Czytaj dalej",
  relatedAll: "Zobacz wszystkie artykuły",
  closingTitle: "Czy po lekturze mają Państwo jakieś wątpliwości?",
  closingText: "Trzydzieści minut, bez zobowiązań, by ustalić, co ma sens w Państwa przypadku.",
  closingCta: "Skontaktuj się",
};
