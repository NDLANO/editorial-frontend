import { useMutation, useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import { License } from '../../interfaces';
import { DRAFT, LICENSES, USER_DATA } from '../../queryKeys';
import { fetchDraft, fetchLicenses, fetchUserData, updateUserData } from './draftApi';
import { UpdatedUserDataApiType, UserDataApiType } from './draftApiInterfaces';

export const useDraft = (id: number, language?: string) => {
  return useQuery([DRAFT, id, language], () => fetchDraft(id, language));
};

export const useLicenses = (options?: UseQueryOptions<License[]>) =>
  useQuery<License[]>(LICENSES, fetchLicenses, options);

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
        const previousUserData = queryClient.getQueryData<UserDataApiType>('userData');
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
