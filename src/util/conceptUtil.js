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
  ...(locale ? { language: locale } : {}),
});

export const transformConceptToApiVersion = (concept, articleIds) => ({
  ...concept,
  articleIds: articleIds,
});
