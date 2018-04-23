/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetchAuthorized,
} from '../../util/apiHelpers';

const baseUrl = apiResourceUrl('/search-api/v1/search/draft/');
const groupUrl = apiResourceUrl('/search-api/v1/search/group/');

export const search = queryString =>
  fetchAuthorized(`${baseUrl}${queryString}`).then(
    resolveJsonOrRejectWithError,
  );

export const groupSearch = (query, type) =>
  fetchAuthorized(`${groupUrl}?query=${query}&resource-types=${type}`).then(
    resolveJsonOrRejectWithError,
  );
