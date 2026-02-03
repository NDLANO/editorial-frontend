/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Auth0UserData } from "../../interfaces";
import { AUTH0_EDITORS, AUTH0_RESPONSIBLES, AUTH0_USERS } from "../../queryKeys";
import { fetchAuth0Editors, fetchAuth0Responsibles, fetchAuth0Users } from "./auth0Api";

export interface Auth0Users {
  uniqueUserIds: string;
}

export const auth0QueryKeys = {
  users: (params?: Partial<Auth0Users>) => [AUTH0_USERS, params] as const,
  editors: [AUTH0_EDITORS] as const,
  responsibles: (params?: Partial<Auth0Editors>) => [AUTH0_RESPONSIBLES, params] as const,
};

export const useAuth0Users = (params: Auth0Users, options: Partial<UseQueryOptions<Auth0UserData[]>>) =>
  useQuery<Auth0UserData[]>({
    queryKey: auth0QueryKeys.users(params),
    queryFn: () => fetchAuth0Users(params.uniqueUserIds),
    ...options,
  });

export interface Auth0Editors {
  permission: string;
}

export const useAuth0Editors = <ReturnType = Auth0UserData[]>(
  options?: Partial<UseQueryOptions<Auth0UserData[], unknown, ReturnType>>,
) =>
  useQuery<Auth0UserData[], unknown, ReturnType>({
    queryKey: auth0QueryKeys.editors,
    queryFn: () => fetchAuth0Editors(),
    ...options,
  });

export const useAuth0Responsibles = <ReturnType = Auth0UserData[]>(
  params: Auth0Editors,
  options?: Partial<UseQueryOptions<Auth0UserData[], unknown, ReturnType>>,
) =>
  useQuery<Auth0UserData[], unknown, ReturnType>({
    queryKey: auth0QueryKeys.responsibles(params),
    queryFn: () => fetchAuth0Responsibles(params.permission),
    ...options,
  });
