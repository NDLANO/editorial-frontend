/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IArticleV2DTO, ISearchResultV2DTO, openapi } from "@ndla/types-backend/article-api";
import { createAuthClient } from "../../util/apiHelpers";
import { resolveJsonOATS } from "../../util/resolveJsonOrRejectWithError";

const client = createAuthClient<openapi.paths>();

export interface ArticleSearchParams {
  query?: string;
  language?: string;
  articleTypes?: string[];
  ids?: number[];
  license?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
}

export const searchArticles = (params?: ArticleSearchParams): Promise<ISearchResultV2DTO> =>
  client
    .GET("/article-api/v2/articles", {
      params: {
        query: {
          ...params,
        },
      },
    })
    .then((r) => resolveJsonOATS(r));

export const getArticle = (id: number, locale: string = "nb"): Promise<IArticleV2DTO> =>
  client
    .GET("/article-api/v2/articles/{article_id}", {
      params: {
        path: {
          article_id: id.toString(),
        },
        query: {
          fallback: true,
          language: locale,
        },
      },
    })
    .then((r) => resolveJsonOATS(r));
