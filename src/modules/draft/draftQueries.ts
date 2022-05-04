/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMutation, useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import { ILicense, IArticle, IUserData, IUpdatedUserData } from '@ndla/types-draft-api';
import { DRAFT, DRAFT_STATUS_STATE_MACHINE, LICENSES, USER_DATA } from '../../queryKeys';
import {
  fetchDraft,
  fetchLicenses,
  fetchStatusStateMachine,
  fetchUserData,
  updateUserData,
} from './draftApi';
import { DraftStatusStateMachineType } from '../../interfaces';

export interface UseDraft {
  id: number;
  language?: string;
}

export const draftQueryKey = (params?: Partial<UseDraft>) => [DRAFT, params];

export const useDraft = (params: UseDraft, options?: UseQueryOptions<IArticle>) => {
  return useQuery<IArticle>(
    draftQueryKey(params),
    () => fetchDraft(params.id, params.language),
    options,
  );
};

export const licensesQueryKey = () => [LICENSES];

export const useLicenses = <ReturnType = ILicense[]>(
  options?: UseQueryOptions<ILicense[], unknown, ReturnType>,
) =>
  useQuery<ILicense[], unknown, ReturnType>(licensesQueryKey(), fetchLicenses, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    retry: false,
    ...options,
  });

export const userDataQueryKey = () => [USER_DATA];

export const useUserData = (options?: UseQueryOptions<IUserData>) =>
  useQuery<IUserData>(userDataQueryKey(), fetchUserData, options);

export const useUpdateUserDataMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<IUserData, unknown, IUpdatedUserData, IUserData>(
    data => {
      return updateUserData(data);
    },
    {
      onMutate: async newUserData => {
        const key = userDataQueryKey();
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
          queryClient.setQueryData(userDataQueryKey(), previousUserData);
        }
      },
      onSettled: () => queryClient.invalidateQueries(userDataQueryKey()),
    },
  );
};

interface StatusStateMachineParams {
  articleId?: number;
}

export const draftStatusStateMachineQueryKey = (params?: Partial<StatusStateMachineParams>) => [
  DRAFT_STATUS_STATE_MACHINE,
  params,
];
export const useDraftStatusStateMachine = (
  params: StatusStateMachineParams = {},
  options?: UseQueryOptions<DraftStatusStateMachineType>,
) => {
  return useQuery<DraftStatusStateMachineType>(
    draftStatusStateMachineQueryKey(params),
    () => fetchStatusStateMachine(params.articleId),
    options,
  );
};
