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
import config from '../../config';
import { ArticleApiType, ArticleSearchResult } from './articleApiInterfaces';

const articleUrl = apiResourceUrl('/article-api/v2/articles');

export const searchArticles = (
  locale: string,
  queryString = '',
): Promise<ArticleSearchResult> =>
  fetchAuthorized(
    `${articleUrl}/?language=${locale}&fallback=true${queryString}`,
  ).then(resolveJsonOrRejectWithError);

export const searchRelatedArticles = async (
  input: string,
  locale: string,
  contentType: string,
) => {
  await new Promise(resolve => setTimeout(resolve, 50));
  const query = `&type=articles&query=${input}${
    contentType ? `&content-type=${contentType}` : ''
  }`;
  const response = await searchArticles(locale, query);

  return response.results;
};

export const getArticle = (
  id: number,
  locale: string = 'nb',
): Promise<ArticleApiType> =>
  fetchAuthorized(`${articleUrl}/${id}?language=${locale}&fallback=true`).then(
    resolveJsonOrRejectWithError,
  );

const articleConverterUrl = config.localConverter
  ? 'http://localhost:3100/article-converter'
  : apiResourceUrl('/article-converter');

export const getArticleFromArticleConverter = (id: number, locale: string) =>
  fetchAuthorized(`${articleConverterUrl}/json/${locale}/${id}`).then(
    resolveJsonOrRejectWithError,
  );

export const getPreviewArticle = async (article: number, locale: string) => {
  const response = await fetchAuthorized(
    `${articleConverterUrl}/json/${locale}/transform-article?draftConcept=true`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ article }),
    },
  );
  return resolveJsonOrRejectWithError(response);
};
