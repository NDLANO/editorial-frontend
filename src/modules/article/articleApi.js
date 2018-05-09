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
  fetchAuthorized,
} from '../../util/apiHelpers';

const articleUrl = apiResourceUrl('/article-api/v2/articles');

export const searchArticles = (queryString, locale) =>
  fetchAuthorized(
    `${articleUrl}/${queryString}&language=${locale}&fallback=true`,
  ).then(resolveJsonOrRejectWithError);

export const searchRelatedArticles = async (input, locale, contentType) => {
  await new Promise(resolve => setTimeout(resolve, 50));
  const query = `?type=articles&query=${input}${
    contentType ? `&content-type=${contentType}` : ''
  }`;
  const response = await searchArticles(query, locale);

  return response.results;
};

export const getArticle = id =>
  fetchAuthorized(`${articleUrl}/${id}`).then(resolveJsonOrRejectWithError);
