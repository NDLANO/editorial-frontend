/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { queryOptions } from "@tanstack/react-query";
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

export const auth0UsersQueryOptions = (params: Auth0Users) => {
  return queryOptions({
    queryKey: auth0QueryKeys.users(params),
    queryFn: () => fetchAuth0Users(params.uniqueUserIds),
  });
};

export interface Auth0Editors {
  permission: string;
}

export const auth0EditorsQueryOptions = () => {
  return queryOptions({
    queryKey: auth0QueryKeys.editors,
    queryFn: fetchAuth0Editors,
    // TODO: Consider adding staleTime?
  });
};

export const auth0ResponsiblesQueryOptions = (params: Auth0Editors) => {
  return queryOptions({
    queryKey: auth0QueryKeys.responsibles(params),
    queryFn: () => fetchAuth0Responsibles(params.permission),
  });
};
