/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { ISearchResultV2 } from '@ndla/types-backend/article-api';
import { ArticleSearchParams, searchArticles } from './articleApi';
import { ARTICLE } from '../../queryKeys';

export const articleQueryKeys = {
  search: (params?: Partial<ArticleSearchParams>) => [ARTICLE, params] as const,
};

export const useArticleSearch = (
  params: ArticleSearchParams,
  options?: Partial<UseQueryOptions<ISearchResultV2>>,
) => {
  return useQuery<ISearchResultV2>({
    queryKey: articleQueryKeys.search(params),
    queryFn: () => searchArticles(params),
    ...options,
  });
};
