import { convertFieldWithFallback } from './convertFieldWithFallback';

export const transformConceptFromApiVersion = (
  concept,
  locale,
  articleIds,
) => ({
  ...concept,
  articleIds: articleIds,
  title: convertFieldWithFallback(concept, 'title', ''),
  content: convertFieldWithFallback(concept, 'content', ''),
  tags: convertFieldWithFallback(concept, 'tags', []),
  lastUpdated: concept.lastUpdated ? concept.lastUpdated : concept.updated,
  ...(locale ? { language: locale || concept.title.language } : {}),
});

export const transformConceptToApiVersion = (concept, articleIds) => ({
  ...concept,
  articleIds,
});
