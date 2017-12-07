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

const draftBaseUrl = apiResourceUrl('/draft-api/v2/drafts');
const articleBaseUrl = apiResourceUrl('/article-api/v2/articles');

export const fetchArticle = (id, language) => {
  const query = queryString.stringify({ language });
  const url = language ? `${draftBaseUrl}/${id}?${query}` : `${draftBaseUrl}/${id}`;
  return fetchWithAccessToken(url).then(resolveJsonOrRejectWithError);
};

export const fetchNewArticleId = id => {
  const url = `${draftBaseUrl}/external_id/${id}`;
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

export const updateArticle = article =>
  fetchWithAccessToken(`${draftBaseUrl}/${article.id}`, {
    method: 'PATCH',
    body: JSON.stringify(article),
  }).then(resolveJsonOrRejectWithError);

export const createArticle = article =>
  fetchWithAccessToken(`${draftBaseUrl}/`, {
    method: 'POST',
    body: JSON.stringify(article),
  }).then(resolveJsonOrRejectWithError);

const baseTaxonomyUrl = apiResourceUrl('/taxonomy/v1');

export const fetchTopicArticle = (topicId, locale) =>
  fetchWithAccessToken(
    `${baseTaxonomyUrl}/topics/${topicId}/?language=${locale}`,
  ).then(resolveJsonOrRejectWithError);
