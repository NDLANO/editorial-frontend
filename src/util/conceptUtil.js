import { convertFieldWithFallback } from './convertFieldWithFallback';

export const transformConceptFromApiVersion = (concept, locale) => ({
  ...concept,
  title: convertFieldWithFallback(concept, 'title', ''),
  content: convertFieldWithFallback(concept, 'content', ''),
  tags: convertFieldWithFallback(concept, 'tags', []),
  lastUpdated: concept.lastUpdated ? concept.lastUpdated : concept.updated,
  ...(locale ? { language: locale | concept.title.language } : {}),
});
