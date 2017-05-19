/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import { resolveJsonOrRejectWithError, apiResourceUrl, headerWithAccessToken } from '../../util/apiHelpers';

const baseUrl = apiResourceUrl('/article-api/v1/articles');

export const fetchArticle = (id, token) =>
  fetch(`${baseUrl}/${id}`, { headers: headerWithAccessToken(token) }).then(resolveJsonOrRejectWithError);

export const fetchTags = token =>
  fetch(`${baseUrl}/tags/`, { headers: headerWithAccessToken(token) }).then(resolveJsonOrRejectWithError);

export const updateArticle = (article, token) => fetch(`${baseUrl}/${article.id}`, {
  headers: headerWithAccessToken(token),
  method: 'PATCH',
  body: JSON.stringify(article),
}).then(resolveJsonOrRejectWithError);

export const createArticle = (article, token) => fetch(`${baseUrl}/`, {
  headers: headerWithAccessToken(token),
  method: 'POST',
  body: JSON.stringify(article),
}).then(resolveJsonOrRejectWithError);
