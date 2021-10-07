import { useMutation, useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import { License } from '../../interfaces';
import { DRAFT, LICENSES, USER_DATA } from '../../queryKeys';
import { fetchDraft, fetchLicenses, fetchUserData, updateUserData } from './draftApi';
import { DraftApiType, UpdatedUserDataApiType, UserDataApiType } from './draftApiInterfaces';

export const useDraft = (
  id: number,
  language?: string,
  options?: UseQueryOptions<DraftApiType>,
) => {
  return useQuery<DraftApiType>([DRAFT, id, language], () => fetchDraft(id, language), options);
};

export const useLicenses = <ReturnType>(
  options?: UseQueryOptions<License[], unknown, ReturnType>,
) => useQuery<License[], unknown, ReturnType>(LICENSES, fetchLicenses, options);

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
