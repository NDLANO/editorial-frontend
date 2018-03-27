/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetchAuthorized,
} from '../../util/apiHelpers';

const baseUrl = apiResourceUrl('/search-api/v1/search');

export const search = query => {
  if (query) {
    return fetchAuthorized(`${baseUrl}/?${queryString.stringify(query)}`).then(
      resolveJsonOrRejectWithError,
    );
  }
  return fetchAuthorized(`${baseUrl}/`).then(resolveJsonOrRejectWithError);
};
