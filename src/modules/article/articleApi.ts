/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from "query-string";
import { IArticleV2DTO, ISearchResultV2DTO } from "@ndla/types-backend/article-api";
import { resolveJsonOrRejectWithError, apiResourceUrl, fetchAuthorized } from "../../util/apiHelpers";

const articleUrl = apiResourceUrl("/article-api/v2/articles");

export interface ArticleSearchParams {
  query?: string;
  language?: string;
  articleTypes?: string[];
  ids?: string;
  license?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
}

export const searchArticles = (params?: ArticleSearchParams): Promise<ISearchResultV2DTO> => {
  const stringifiedParams = queryString.stringify(params);
  const query = params ? `?${stringifiedParams}` : "";
  return fetchAuthorized(`${articleUrl}/${query}`).then((r) => resolveJsonOrRejectWithError<ISearchResultV2DTO>(r));
};

export const getArticle = (id: number, locale: string = "nb"): Promise<IArticleV2DTO> =>
  fetchAuthorized(`${articleUrl}/${id}?language=${locale}&fallback=true`).then((r) =>
    resolveJsonOrRejectWithError<IArticleV2DTO>(r),
  );
