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

const draftBaseUrl = apiResourceUrl('/draft-api/v1/drafts');
const articleBaseUrl = apiResourceUrl('/article-api/v2/articles');

export const fetchDraft = (id, language) => {
  const query = queryString.stringify({ language });
  const url = language
    ? `${draftBaseUrl}/${id}?${query}`
    : `${draftBaseUrl}/${id}`;
  return fetchWithAccessToken(url).then(resolveJsonOrRejectWithError);
};

export const fetchNewArticleId = id => {
  const url = `${articleBaseUrl}/external_id/${id}`;
  return fetchWithAccessToken(url).then(resolveJsonOrRejectWithError);
};

export const fetchTags = language => {
  const query = queryString.stringify({ size: 7000, language });
  return fetchWithAccessToken(`${articleBaseUrl}/tags/?${query}`).then(
    resolveJsonOrRejectWithError,
  );
};

export const fetchLicenses = () =>
  fetchWithAccessToken(`${articleBaseUrl}/licenses`).then(
    resolveJsonOrRejectWithError,
  );

export const updateDraft = draft =>
  fetchWithAccessToken(`${draftBaseUrl}/${draft.id}`, {
    method: 'PATCH',
    body: JSON.stringify(draft),
  }).then(resolveJsonOrRejectWithError);

export const createDraft = draft =>
  fetchWithAccessToken(`${draftBaseUrl}/`, {
    method: 'POST',
    body: JSON.stringify(draft),
  }).then(resolveJsonOrRejectWithError);
