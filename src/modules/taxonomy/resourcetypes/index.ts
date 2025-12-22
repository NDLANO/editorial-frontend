/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { openapi, ResourceType } from "@ndla/types-taxonomy";
import { ResourceResourceTypePostBody } from "./resourceTypesApiInterfaces";
import { WithTaxonomyVersion } from "../../../interfaces";
import { createAuthClient } from "../../../util/apiHelpers";
import {
  resolveJsonOATS,
  resolveLocation,
  resolveVoidOrRejectWithError,
} from "../../../util/resolveJsonOrRejectWithError";

const client = createAuthClient<openapi.paths>("/taxonomy");

interface ResourceTypesGetParams extends WithTaxonomyVersion {
  language: string;
}

export const fetchAllResourceTypes = (params: ResourceTypesGetParams): Promise<ResourceType[]> =>
  client
    .GET("/v1/resource-types", {
      params: {
        query: params,
      },
      headers: {
        VersionHash: params.taxonomyVersion,
      },
    })
    .then((response) => resolveJsonOATS(response));

interface ResourceTypeGetParams extends WithTaxonomyVersion {
  id: string;
  language: string;
}

export const fetchResourceType = (params: ResourceTypeGetParams): Promise<ResourceType> =>
  client
    .GET("/v1/resource-types/{id}", {
      params: {
        path: { id: params.id },
        query: {
          language: params.language,
        },
      },
      headers: {
        VersionHash: params.taxonomyVersion,
      },
    })
    .then((response) => resolveJsonOATS(response));

export interface ResourceResourceTypePostParams extends WithTaxonomyVersion {
  body: ResourceResourceTypePostBody;
}

export const createResourceResourceType = (params: ResourceResourceTypePostParams): Promise<string> =>
  client
    .POST("/v1/resource-resourcetypes", {
      body: params.body,
      headers: {
        VersionHash: params.taxonomyVersion,
      },
    })
    .then((response) => resolveLocation(response.response));

export interface ResourceResourceTypeDeleteParams extends WithTaxonomyVersion {
  id: string;
}

export const deleteResourceResourceType = (params: ResourceResourceTypeDeleteParams): Promise<void> =>
  client
    .DELETE("/v1/resource-resourcetypes/{id}", {
      params: {
        path: { id: params.id },
      },
      headers: {
        VersionHash: params.taxonomyVersion,
      },
    })
    .then((response) => resolveVoidOrRejectWithError(response.response));
