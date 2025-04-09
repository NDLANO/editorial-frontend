/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  ILearningPathSummaryV2DTO,
  ILearningPathV2DTO,
  ISearchResultV2DTO,
  openapi,
} from "@ndla/types-backend/learningpath-api";
import { CopyLearningPathBody, SearchBody } from "./learningpathApiInterfaces";
import { createAuthClient } from "../../util/apiHelpers";
import { resolveJsonOATS } from "../../util/resolveJsonOrRejectWithError";

const client = createAuthClient<openapi.paths>();

export const fetchLearningpath = (id: number, locale?: string): Promise<ILearningPathV2DTO> =>
  client
    .GET("/learningpath-api/v2/learningpaths/{learningpath_id}", {
      params: { path: { learningpath_id: id }, query: { language: locale, fallback: true } },
    })
    .then(resolveJsonOATS);

export const fetchLearningpaths = (ids: number[], language?: string): Promise<ILearningPathV2DTO[]> =>
  client
    .GET("/learningpath-api/v2/learningpaths/ids", {
      params: {
        query: {
          ids,
          language,
          fallback: true,
          page: 1,
          "page-size": ids.length,
        },
      },
    })
    .then(resolveJsonOATS);

export const fetchLearningpathsWithArticle = (id: number): Promise<ILearningPathSummaryV2DTO[]> =>
  client
    .GET("/learningpath-api/v2/learningpaths/contains-article/{article_id}", { params: { path: { article_id: id } } })
    .then(resolveJsonOATS);

export const updateStatusLearningpath = (id: number, status: string, message?: string): Promise<ILearningPathV2DTO> =>
  client
    .PUT("/learningpath-api/v2/learningpaths/{learningpath_id}/status", {
      params: { path: { learningpath_id: id } },
      body: { status, message },
    })
    .then(resolveJsonOATS);

export const updateLearningPathTaxonomy = (id: number, createIfMissing: boolean = false): Promise<ILearningPathV2DTO> =>
  client
    .POST("/learningpath-api/v2/learningpaths/{learningpath_id}/update-taxonomy", {
      params: { path: { learningpath_id: id }, query: { "create-if-missing": createIfMissing } },
    })
    .then(resolveJsonOATS);

export const learningpathSearch = async (query: SearchBody & { ids?: number[] }): Promise<ISearchResultV2DTO> => {
  if (query.ids && query.ids.length === 0) {
    return {
      totalCount: 0,
      page: 1,
      pageSize: 0,
      language: "nb",
      results: [],
    };
  }

  return client.POST("/learningpath-api/v2/learningpaths/search", { body: query }).then(resolveJsonOATS);
};

export const learningpathCopy = (id: number, query: CopyLearningPathBody): Promise<ILearningPathV2DTO> =>
  client
    .POST("/learningpath-api/v2/learningpaths/{learningpath_id}/copy", {
      body: query,
      params: { path: { learningpath_id: id } },
    })
    .then(resolveJsonOATS);
