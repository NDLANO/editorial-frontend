/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ILearningPathV2, ISearchResultV2 } from '@ndla/types-learningpath-api';
import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetchAuthorized,
} from '../../util/apiHelpers';
import { CopyLearningPathBody, SearchBody } from './learningpathApiInterfaces';

const baseUrl = apiResourceUrl('/learningpath-api/v2/learningpaths');

export const fetchLearningpath = (id: number, locale?: string): Promise<ILearningPathV2> => {
  const language = locale ? `?language=${locale}&fallback=true` : '';
  return fetchAuthorized(`${baseUrl}/${id}${language}`).then(res =>
    resolveJsonOrRejectWithError<ILearningPathV2>(res),
  );
};

export const fetchLearningpathsWithArticle = (id: number): Promise<ILearningPathV2[]> =>
  fetchAuthorized(`${baseUrl}/contains-article/${id}`).then(r =>
    resolveJsonOrRejectWithError<ILearningPathV2[]>(r),
  );

export const updateStatusLearningpath = (
  id: number,
  status: string,
  message?: string,
): Promise<ILearningPathV2> =>
  fetchAuthorized(`${baseUrl}/${id}/status/`, {
    method: 'PUT',
    body: JSON.stringify({
      status,
      message,
    }),
  }).then(r => resolveJsonOrRejectWithError<ILearningPathV2>(r));

export const updateLearningPathTaxonomy = (
  id: number,
  createIfMissing: boolean = false,
): Promise<ILearningPathV2> =>
  fetchAuthorized(`${baseUrl}/${id}/update-taxonomy/?create-if-missing=${createIfMissing}`, {
    method: 'POST',
  }).then(r => resolveJsonOrRejectWithError<ILearningPathV2>(r));

export const learningpathSearch = (query: SearchBody): Promise<ISearchResultV2> =>
  fetchAuthorized(`${baseUrl}/search/`, {
    method: 'POST',
    body: JSON.stringify(query),
  }).then(r => resolveJsonOrRejectWithError<ISearchResultV2>(r));

export const learningpathCopy = (
  id: number,
  query: CopyLearningPathBody,
): Promise<ILearningPathV2> =>
  fetchAuthorized(`${baseUrl}/${id}/copy/`, {
    method: 'POST',
    body: JSON.stringify(query),
  }).then(r => resolveJsonOrRejectWithError<ILearningPathV2>(r));
