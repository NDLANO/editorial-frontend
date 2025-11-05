/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { ArticleSearchParamsDTO } from "@ndla/types-backend/article-api";
import {
  LicenseDTO,
  ArticleDTO,
  UserDataDTO,
  UpdatedUserDataDTO,
  ArticleSearchResultDTO,
  TagsSearchResultDTO,
  ArticleRevisionHistoryDTO,
} from "@ndla/types-backend/draft-api";
import {
  fetchDraft,
  fetchLicenses,
  fetchStatusStateMachine,
  fetchUserData,
  updateUserData,
  fetchSearchTags,
  searchDrafts,
  fetchArticleRevisionHistory,
} from "./draftApi";
import { DraftStatusStateMachineType } from "../../interfaces";
import {
  DRAFT,
  DRAFT_STATUS_STATE_MACHINE,
  LICENSES,
  USER_DATA,
  SEARCH_DRAFTS,
  DRAFT_HISTORY,
  DRAFT_SEARCH_TAGS,
} from "../../queryKeys";

export interface UseDraft {
  id: number;
  language?: string;
  responsibleId?: string;
}

export interface UseDraftRevisionHistory {
  id: number;
  language?: string;
}

export const draftQueryKeys = {
  draft: (articleId: number) => [DRAFT, articleId] as const,
  draftWithLanguage: (articleId: number, language: string) => [DRAFT, articleId, language] as const,
  articleRevisionHistory: (articleId: number) => [DRAFT_HISTORY, articleId] as const,
  search: (params?: Partial<ArticleSearchParamsDTO>) => [SEARCH_DRAFTS, params] as const,
  licenses: [LICENSES] as const,
  userData: [USER_DATA] as const,
  statusStateMachine: (params?: Partial<StatusStateMachineParams>) => [DRAFT_STATUS_STATE_MACHINE, params] as const,
  draftSearchTags: (params?: Partial<UseSearchTags>) => [DRAFT_SEARCH_TAGS, params] as const,
};

export const useDraft = ({ id, language }: UseDraft, options?: Partial<UseQueryOptions<ArticleDTO>>) => {
  return useQuery<ArticleDTO>({
    queryKey: language ? draftQueryKeys.draftWithLanguage(id, language) : draftQueryKeys.draft(id),
    queryFn: () => fetchDraft(id, language),
    ...options,
  });
};

export const useArticleRevisionHistory = (
  { id, language }: UseDraftRevisionHistory,
  options?: Partial<UseQueryOptions<ArticleRevisionHistoryDTO>>,
) => {
  return useQuery<ArticleRevisionHistoryDTO>({
    queryKey: draftQueryKeys.articleRevisionHistory(id),
    queryFn: () => fetchArticleRevisionHistory(id, language),
    ...options,
  });
};

export const useSearchDrafts = (
  params: ArticleSearchParamsDTO,
  options?: Partial<UseQueryOptions<ArticleSearchResultDTO>>,
) => {
  return useQuery<ArticleSearchResultDTO>({
    queryKey: draftQueryKeys.search(params),
    queryFn: () => searchDrafts(params),
    ...options,
  });
};

export const useLicenses = <ReturnType = LicenseDTO[]>(
  options?: Partial<UseQueryOptions<LicenseDTO[], unknown, ReturnType>>,
) =>
  useQuery<LicenseDTO[], unknown, ReturnType>({
    queryKey: draftQueryKeys.licenses,
    queryFn: fetchLicenses,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    retry: false,
    ...options,
  });

export const useUserData = (options?: Partial<UseQueryOptions<UserDataDTO | undefined>>) =>
  useQuery<UserDataDTO | undefined>({
    queryKey: draftQueryKeys.userData,
    queryFn: fetchUserData,
    ...options,
  });

export const useUpdateUserDataMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<UserDataDTO, unknown, UpdatedUserDataDTO, UserDataDTO>({
    mutationFn: (data) => updateUserData(data),
    onMutate: async (newUserData) => {
      const key = draftQueryKeys.userData;
      await queryClient.cancelQueries({ queryKey: key });
      const previousUserData = queryClient.getQueryData<UserDataDTO>(key);
      if (previousUserData) {
        queryClient.setQueryData<UserDataDTO>(key, {
          ...previousUserData,
          ...newUserData,
        });
      }
      return previousUserData;
    },
    onError: (_, __, previousUserData) => {
      if (previousUserData) {
        queryClient.setQueryData(draftQueryKeys.userData, previousUserData);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: draftQueryKeys.userData }),
  });
};

interface StatusStateMachineParams {
  articleId?: number;
}

export const useDraftStatusStateMachine = (
  params: StatusStateMachineParams = {},
  options?: Partial<UseQueryOptions<DraftStatusStateMachineType>>,
) => {
  return useQuery<DraftStatusStateMachineType>({
    queryKey: draftQueryKeys.statusStateMachine(params),
    queryFn: () => fetchStatusStateMachine(params.articleId),
    ...options,
  });
};

export interface UseSearchTags {
  input: string;
  language: string;
}

export const useDraftSearchTags = (params: UseSearchTags, options?: Partial<UseQueryOptions<TagsSearchResultDTO>>) => {
  return useQuery<TagsSearchResultDTO>({
    queryKey: draftQueryKeys.draftSearchTags(params),
    queryFn: () => fetchSearchTags(params.input, params.language),
    ...options,
  });
};
