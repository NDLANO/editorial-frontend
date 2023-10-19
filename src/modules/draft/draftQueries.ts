/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import {
  ILicense,
  IArticle,
  IUserData,
  IUpdatedUserData,
  ISearchResult,
} from '@ndla/types-backend/draft-api';
import {
  DRAFT,
  DRAFT_STATUS_STATE_MACHINE,
  LICENSES,
  USER_DATA,
  SEARCH_DRAFTS,
} from '../../queryKeys';
import {
  fetchDraft,
  fetchLicenses,
  fetchStatusStateMachine,
  fetchUserData,
  updateUserData,
  searchAllDrafts,
} from './draftApi';
import { DraftStatusStateMachineType } from '../../interfaces';
import { DraftSearchQuery } from './draftApiInterfaces';

export interface UseDraft {
  id: number;
  language?: string;
  responsibleId?: string;
}

export const draftQueryKeys = {
  draft: (params?: Partial<UseDraft>) => [DRAFT, params] as const,
  search: (params?: Partial<DraftSearchQuery>) => [SEARCH_DRAFTS, params] as const,
  licenses: [LICENSES] as const,
  userData: [USER_DATA] as const,
  statusStateMachine: (params?: Partial<StatusStateMachineParams>) =>
    [DRAFT_STATUS_STATE_MACHINE, params] as const,
};

draftQueryKeys.draft({ id: 1 });

export const useDraft = (params: UseDraft, options?: UseQueryOptions<IArticle>) => {
  return useQuery<IArticle>(
    draftQueryKeys.draft(params),
    () => fetchDraft(params.id, params.language),
    options,
  );
};
interface UseSearchDrafts extends DraftSearchQuery {
  ids: number[];
}

export const useSearchDrafts = (
  params: UseSearchDrafts,
  options?: UseQueryOptions<ISearchResult>,
) => {
  return useQuery<ISearchResult>(
    draftQueryKeys.search(params),
    () => searchAllDrafts(params.ids, params.language, params.sort),
    options,
  );
};

export const useLicenses = <ReturnType = ILicense[]>(
  options?: UseQueryOptions<ILicense[], unknown, ReturnType>,
) =>
  useQuery<ILicense[], unknown, ReturnType>(draftQueryKeys.licenses, fetchLicenses, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    retry: false,
    ...options,
  });

export const useUserData = (options?: UseQueryOptions<IUserData | undefined>) =>
  useQuery<IUserData | undefined>(draftQueryKeys.userData, fetchUserData, options);

export const useUpdateUserDataMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<IUserData, unknown, IUpdatedUserData, IUserData>(
    (data) => {
      return updateUserData(data);
    },
    {
      onMutate: async (newUserData) => {
        const key = draftQueryKeys.userData;
        await queryClient.cancelQueries(key);
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
      onSettled: () => queryClient.invalidateQueries(draftQueryKeys.userData),
    },
  );
};

interface StatusStateMachineParams {
  articleId?: number;
}

export const useDraftStatusStateMachine = (
  params: StatusStateMachineParams = {},
  options?: UseQueryOptions<DraftStatusStateMachineType>,
) => {
  return useQuery<DraftStatusStateMachineType>(
    draftQueryKeys.statusStateMachine(params),
    () => fetchStatusStateMachine(params.articleId),
    options,
  );
};
