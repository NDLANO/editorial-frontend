/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, UseQueryOptions } from 'react-query';
import { Auth0UserData } from '../../interfaces';
import { AUTH0_EDITORS, AUTH0_USERS } from '../../queryKeys';
import { fetchAuth0Editors, fetchAuth0Users } from './auth0Api';

export interface Auth0Users {
  uniqueUserIds: string;
}

export const auth0UsersQueryKey = (params?: Partial<Auth0Users>) => [AUTH0_USERS, params];
export const useAuth0Users = (params: Auth0Users, options: UseQueryOptions<Auth0UserData[]>) =>
  useQuery<Auth0UserData[]>(
    auth0UsersQueryKey(params),
    () => fetchAuth0Users(params.uniqueUserIds),
    options,
  );

export interface Auth0Editors {
  permission: string;
}

export const auth0EditorsQueryKey = (params?: Partial<Auth0Editors>) => [AUTH0_EDITORS, params];

export const useAuth0Editors = <ReturnType>(
  params: Auth0Editors,
  options: UseQueryOptions<Auth0UserData[], unknown, ReturnType>,
) =>
  useQuery<Auth0UserData[], unknown, ReturnType>(
    auth0EditorsQueryKey(params),
    () => fetchAuth0Editors(params.permission),
    options,
  );
