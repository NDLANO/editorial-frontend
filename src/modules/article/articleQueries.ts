/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ISearchResultV2 } from '@ndla/types-backend/article-api';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { ARTICLE } from '../../queryKeys';
import { ArticleSearchParams, searchArticles } from './articleApi';

export const articleQueryKeys = {
  search: (params?: Partial<ArticleSearchParams>) => [ARTICLE, params] as const,
};

export const useArticleSearch = (
  params: ArticleSearchParams,
  options?: UseQueryOptions<ISearchResultV2>,
) => {
  return useQuery<ISearchResultV2>(
    articleQueryKeys.search(params),
    () => searchArticles(params),
    options,
  );
};
