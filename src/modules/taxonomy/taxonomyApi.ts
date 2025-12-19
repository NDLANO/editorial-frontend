/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ResolvedUrl } from "@ndla/types-taxonomy";
import { WithTaxonomyVersion } from "../../interfaces";
import { apiResourceUrl, httpFunctions } from "../../util/apiHelpers";

const baseUrl = apiResourceUrl("/taxonomy/v1");

const { fetchAndResolve } = httpFunctions;

interface ResolveUrlsParams extends WithTaxonomyVersion {
  path: string;
}

const resolveUrls = ({ path, taxonomyVersion }: ResolveUrlsParams): Promise<ResolvedUrl> => {
  return fetchAndResolve({
    url: `${baseUrl}/url/resolve`,
    taxonomyVersion,
    queryParams: { path },
  });
};

export { resolveUrls };
