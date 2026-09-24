import type { blog as Source } from "../pt/blog";

// Namespace "blog" — en. Tem de cumprir a forma do português.
export const blog: typeof Source = {
  metaTitle: "Blog",
  metaDescription: "Articles about digitalisation, in plain language and in technical language.",
  title: "Blog",
  levelSimple: "level: plain",
  levelTechnical: "level: technical",
  filterOverline: "LEVEL",
  filterLabel: "Filter articles by level",
  filterAll: "All",
  filterSimple: "Plain",
  filterTechnical: "Technical",
  countOne: "1 article",
  countFew: "{n} articles",
  countMany: "{n} articles",
  filterEmpty:
    "There are no published articles at this level yet. See all articles to find what has already been written.",
  emptyTitle: "No articles published yet.",
  emptyCta: "See what we do",
  readArticle: "Read article",
  readingShort: "{n} min",
  readingLong: "{n} min read",
  backToBlog: "Back to the blog",
  summaryOverline: "IN SHORT",
  tagsOverline: "TAGS",
  relatedTitle: "Keep reading",
  relatedAll: "See all articles",
  closingTitle: "Still have a question about what you read?",
  closingText: "No commitment, to work out what makes sense in your case.",
  closingCta: "Contact us",
};
