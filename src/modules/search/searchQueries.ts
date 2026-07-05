/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  DraftSearchParamsDTO,
  GrepSearchInputDTO,
  GrepSearchResultsDTO,
  SearchParamsDTO,
  SubjectAggsInputDTO,
} from "@ndla/types-backend/search-api";
import { queryOptions } from "@tanstack/react-query";
import { SEARCH, SEARCH_GREP_CODES, SEARCH_RESOURCES, SEARCH_SUBJECT_STATS } from "../../queryKeys";
import { postSearch, searchGrepCodes, searchResources, searchSubjectStats } from "./searchApi";
import { NoNodeDraftSearchParams, NoNodeSearchParams } from "./searchApiInterfaces";

export const searchQueryKeys = {
  search: (params?: Partial<DraftSearchParamsDTO>) => [SEARCH, params] as const,
  searchSubjectStats: (params?: Partial<SubjectAggsInputDTO>) => [SEARCH_SUBJECT_STATS, params] as const,
  searchResources: (params: Partial<SearchParamsDTO>) => [SEARCH_RESOURCES, params] as const,
  searchGrepCodes: (params: Partial<GrepSearchResultsDTO>) => [SEARCH_GREP_CODES, params] as const,
};

export const searchQueryOptions = (params?: NoNodeDraftSearchParams) => {
  return queryOptions({
    queryKey: searchQueryKeys.search(params),
    queryFn: () => postSearch(params ?? {}),
  });
};

export const searchSubjectStatsQueryOptions = (body: SubjectAggsInputDTO) => {
  return queryOptions({
    queryKey: searchQueryKeys.searchSubjectStats(body),
    queryFn: () => searchSubjectStats(body),
  });
};

export const searchResourcesQueryOptions = (query: NoNodeSearchParams) => {
  return queryOptions({
    queryKey: searchQueryKeys.searchResources(query),
    queryFn: () => searchResources(query),
  });
};

export const searchGrepCodesQueryOptions = (body: GrepSearchInputDTO) => {
  return queryOptions({
    queryKey: searchQueryKeys.searchGrepCodes(body),
    queryFn: () => searchGrepCodes(body),
  });
};
