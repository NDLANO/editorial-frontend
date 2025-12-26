/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { openapi, ResolvedUrl } from "@ndla/types-taxonomy";
import { WithTaxonomyVersion } from "../../interfaces";
import { createAuthClient } from "../../util/apiHelpers";
import { resolveJsonOATS } from "../../util/resolveJsonOrRejectWithError";

const client = createAuthClient<openapi.paths>("/taxonomy");

interface ResolveUrlsParams extends WithTaxonomyVersion {
  path: string;
}

const resolveUrls = (params: ResolveUrlsParams): Promise<ResolvedUrl> =>
  client
    .GET("/v1/url/resolve", {
      params: { query: params },
      headers: { VersionHash: params.taxonomyVersion },
    })
    .then((response) => resolveJsonOATS(response));

export { resolveUrls };
