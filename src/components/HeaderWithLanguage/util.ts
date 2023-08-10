import { Node } from '@ndla/types-taxonomy';

export const getTaxonomyPathsFromTaxonomy = (
  taxonomy?: Pick<Node, 'paths'>[],
  articleId?: number,
): string[] => {
  const taxPaths = taxonomy?.flatMap((t) => t.paths) ?? [];
  const articlePath = articleId ? `/article/${articleId}` : undefined;
  const paths = articlePath ? taxPaths.concat(articlePath) : taxPaths;
  return paths.filter((p): p is string => p !== undefined);
};
