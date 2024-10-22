/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import {
  ILicense,
  IArticle,
  IUserData,
  IUpdatedUserData,
  ISearchResult,
  ITagsSearchResult,
} from "@ndla/types-backend/draft-api";
import {
  fetchDraft,
  fetchLicenses,
  fetchStatusStateMachine,
  fetchUserData,
  updateUserData,
  searchAllDrafts,
  fetchDraftHistory,
  fetchSearchTags,
  fetchGrepCodes,
} from "./draftApi";
import { DraftSearchQuery } from "./draftApiInterfaces";
import { DraftStatusStateMachineType } from "../../interfaces";
import {
  DRAFT,
  DRAFT_STATUS_STATE_MACHINE,
  LICENSES,
  USER_DATA,
  SEARCH_DRAFTS,
  DRAFT_HISTORY,
  DRAFT_SEARCH_TAGS,
  GREP_CODES_SEARCH,
} from "../../queryKeys";
import { fetchGrepCodeTitle } from "../grep/grepApi";

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
  search: (params?: Partial<DraftSearchQuery>) => [SEARCH_DRAFTS, params] as const,
  licenses: [LICENSES] as const,
  userData: [USER_DATA] as const,
  statusStateMachine: (params?: Partial<StatusStateMachineParams>) => [DRAFT_STATUS_STATE_MACHINE, params] as const,
  draftSearchTags: (params?: Partial<UseSearchTags>) => [DRAFT_SEARCH_TAGS, params] as const,
  grepCodesSearch: (params?: Partial<UseGrepCodesSearch>) => [GREP_CODES_SEARCH, params] as const,
};

draftQueryKeys.draft({ id: 1 });

export const useDraft = (params: UseDraft, options?: Partial<UseQueryOptions<IArticle>>) => {
  return useQuery<IArticle>({
    queryKey: draftQueryKeys.draft(params),
    queryFn: () => fetchDraft(params.id, params.language),
    ...options,
  });
};
interface UseSearchDrafts extends DraftSearchQuery {
  ids: number[];
}

export const useDraftHistory = (params: UseDraftHistory, options?: Partial<UseQueryOptions<IArticle[]>>) => {
  return useQuery<IArticle[]>({
    queryKey: draftQueryKeys.draft(params),
    queryFn: () => fetchDraftHistory(params.id, params.language),
    ...options,
  });
};

export const useSearchDrafts = (params: UseSearchDrafts, options?: Partial<UseQueryOptions<ISearchResult>>) => {
  return useQuery<ISearchResult>({
    queryKey: draftQueryKeys.search(params),
    queryFn: () => searchAllDrafts(params.ids, params.language, params.sort),
    ...options,
  });
};

export const useLicenses = <ReturnType = ILicense[]>(
  options?: Partial<UseQueryOptions<ILicense[], unknown, ReturnType>>,
) =>
  useQuery<ILicense[], unknown, ReturnType>({
    queryKey: draftQueryKeys.licenses,
    queryFn: fetchLicenses,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    retry: false,
    ...options,
  });

export const useUserData = (options?: Partial<UseQueryOptions<IUserData | undefined>>) =>
  useQuery<IUserData | undefined>({
    queryKey: draftQueryKeys.userData,
    queryFn: fetchUserData,
    ...options,
  });

export const useUpdateUserDataMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<IUserData, unknown, IUpdatedUserData, IUserData>({
    mutationFn: (data) => updateUserData(data),
    onMutate: async (newUserData) => {
      const key = draftQueryKeys.userData;
      await queryClient.cancelQueries({ queryKey: key });
      const previousUserData = queryClient.getQueryData<IUserData>(key);
      queryClient.setQueryData<IUserData>(key, {
        ...previousUserData,
        userId: previousUserData?.userId!,
        ...newUserData,
      });
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

export const useDraftSearchTags = (params: UseSearchTags, options?: Partial<UseQueryOptions<ITagsSearchResult>>) => {
  return useQuery<ITagsSearchResult>({
    queryKey: draftQueryKeys.draftSearchTags(params),
    queryFn: () => fetchSearchTags(params.input, params.language),
    ...options,
  });
};

export interface UseGrepCodesSearch {
  input: string;
}

interface GrepCodesSearchResult {
  results: {
    code: string;
    title: string;
  }[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export const useGrepCodesSearch = (
  params: UseGrepCodesSearch,
  options?: Partial<UseQueryOptions<GrepCodesSearchResult>>,
) => {
  return useQuery<GrepCodesSearchResult>({
    queryKey: draftQueryKeys.grepCodesSearch(params),
    queryFn: async () => {
      const result = await fetchGrepCodes(params.input);
      const convertedGrepCodes = await Promise.all(
        result.results.map(async (c) => {
          const grepCodeTitle = await fetchGrepCodeTitle(c);
          return {
            code: c,
            title: grepCodeTitle ? `${c} - ${grepCodeTitle}` : c,
          };
        }),
      );
      return { ...result, results: convertedGrepCodes };
    },
    ...options,
  });
};
