/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IResourceDTO, ISingleResourceStatsDTO, openapi, ResourceType } from "@ndla/types-backend/myndla-api";
import { createAuthClient } from "../../util/apiHelpers";
import { resolveJsonOATS } from "../../util/resolveJsonOrRejectWithError";

const client = createAuthClient<openapi.paths>();

export const fetchResourceStats = async (
  resourceTypes: string[],
  resourceIds: string[],
): Promise<ISingleResourceStatsDTO[]> =>
  client
    .GET("/myndla-api/v1/stats/favorites/{resourceType}/{resourceIds}", {
      params: { path: { resourceType: resourceTypes, resourceIds } },
    })
    .then(resolveJsonOATS);

interface ResourceWithFilteredResourceType<T extends ResourceType> extends Omit<IResourceDTO, "resourceType"> {
  resourceType: Exclude<ResourceType, T>;
}

function resourceTypeExcludeGuard<Excluded extends ResourceType[]>(
  input: IResourceDTO,
  exclude: Excluded,
): input is ResourceWithFilteredResourceType<Excluded[number]> {
  return !exclude.includes(input.resourceType as Excluded[number]);
}

export const fetchRecentFavorited = async <RT extends ResourceType>({
  exclude,
  size,
}: {
  exclude: RT[];
  size?: number;
}): Promise<ResourceWithFilteredResourceType<(typeof exclude)[number]>[]> => {
  const res = await client
    .GET("/myndla-api/v1/folders/resources/recent", { params: { query: { size, exclude } } })
    .then(resolveJsonOATS);
  // NOTE: We filter out types for typescripts sake
  //       In theory this will never filter anything since the backend excludes the type we filter out here
  //       But it is necessary to make typescript happy without casting.
  return res.filter((r) => resourceTypeExcludeGuard(r, exclude));
};
