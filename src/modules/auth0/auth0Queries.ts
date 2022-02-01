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

export const useAuth0Users = (uniqueUserIds: string, options: UseQueryOptions<Auth0UserData[]>) =>
  useQuery<Auth0UserData[]>(
    [AUTH0_USERS, uniqueUserIds],
    () => fetchAuth0Users(uniqueUserIds),
    options,
  );

export const useAuth0Editors = <ReturnType>(
  permission: string,
  options: UseQueryOptions<Auth0UserData[], unknown, ReturnType>,
) =>
  useQuery<Auth0UserData[], unknown, ReturnType>(
    [AUTH0_EDITORS, permission],
    () => fetchAuth0Editors(permission),
    options,
  );
