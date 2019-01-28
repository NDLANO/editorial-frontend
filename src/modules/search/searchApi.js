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
import { transformQuery } from '../../util/searchHelpers';

const baseUrl = apiResourceUrl('/search-api/v1/search');
const groupUrl = apiResourceUrl('/search-api/v1/search/group/');

export const search = async query => {
  const response = await fetchAuthorized(
    `${baseUrl}/editorial/?${queryString.stringify(transformQuery(query))}`,
  );
  return resolveJsonOrRejectWithError(response);
};

export const searchDraft = async query => {
  let response;
  if (query) {
    const types = query.types ? query.types.split(',') : [];
    const realPageSize =
      types.length > 1
        ? Math.ceil(query['page-size'] / types.length)
        : query['page-size'];
    response = await fetchAuthorized(
      `${baseUrl}/draft/?${queryString.stringify({
        ...query,
        'page-size': realPageSize,
      })}`,
    );
    return resolveJsonOrRejectWithError(response);
  }
  response = await fetchAuthorized(`${baseUrl}/draft/`);
  return resolveJsonOrRejectWithError(response);
};

export const groupSearch = (query, type) =>
  fetchAuthorized(`${groupUrl}?query=${query}&resource-types=${type}`).then(
    resolveJsonOrRejectWithError,
  );
