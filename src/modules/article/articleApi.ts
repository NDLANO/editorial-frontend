/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IArticleV2, ISearchResultV2 } from '@ndla/types-backend/article-api';
import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetchAuthorized,
} from '../../util/apiHelpers';
import { LocaleType } from '../../interfaces';

const articleUrl = apiResourceUrl('/article-api/v2/articles');

export const searchArticles = (locale: string, queryString = ''): Promise<ISearchResultV2> =>
  fetchAuthorized(`${articleUrl}/?language=${locale}&fallback=true${queryString}`).then((r) =>
    resolveJsonOrRejectWithError<ISearchResultV2>(r),
  );

export const searchRelatedArticles = async (
  input: string,
  locale: LocaleType,
  contentType: string,
): Promise<ISearchResultV2> => {
  await new Promise((resolve) => setTimeout(resolve, 50));
  const query = `&type=articles&query=${input}${contentType ? `&content-type=${contentType}` : ''}`;
  return await searchArticles(locale, query);
};

export const getArticle = (id: number, locale: string = 'nb'): Promise<IArticleV2> =>
  fetchAuthorized(`${articleUrl}/${id}?language=${locale}&fallback=true`).then((r) =>
    resolveJsonOrRejectWithError<IArticleV2>(r),
  );
