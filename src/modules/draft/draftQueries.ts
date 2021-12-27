/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMutation, useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import { License } from '../../interfaces';
import { DRAFT, LICENSES, USER_DATA } from '../../queryKeys';
import { fetchDraft, fetchLicenses, fetchUserData, updateUserData } from './draftApi';
import { DraftApiType, UpdatedUserDataApiType, UserDataApiType } from './draftApiInterfaces';

export const useDraft = (
  id: number | string,
  language?: string,
  options?: UseQueryOptions<DraftApiType>,
) => {
  return useQuery<DraftApiType>([DRAFT, id, language], () => fetchDraft(id, language), options);
};

export const useLicenses = <ReturnType = License[]>(
  options?: UseQueryOptions<License[], unknown, ReturnType>,
) =>
  useQuery<License[], unknown, ReturnType>(LICENSES, fetchLicenses, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    retry: false,
    ...options,
  });

export const useUserData = (options?: UseQueryOptions<UserDataApiType>) =>
  useQuery<UserDataApiType>(USER_DATA, fetchUserData, options);

export const useUpdateUserDataMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<UserDataApiType, unknown, UpdatedUserDataApiType, UserDataApiType>(
    data => {
      return updateUserData(data);
    },
    {
      onMutate: async newUserData => {
        await queryClient.cancelQueries(USER_DATA);
        const previousUserData = queryClient.getQueryData<UserDataApiType>(USER_DATA);
        queryClient.setQueryData<UserDataApiType>(USER_DATA, {
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
