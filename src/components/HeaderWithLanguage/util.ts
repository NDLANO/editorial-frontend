import { Node } from '@ndla/types-taxonomy';

export const getTaxonomyPathsFromTaxonomy = (taxonomy?: Node[], articleId?: number): string[] => {
  const taxPaths = taxonomy?.flatMap((t) => t.paths) ?? [];
  const articlePath = articleId ? `/article/${articleId}` : undefined;
  return [taxPaths, articlePath].filter((p): p is string => p !== undefined);
};
