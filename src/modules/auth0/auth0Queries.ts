/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Auth0UserData } from '../../interfaces';
import { AUTH0_EDITORS, AUTH0_RESPONSIBLES, AUTH0_USERS } from '../../queryKeys';
import { fetchAuth0Editors, fetchAuth0Responsibles, fetchAuth0Users } from './auth0Api';

export interface Auth0Users {
  uniqueUserIds: string;
}

export const auth0QueryKeys = {
  users: (params?: Partial<Auth0Users>) => [AUTH0_USERS, params] as const,
  editors: [AUTH0_EDITORS] as const,
  responsibles: (params?: Partial<Auth0Editors>) => [AUTH0_RESPONSIBLES, params] as const,
};

export const useAuth0Users = (params: Auth0Users, options: UseQueryOptions<Auth0UserData[]>) =>
  useQuery<Auth0UserData[]>(
    auth0QueryKeys.users(params),
    () => fetchAuth0Users(params.uniqueUserIds),
    options,
  );

export interface Auth0Editors {
  permission: string;
}

export const useAuth0Editors = <ReturnType>(
  options: UseQueryOptions<Auth0UserData[], unknown, ReturnType>,
) =>
  useQuery<Auth0UserData[], unknown, ReturnType>(
    auth0QueryKeys.editors,
    () => fetchAuth0Editors(),
    options,
  );

export const useAuth0Responsibles = <ReturnType>(
  params: Auth0Editors,
  options: UseQueryOptions<Auth0UserData[], unknown, ReturnType>,
) =>
  useQuery<Auth0UserData[], unknown, ReturnType>(
    auth0QueryKeys.responsibles(params),
    () => fetchAuth0Responsibles(params.permission),
    options,
  );
