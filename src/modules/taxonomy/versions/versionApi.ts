/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { paths, Version, VersionPostPut } from "@ndla/types-taxonomy";
import { createAuthClient } from "../../../util/apiHelpers";
import { resolveJsonOATS, resolveLocation, resolveOATS } from "../../../util/resolveJsonOrRejectWithError";
import { GetVersionsParams } from "./versionApiTypes";

const client = createAuthClient<paths>("/taxonomy");

interface VersionGetParams extends GetVersionsParams {}

export const fetchVersions = (params: VersionGetParams): Promise<Version[]> =>
  client
    .GET("/v1/versions", {
      params: {
        query: params,
      },
    })
    .then((response) => resolveJsonOATS(response));

interface VersionGetParam {
  id: string;
}

export const fetchVersion = (params: VersionGetParam): Promise<Version> =>
  client
    .GET("/v1/versions/{id}", {
      params: {
        path: params,
      },
    })
    .then((response) => resolveJsonOATS(response));

interface VersionPostParams {
  body: VersionPostPut;
  sourceId?: string;
}

export const postVersion = (params: VersionPostParams): Promise<string> =>
  client
    .POST("/v1/versions", {
      params: {
        query: { sourceId: params.sourceId },
      },
      body: params.body,
    })
    .then((response) => resolveLocation(response.response));

interface VersionPutParams {
  id: string;
  body: VersionPostPut;
}

export const putVersion = (params: VersionPutParams): Promise<void> =>
  client
    .PUT("/v1/versions/{id}", {
      params: {
        path: { id: params.id },
      },
      body: params.body,
    })
    .then((response) => resolveOATS(response));

interface VersionDeleteParams {
  id: string;
}

export const deleteVersion = (params: VersionDeleteParams): Promise<void> =>
  client
    .DELETE("/v1/versions/{id}", {
      params: {
        path: { id: params.id },
      },
    })
    .then((response) => resolveOATS(response));

interface PublishVersionParams {
  id: string;
}

export const publishVersion = (params: PublishVersionParams): Promise<void> =>
  client
    .PUT("/v1/versions/{id}/publish", {
      params: {
        path: { id: params.id },
      },
    })
    .then((response) => resolveOATS(response));
