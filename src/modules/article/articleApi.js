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
  fetchWithAccessToken,
} from '../../util/apiHelpers';

const baseUrl = apiResourceUrl('/article-api/v2/articles');

export const fetchArticle = id =>
  fetchWithAccessToken(`${baseUrl}/${id}`).then(resolveJsonOrRejectWithError);

export const fetchTags = () =>
  fetchWithAccessToken(`${baseUrl}/tags/?size=7000`).then(
    resolveJsonOrRejectWithError,
  );

export const fetchLicenses = () =>
  fetchWithAccessToken(`${baseUrl}/licenses`).then(
    resolveJsonOrRejectWithError,
  );

export const updateArticle = article =>
  fetchWithAccessToken(`${baseUrl}/${article.id}`, {
    method: 'PATCH',
    body: JSON.stringify(article),
  }).then(resolveJsonOrRejectWithError);

export const createArticle = article =>
  fetchWithAccessToken(`${baseUrl}/`, {
    method: 'POST',
    body: JSON.stringify(article),
  }).then(resolveJsonOrRejectWithError);

const baseTaxonomyUrl = apiResourceUrl('/taxonomy/v1');

export const fetchTopicArticle = (topicId, locale) =>
  fetchWithAccessToken(
    `${baseTaxonomyUrl}/topics/${topicId}/?language=${locale}`,
  ).then(resolveJsonOrRejectWithError);
