/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { paths, ArticleV2DTO, SearchResultV2DTO } from "@ndla/types-backend/article-api";
import { createAuthClient } from "../../util/apiHelpers";
import { resolveJsonOATS } from "../../util/resolveJsonOrRejectWithError";

const client = createAuthClient<paths>();

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

export const searchArticles = (params?: ArticleSearchParams): Promise<SearchResultV2DTO> =>
  client
    .GET("/article-api/v2/articles", {
      params: {
        query: params,
      },
    })
    .then((r) => resolveJsonOATS(r));

export const getArticle = (id: number, locale: string = "nb"): Promise<ArticleV2DTO> =>
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
