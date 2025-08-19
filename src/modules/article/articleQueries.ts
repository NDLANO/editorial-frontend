/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { IArticleV2DTO, ISearchResultV2DTO } from "@ndla/types-backend/article-api";
import { ArticleSearchParams, getArticle, searchArticles } from "./articleApi";
import { ARTICLE, ARTICLES } from "../../queryKeys";

export const articleQueryKeys = {
  search: (params?: Partial<ArticleSearchParams>) => [ARTICLES, params] as const,
  article: (params: UseArticle) => [ARTICLE, params] as const,
};

export const useArticleSearch = (
  params: ArticleSearchParams,
  options?: Partial<UseQueryOptions<ISearchResultV2DTO>>,
) => {
  return useQuery<ISearchResultV2DTO>({
    queryKey: articleQueryKeys.search(params),
    queryFn: () => searchArticles(params),
    ...options,
  });
};

export interface UseArticle {
  id: number;
  language?: string;
}

export const useArticle = (params: UseArticle, options?: Partial<UseQueryOptions<IArticleV2DTO>>) => {
  return useQuery<IArticleV2DTO>({
    queryKey: articleQueryKeys.article(params),
    queryFn: () => getArticle(params.id, params.language),
    ...options,
  });
};
