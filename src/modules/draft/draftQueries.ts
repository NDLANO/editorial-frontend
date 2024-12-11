/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { IArticleSearchParamsDTO } from "@ndla/types-backend/article-api";
import {
  ILicenseDTO,
  IArticleDTO,
  IUserDataDTO,
  IUpdatedUserDataDTO,
  ISearchResultDTO,
  ITagsSearchResultDTO,
} from "@ndla/types-backend/draft-api";
import {
  fetchDraft,
  fetchLicenses,
  fetchStatusStateMachine,
  fetchUserData,
  updateUserData,
  fetchDraftHistory,
  fetchSearchTags,
  searchDrafts,
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

export interface UseDraftHistory {
  id: number;
  language?: string;
}

export const draftQueryKeys = {
  draft: (params?: Partial<UseDraft>) => [DRAFT, params] as const,
  draftHistory: (params?: Partial<UseDraftHistory>) => [DRAFT_HISTORY, params] as const,
  search: (params?: Partial<IArticleSearchParamsDTO>) => [SEARCH_DRAFTS, params] as const,
  licenses: [LICENSES] as const,
  userData: [USER_DATA] as const,
  statusStateMachine: (params?: Partial<StatusStateMachineParams>) => [DRAFT_STATUS_STATE_MACHINE, params] as const,
  draftSearchTags: (params?: Partial<UseSearchTags>) => [DRAFT_SEARCH_TAGS, params] as const,
};

draftQueryKeys.draft({ id: 1 });

export const useDraft = (params: UseDraft, options?: Partial<UseQueryOptions<IArticleDTO>>) => {
  return useQuery<IArticleDTO>({
    queryKey: draftQueryKeys.draft(params),
    queryFn: () => fetchDraft(params.id, params.language),
    ...options,
  });
};

export const useDraftHistory = (params: UseDraftHistory, options?: Partial<UseQueryOptions<IArticleDTO[]>>) => {
  return useQuery<IArticleDTO[]>({
    queryKey: draftQueryKeys.draft(params),
    queryFn: () => fetchDraftHistory(params.id, params.language),
    ...options,
  });
};

export const useSearchDrafts = (
  params: IArticleSearchParamsDTO,
  options?: Partial<UseQueryOptions<ISearchResultDTO>>,
) => {
  return useQuery<ISearchResultDTO>({
    queryKey: draftQueryKeys.search(params),
    queryFn: () => searchDrafts(params),
    ...options,
  });
};

export const useLicenses = <ReturnType = ILicenseDTO[]>(
  options?: Partial<UseQueryOptions<ILicenseDTO[], unknown, ReturnType>>,
) =>
  useQuery<ILicenseDTO[], unknown, ReturnType>({
    queryKey: draftQueryKeys.licenses,
    queryFn: fetchLicenses,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    retry: false,
    ...options,
  });

export const useUserData = (options?: Partial<UseQueryOptions<IUserDataDTO | undefined>>) =>
  useQuery<IUserDataDTO | undefined>({
    queryKey: draftQueryKeys.userData,
    queryFn: fetchUserData,
    ...options,
  });

export const useUpdateUserDataMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<IUserDataDTO, unknown, IUpdatedUserDataDTO, IUserDataDTO>({
    mutationFn: (data) => updateUserData(data),
    onMutate: async (newUserData) => {
      const key = draftQueryKeys.userData;
      await queryClient.cancelQueries({ queryKey: key });
      const previousUserData = queryClient.getQueryData<IUserDataDTO>(key);
      if (previousUserData) {
        queryClient.setQueryData<IUserDataDTO>(key, {
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

export const useDraftSearchTags = (params: UseSearchTags, options?: Partial<UseQueryOptions<ITagsSearchResultDTO>>) => {
  return useQuery<ITagsSearchResultDTO>({
    queryKey: draftQueryKeys.draftSearchTags(params),
    queryFn: () => fetchSearchTags(params.input, params.language),
    ...options,
  });
};
