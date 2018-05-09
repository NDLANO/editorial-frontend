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

export const searchArticles = (queryString, locale, type) =>
  fetchAuthorized(
    `${articleUrl}/${queryString}?language=${locale}&fallback=true${
      type ? `&content-type=${type}` : ''
    }`,
  ).then(resolveJsonOrRejectWithError);

export const searchRelatedArticles = async (input, locale) => {
  await new Promise(resolve => setTimeout(resolve, 50));
  const query = `?type=articles&query=${input}`;
  const response = await searchArticles(query, locale);
  return response.results;
};

export const getArticle = id =>
  fetchAuthorized(`${articleUrl}/${id}`).then(resolveJsonOrRejectWithError);
