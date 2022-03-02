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

export const useDraft = (
  id: number | string,
  language?: string,
  options?: UseQueryOptions<IArticle>,
) => {
  return useQuery<IArticle>([DRAFT, id, language], () => fetchDraft(id, language), options);
};

export const useLicenses = <ReturnType = ILicense[]>(
  options?: UseQueryOptions<ILicense[], unknown, ReturnType>,
) =>
  useQuery<ILicense[], unknown, ReturnType>(LICENSES, fetchLicenses, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    retry: false,
    ...options,
  });

export const useUserData = (options?: UseQueryOptions<IUserData>) =>
  useQuery<IUserData>(USER_DATA, fetchUserData, options);

export const useUpdateUserDataMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<IUserData, unknown, IUpdatedUserData, IUserData>(
    data => {
      return updateUserData(data);
    },
    {
      onMutate: async newUserData => {
        await queryClient.cancelQueries(USER_DATA);
        const previousUserData = queryClient.getQueryData<IUserData>(USER_DATA);
        queryClient.setQueryData<IUserData>(USER_DATA, {
          ...previousUserData,
          userId: previousUserData?.userId!,
          ...newUserData,
        });
        return previousUserData;
      },
      onError: (_, __, previousUserData) => {
        if (previousUserData) {
          queryClient.setQueryData(USER_DATA, previousUserData);
        }
      },
      onSettled: () => queryClient.invalidateQueries(USER_DATA),
    },
  );
};

interface StatusStateMachineParams {
  articleId?: number;
}
export const useDraftStatusStateMachine = (
  params: StatusStateMachineParams = {},
  options?: UseQueryOptions<Record<string, string[]>>,
) => {
  return useQuery<Record<string, string[]>>(
    [DRAFT_STATUS_STATE_MACHINE, params],
    () => fetchStatusStateMachine(params.articleId),
    options,
  );
};
