import { TaxonomyObject } from './HeaderWithLanguage';

export const getTaxonomyPathsFromTaxonomy = (
  taxonomy?: TaxonomyObject,
  articleId?: number,
): string[] => {
  const resourcePaths = taxonomy?.resources?.flatMap(r => r.paths) ?? [];
  const topicPaths = taxonomy?.topics?.flatMap(t => t.paths) ?? [];
  const articlePath = articleId ? `/article/${articleId}` : undefined;
  return [...resourcePaths, ...topicPaths, articlePath].filter((p): p is string => p !== undefined);
};
