/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { queryOptions } from "@tanstack/react-query";
import { ARTICLE, ARTICLES } from "../../queryKeys";
import { ArticleSearchParams, getArticle, searchArticles } from "./articleApi";

export const articleQueryKeys = {
  search: (params?: Partial<ArticleSearchParams>) => [ARTICLES, params] as const,
  article: (params: UseArticle) => [ARTICLE, params] as const,
};

export const articleSearchQueryOptions = (params: ArticleSearchParams) => {
  return queryOptions({
    queryKey: articleQueryKeys.search(params),
    queryFn: () => searchArticles(params),
  });
};

export interface UseArticle {
  id: number;
  language?: string;
}

export const articleQueryOptions = (params: UseArticle) => {
  return queryOptions({
    queryKey: articleQueryKeys.article(params),
    queryFn: () => getArticle(params.id, params.language),
  });
};
