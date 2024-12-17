/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from "query-string";
import { ILearningPathV2DTO, ISearchResultV2DTO } from "@ndla/types-backend/learningpath-api";
import { CopyLearningPathBody, SearchBody } from "./learningpathApiInterfaces";
import { resolveJsonOrRejectWithError, apiResourceUrl, fetchAuthorized } from "../../util/apiHelpers";

const baseUrl = apiResourceUrl("/learningpath-api/v2/learningpaths");

export const fetchLearningpath = (id: number, locale?: string): Promise<ILearningPathV2DTO> => {
  const language = locale ? `?language=${locale}&fallback=true` : "";
  return fetchAuthorized(`${baseUrl}/${id}${language}`).then((res) =>
    resolveJsonOrRejectWithError<ILearningPathV2DTO>(res),
  );
};

export const fetchLearningpaths = (ids: number[], language?: string): Promise<ILearningPathV2DTO[]> => {
  const query = queryString.stringify({
    ids: ids.join(","),
    language,
    fallback: true,
    page: 1,
    "page-size": ids.length,
  });
  return fetchAuthorized(`${baseUrl}/ids/?${query}`, {
    method: "GET",
  }).then((r) => resolveJsonOrRejectWithError<ILearningPathV2DTO[]>(r));
};

export const fetchLearningpathsWithArticle = (id: number): Promise<ILearningPathV2DTO[]> =>
  fetchAuthorized(`${baseUrl}/contains-article/${id}`).then((r) =>
    resolveJsonOrRejectWithError<ILearningPathV2DTO[]>(r),
  );

export const updateStatusLearningpath = (id: number, status: string, message?: string): Promise<ILearningPathV2DTO> =>
  fetchAuthorized(`${baseUrl}/${id}/status/`, {
    method: "PUT",
    body: JSON.stringify({
      status,
      message,
    }),
  }).then((r) => resolveJsonOrRejectWithError<ILearningPathV2DTO>(r));

export const updateLearningPathTaxonomy = (id: number, createIfMissing: boolean = false): Promise<ILearningPathV2DTO> =>
  fetchAuthorized(`${baseUrl}/${id}/update-taxonomy/?create-if-missing=${createIfMissing}`, {
    method: "POST",
  }).then((r) => resolveJsonOrRejectWithError<ILearningPathV2DTO>(r));

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
  return fetchAuthorized(`${baseUrl}/search/`, {
    method: "POST",
    body: JSON.stringify(query),
  }).then((r) => resolveJsonOrRejectWithError<ISearchResultV2DTO>(r));
};

export const learningpathCopy = (id: number, query: CopyLearningPathBody): Promise<ILearningPathV2DTO> =>
  fetchAuthorized(`${baseUrl}/${id}/copy/`, {
    method: "POST",
    body: JSON.stringify(query),
  }).then((r) => resolveJsonOrRejectWithError<ILearningPathV2DTO>(r));
