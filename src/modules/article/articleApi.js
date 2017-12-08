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
  fetchWithAccessToken,
} from '../../util/apiHelpers';

const baseUrl = apiResourceUrl('/article-api/v2/articles');

export const fetchTags = language => {
  const query = queryString.stringify({ size: 7000, language });
  return fetchWithAccessToken(`${baseUrl}/tags/?${query}`).then(
    resolveJsonOrRejectWithError,
  );
};

export const fetchLicenses = () =>
  fetchWithAccessToken(`${baseUrl}/licenses`).then(
    resolveJsonOrRejectWithError,
  );
