/**
 * Copyright (c) 2017-present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


import fetch from 'isomorphic-fetch';
import queryString from 'query-string';
import { resolveJsonOrRejectWithError, apiResourceUrl, headerWithAccessToken } from '../../util/apiHelpers';

const baseUrl = apiResourceUrl('/image-api/v1/images');

export const search = (query = { 'page-size': 16, page: 1 }, token) =>
  fetch(`${baseUrl}/?${queryString.stringify(query)}`, { headers: headerWithAccessToken(token) }).then(resolveJsonOrRejectWithError);

