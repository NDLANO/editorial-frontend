/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IArticle as DraftApiType } from '@ndla/types-draft-api';
import {
  IArticleV2 as ArticleApiType,
  ISearchResultV2 as ArticleSearchResult,
} from '@ndla/types-article-api';
import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetchAuthorized,
} from '../../util/apiHelpers';
import config from '../../config';
import { ArticleConverterApiType } from './articleApiInterfaces';
import { LocaleType } from '../../interfaces';

const articleUrl = apiResourceUrl('/article-api/v2/articles');

export const searchArticles = (locale: string, queryString = ''): Promise<ArticleSearchResult> =>
  fetchAuthorized(`${articleUrl}/?language=${locale}&fallback=true${queryString}`).then(r =>
    resolveJsonOrRejectWithError<ArticleSearchResult>(r),
  );

export const searchRelatedArticles = async (
  input: string,
  locale: LocaleType,
  contentType: string,
): Promise<ArticleSearchResult> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  const query = `&type=articles&query=${input}${contentType ? `&content-type=${contentType}` : ''}`;
  return await searchArticles(locale, query);
};

export const getArticle = (id: number, locale: string = 'nb'): Promise<ArticleApiType> =>
  fetchAuthorized(`${articleUrl}/${id}?language=${locale}&fallback=true`).then(r =>
    resolveJsonOrRejectWithError<ArticleApiType>(r),
  );

const articleConverterUrl = config.localConverter
  ? 'http://localhost:3100/article-converter'
  : apiResourceUrl('/article-converter');

export const getArticleFromArticleConverter = (
  id: number,
  locale: string,
): Promise<ArticleConverterApiType> =>
  fetchAuthorized(`${articleConverterUrl}/json/${locale}/${id}`).then(r =>
    resolveJsonOrRejectWithError<ArticleConverterApiType>(r),
  );

export const getPreviewArticle = async (
  article: DraftApiType,
  locale: string,
): Promise<ArticleConverterApiType> => {
  const response = await fetchAuthorized(
    `${articleConverterUrl}/json/${locale}/transform-article?draftConcept=true&previewH5p=true&showVisualElement=true&absoluteUrl=true`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ article }),
    },
  );
  return resolveJsonOrRejectWithError<ArticleConverterApiType>(response);
};
