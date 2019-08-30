import { convertFieldWithFallback } from './convertFieldWithFallback';

export const transformConceptFromApiVersion = (concept, locale) => ({
  ...concept,
  title: convertFieldWithFallback(concept, 'title', ''),
  content: convertFieldWithFallback(concept, 'content', ''),
  tags: convertFieldWithFallback(concept, 'tags', []),
  ...(locale ? { language: locale } : {}),
});
