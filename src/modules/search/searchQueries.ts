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
  IDraftSearchParams,
  IGrepSearchInput,
  IGrepSearchResults,
  IMultiSearchResult,
  ISearchParams,
  ISubjectAggregations,
  ISubjectAggsInput,
} from "@ndla/types-backend/search-api";
import { postSearch, searchGrepCodes, searchResources, searchSubjectStats } from "./searchApi";
import { DA_SUBJECT_ID, SA_SUBJECT_ID, LMA_SUBJECT_ID } from "../../constants";
import { StringSort } from "../../containers/SearchPage/components/form/SearchForm";
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

export const searchQueryKeys = {
  search: (params?: Partial<StringSort<IDraftSearchParams>>) => [SEARCH, params] as const,
  searchWithCustomSubjectsFiltering: (params?: Partial<StringSort<IDraftSearchParams>>) =>
    [SEARCH_WITH_CUSTOM_SUBJECTS_FILTERING, params] as const,
  searchSubjectStats: (params?: Partial<ISubjectAggsInput>) => [SEARCH_SUBJECT_STATS, params] as const,
  searchResources: (params: Partial<ISearchParams>) => [SEARCH_RESOURCES, params] as const,
  searchGrepCodes: (params: Partial<IGrepSearchResults>) => [SEARCH_GREP_CODES, params] as const,
};

export const useSearch = (
  query: StringSort<IDraftSearchParams>,
  options?: Partial<UseQueryOptions<IMultiSearchResult>>,
) =>
  useQuery<IMultiSearchResult>({
    queryKey: searchQueryKeys.search(query),
    queryFn: () => postSearch(query),
    ...options,
  });

interface UseSearchWithCustomSubjectsFiltering extends StringSort<IDraftSearchParams> {
  favoriteSubjects?: string[];
}

/** Search hook for filtering grouped custom subjects(urn:favourites, urn:lmaSubjects, urn:daSubjects, urn:saSubjects).
 These custom subjects represent multiple related subjects, requiring this custom search hook to correctly transform them */
export const useSearchWithCustomSubjectsFiltering = (
  query: UseSearchWithCustomSubjectsFiltering,
  options?: Partial<UseQueryOptions<IMultiSearchResult>>,
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

  return useQuery<IMultiSearchResult>({
    queryKey: searchQueryKeys.searchWithCustomSubjectsFiltering(actualQuery),
    queryFn: () => postSearch(actualQuery),
    ...options,
    enabled: options?.enabled && !isLoading && !searchNodesQuery.isLoading,
  });
};

export const useSearchSubjectStats = (
  body: ISubjectAggsInput,
  options?: Partial<UseQueryOptions<ISubjectAggregations>>,
) => {
  return useQuery<ISubjectAggregations>({
    queryKey: searchQueryKeys.searchSubjectStats(body),
    queryFn: () => searchSubjectStats(body),
    ...options,
  });
};

export const useSearchResources = (query: ISearchParams, options?: Partial<UseQueryOptions<IMultiSearchResult>>) =>
  useQuery<IMultiSearchResult>({
    queryKey: searchQueryKeys.searchResources(query),
    queryFn: () => searchResources(query),
    ...options,
  });

export const useSearchGrepCodes = (body: IGrepSearchInput, options?: Partial<UseQueryOptions<IGrepSearchResults>>) =>
  useQuery<IGrepSearchResults>({
    queryKey: searchQueryKeys.searchGrepCodes(body),
    queryFn: () => searchGrepCodes(body),
    ...options,
  });
