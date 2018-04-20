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

const baseUrl = apiResourceUrl('/search-api/v1/search/draft');

export const search = async query => {
  let response;
  if (query) {
    const types = query.types ? query.types.split(',') : [];
    const realPageSize =
      types.length > 1
        ? Math.ceil(query['page-size'] / types.length)
        : query['page-size'];
    response = await fetchAuthorized(
      `${baseUrl}/?${queryString.stringify({
        ...query,
        'page-size': realPageSize,
      })}`,
    );
    return resolveJsonOrRejectWithError(response);
  }
  response = await fetchAuthorized(`${baseUrl}/`);
  return resolveJsonOrRejectWithError(response);
};
