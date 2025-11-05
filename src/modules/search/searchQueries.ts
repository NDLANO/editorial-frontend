/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  DraftSearchParamsDTO,
  GrepSearchInputDTO,
  GrepSearchResultsDTO,
  SearchParamsDTO,
  SubjectAggregationsDTO,
  SubjectAggsInputDTO,
} from "@ndla/types-backend/search-api";
import { postSearch, searchGrepCodes, searchResources, searchSubjectStats } from "./searchApi";
import { DA_SUBJECT_ID, SA_SUBJECT_ID, LMA_SUBJECT_ID } from "../../constants";
import { useTaxonomyVersion } from "../../containers/StructureVersion/TaxonomyVersionProvider";
import {
  customFieldsBody,
  defaultSubjectIdObject,
  getResultSubjectIdObject,
  getSubjectsIdsQuery,
} from "../../containers/WelcomePage/utils";
import {
  SEARCH,
  SEARCH_GREP_CODES,
  SEARCH_RESOURCES,
  SEARCH_SUBJECT_STATS,
  SEARCH_WITH_CUSTOM_SUBJECTS_FILTERING,
} from "../../queryKeys";
import { getAccessToken, getAccessTokenPersonal } from "../../util/authHelpers";
import { isValid } from "../../util/jwtHelper";
import { useUserData } from "../draft/draftQueries";
import { usePostSearchNodes } from "../nodes/nodeQueries";
import { MultiSummarySearchResults, NoNodeDraftSearchParams, NoNodeSearchParams } from "./searchApiInterfaces";
import { StringSort } from "../../interfaces";

export const searchQueryKeys = {
  search: (params?: Partial<StringSort<DraftSearchParamsDTO>>) => [SEARCH, params] as const,
  searchWithCustomSubjectsFiltering: (params?: Partial<StringSort<DraftSearchParamsDTO>>) =>
    [SEARCH_WITH_CUSTOM_SUBJECTS_FILTERING, params] as const,
  searchSubjectStats: (params?: Partial<SubjectAggsInputDTO>) => [SEARCH_SUBJECT_STATS, params] as const,
  searchResources: (params: Partial<SearchParamsDTO>) => [SEARCH_RESOURCES, params] as const,
  searchGrepCodes: (params: Partial<GrepSearchResultsDTO>) => [SEARCH_GREP_CODES, params] as const,
};

export const useSearch = (
  query: StringSort<NoNodeDraftSearchParams>,
  options?: Partial<UseQueryOptions<MultiSummarySearchResults>>,
) =>
  useQuery<MultiSummarySearchResults>({
    queryKey: searchQueryKeys.search(query),
    queryFn: () => postSearch(query),
    ...options,
  });

interface UseSearchWithCustomSubjectsFiltering extends StringSort<NoNodeDraftSearchParams> {
  favoriteSubjects?: string[];
}

/** Search hook for filtering grouped custom subjects(urn:favourites, urn:lmaSubjects, urn:daSubjects, urn:saSubjects).
 These custom subjects represent multiple related subjects, requiring this custom search hook to correctly transform them */
export const useSearchWithCustomSubjectsFiltering = (
  query: UseSearchWithCustomSubjectsFiltering,
  options?: Partial<UseQueryOptions<MultiSummarySearchResults>>,
) => {
  const { taxonomyVersion } = useTaxonomyVersion();

  const { data, isLoading } = useUserData({
    enabled: isValid(getAccessToken()) && getAccessTokenPersonal(),
  });

  const isLMASubjects = query.subjects?.join("") === LMA_SUBJECT_ID;
  const isDASubjects = query.subjects?.join("") === DA_SUBJECT_ID;
  const isSASubjects = query.subjects?.join("") === SA_SUBJECT_ID;

  const searchNodesQuery = usePostSearchNodes(
    { ...customFieldsBody(data?.userId ?? ""), taxonomyVersion },
    { enabled: !!data?.userId && (isLMASubjects || isDASubjects || isSASubjects) },
  );

  const subjectIdObject = useMemo(() => {
    if (!data?.userId || !searchNodesQuery.data) return defaultSubjectIdObject;
    return getResultSubjectIdObject(data.userId, searchNodesQuery.data.results);
  }, [data?.userId, searchNodesQuery.data]);

  const actualQuery = getSubjectsIdsQuery(query, data?.favoriteSubjects, subjectIdObject);

  return useQuery<MultiSummarySearchResults>({
    queryKey: searchQueryKeys.searchWithCustomSubjectsFiltering(actualQuery),
    queryFn: () => postSearch({ ...actualQuery, resultTypes: ["draft", "concept", "learningpath"] }),
    ...options,
    enabled: options?.enabled && !isLoading && !searchNodesQuery.isLoading,
  });
};

export const useSearchSubjectStats = (
  body: SubjectAggsInputDTO,
  options?: Partial<UseQueryOptions<SubjectAggregationsDTO>>,
) => {
  return useQuery<SubjectAggregationsDTO>({
    queryKey: searchQueryKeys.searchSubjectStats(body),
    queryFn: () => searchSubjectStats(body),
    ...options,
  });
};

export const useSearchResources = (
  query: NoNodeSearchParams,
  options?: Partial<UseQueryOptions<MultiSummarySearchResults>>,
) =>
  useQuery<MultiSummarySearchResults>({
    queryKey: searchQueryKeys.searchResources(query),
    queryFn: () => searchResources(query),
    ...options,
  });

export const useSearchGrepCodes = (
  body: GrepSearchInputDTO,
  options?: Partial<UseQueryOptions<GrepSearchResultsDTO>>,
) =>
  useQuery<GrepSearchResultsDTO>({
    queryKey: searchQueryKeys.searchGrepCodes(body),
    queryFn: () => searchGrepCodes(body),
    ...options,
  });
