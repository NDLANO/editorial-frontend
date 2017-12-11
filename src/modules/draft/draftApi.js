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

const baseUrl = apiResourceUrl('/draft-api/v1/drafts');

export const fetchDraft = (id, language) => {
  const query = queryString.stringify({ language });
  const url = language
    ? `${baseUrl}/${id}?${query}`
    : `${baseUrl}/${id}`;
  return fetchWithAccessToken(url).then(resolveJsonOrRejectWithError);
};

export const updateDraft = draft =>
  fetchWithAccessToken(`${baseUrl}/${draft.id}`, {
    method: 'PATCH',
    body: JSON.stringify(draft),
  }).then(resolveJsonOrRejectWithError);

export const createDraft = draft =>
  fetchWithAccessToken(`${baseUrl}/`, {
    method: 'POST',
    body: JSON.stringify(draft),
  }).then(resolveJsonOrRejectWithError);

export const fetchNewArticleId = id => {
  const url = `${baseUrl}/external_id/${id}`;
  return fetchWithAccessToken(url).then(resolveJsonOrRejectWithError);
};

export const validateDraft = id =>
  fetchWithAccessToken(`${baseUrl}/${id}/validate`, {
    method: 'PUT',
  }).then(resolveJsonOrRejectWithError)
