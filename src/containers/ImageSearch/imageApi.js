/**
 * Copyright (c) 2017-present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetchWithAccessToken,
} from '../../util/apiHelpers';

const baseUrl = apiResourceUrl('/image-api/v1/images');

export const search = (query, page, locale) =>
  fetchWithAccessToken(
    `${baseUrl}/?${queryString.stringify({
      query,
      page,
    })}&page-size=16&language=${locale}`,
  ).then(resolveJsonOrRejectWithError);

// export const search = (queryString, locale) =>
//   fetchWithAccessToken(`${baseUrl}/${queryString}&language=${locale}`, { headers: headerWithAccessToken(token) }).then(resolveJsonOrRejectWithError);

export const fetchImage = imageId =>
  fetchWithAccessToken(`${baseUrl}/${imageId}`).then(
    resolveJsonOrRejectWithError,
  );
