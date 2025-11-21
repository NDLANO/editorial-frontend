/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { LEARNINGPATH, LEARNINGPATH_SEARCH, LEARNINGPATH_TAGS, LEARNINGPATHS_WITH_ARTICLE } from "../../queryKeys";
import {
  LearningPathSummaryV2DTO,
  LearningPathTagsSummaryDTO,
  LearningPathV2DTO,
  SearchParamsDTO,
  SearchResultV2DTO,
} from "@ndla/types-backend/learningpath-api";
import {
  fetchLearningpath,
  fetchLearningpathsWithArticle,
  fetchLearningpathTags,
  learningpathSearch,
} from "./learningpathApi";

export const learningpathQueryKeys = {
  learningpath: (params: UseLearningpath) => [LEARNINGPATH, params],
  learningpathTags: (params: UseLearningpathTags) => [LEARNINGPATH_TAGS, params],
  search: (params: SearchParamsDTO) => [LEARNINGPATH_SEARCH, params],
  containingArticle: (id: number) => [LEARNINGPATHS_WITH_ARTICLE, id],
};

interface UseLearningpath {
  id: number;
  language?: string;
}

export const useLearningpath = (params: UseLearningpath, options?: Partial<UseQueryOptions<LearningPathV2DTO>>) => {
  return useQuery<LearningPathV2DTO>({
    queryKey: learningpathQueryKeys.learningpath(params),
    queryFn: () => fetchLearningpath(params.id, params.language),
    ...options,
  });
};

interface UseLearningpathTags {
  language?: string;
  fallback?: boolean;
}

export const useLearningpathTags = (params: UseLearningpathTags = {}, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery<LearningPathTagsSummaryDTO>({
    queryKey: learningpathQueryKeys.learningpathTags(params),
    queryFn: () => fetchLearningpathTags(params.language, params.fallback),
    ...options,
  });
};

export const useSearchLearningpaths = (
  params: SearchParamsDTO,
  options?: Partial<UseQueryOptions<SearchResultV2DTO>>,
) => {
  return useQuery<SearchResultV2DTO>({
    queryKey: learningpathQueryKeys.search(params),
    queryFn: () => learningpathSearch(params),
    ...options,
  });
};

export const useLearningpathsWithArticle = (
  id: number,
  options?: Partial<UseQueryOptions<LearningPathSummaryV2DTO[]>>,
) => {
  return useQuery<LearningPathSummaryV2DTO[]>({
    queryKey: learningpathQueryKeys.containingArticle(id),
    queryFn: () => fetchLearningpathsWithArticle(id),
    ...options,
  });
};
