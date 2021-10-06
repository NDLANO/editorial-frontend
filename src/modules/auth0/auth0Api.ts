/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, UseQueryOptions } from 'react-query';
import { Auth0UserData, ZendeskToken } from '../../interfaces';
import { AUTH0_USERS } from '../../queryKeys';
import { resolveJsonOrRejectWithError, fetchAuthorized } from '../../util/apiHelpers';

export const useAuth0Users = (uniqueUserIds: string, options: UseQueryOptions<Auth0UserData[]>) =>
  useQuery<Auth0UserData[]>(
    [AUTH0_USERS, uniqueUserIds],
    () => fetchAuth0Users(uniqueUserIds),
    options,
  );

export const fetchAuth0Users = (uniqueUserIds: string): Promise<Auth0UserData[]> =>
  fetchAuthorized(`/get_note_users?userIds=${uniqueUserIds}`).then(r =>
    resolveJsonOrRejectWithError<Auth0UserData[]>(r),
  );

export interface SimpleUserType {
  id: string;
  name: string;
}

export const fetchAuth0UsersFromUserIds = async (
  userIds: string[],
  setUsers: (users: SimpleUserType[]) => void,
): Promise<SimpleUserType[]> => {
  const uniqueUserIds = Array.from(new Set(userIds)).join(',');
  const response = await fetchAuth0Users(uniqueUserIds);
  const systemUser = { id: 'System', name: 'System' };
  const users = response
    ? [...response.map(user => ({ id: user.app_metadata.ndla_id, name: user.name })), systemUser]
    : [systemUser];
  setUsers(users);
  return users;
};

export const fetchAuth0Editors = (role: string): Promise<Auth0UserData[]> =>
  fetchAuthorized(`/get_editors?role=${role}`).then(r =>
    resolveJsonOrRejectWithError<Auth0UserData[]>(r),
  );

export const fetchZendeskToken = (): Promise<ZendeskToken> =>
  fetchAuthorized('/get_zendesk_token').then(r => resolveJsonOrRejectWithError<ZendeskToken>(r));
