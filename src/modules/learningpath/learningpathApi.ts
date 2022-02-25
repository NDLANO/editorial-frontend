/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  ILearningPathV2 as LearningpathApiType,
  ISearchResultV2 as LearningPathSearchResult,
} from '@ndla/types-learningpath-api';
import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetchAuthorized,
} from '../../util/apiHelpers';
import { CopyLearningPathBody, SearchBody } from './learningpathApiInterfaces';

const baseUrl = apiResourceUrl('/learningpath-api/v2/learningpaths');

export const fetchLearningpath = (id: number, locale?: string): Promise<LearningpathApiType> => {
  const language = locale ? `?language=${locale}&fallback=true` : '';
  return fetchAuthorized(`${baseUrl}/${id}${language}`).then(res =>
    resolveJsonOrRejectWithError<LearningpathApiType>(res),
  );
};

export const fetchLearningpathsWithArticle = (id: number): Promise<LearningpathApiType[]> =>
  fetchAuthorized(`${baseUrl}/contains-article/${id}`).then(r =>
    resolveJsonOrRejectWithError<LearningpathApiType[]>(r),
  );

export const updateStatusLearningpath = (
  id: number,
  status: string,
  message?: string,
): Promise<LearningpathApiType> =>
  fetchAuthorized(`${baseUrl}/${id}/status/`, {
    method: 'PUT',
    body: JSON.stringify({
      status,
      message,
    }),
  }).then(r => resolveJsonOrRejectWithError<LearningpathApiType>(r));

export const updateLearningPathTaxonomy = (
  id: number,
  createIfMissing: boolean = false,
): Promise<LearningpathApiType> =>
  fetchAuthorized(`${baseUrl}/${id}/update-taxonomy/?create-if-missing=${createIfMissing}`, {
    method: 'POST',
  }).then(r => resolveJsonOrRejectWithError<LearningpathApiType>(r));

export const learningpathSearch = (query: SearchBody): Promise<LearningPathSearchResult> =>
  fetchAuthorized(`${baseUrl}/search/`, {
    method: 'POST',
    body: JSON.stringify(query),
  }).then(r => resolveJsonOrRejectWithError<LearningPathSearchResult>(r));

export const learningpathCopy = (
  id: number,
  query: CopyLearningPathBody,
): Promise<LearningpathApiType> =>
  fetchAuthorized(`${baseUrl}/${id}/copy/`, {
    method: 'POST',
    body: JSON.stringify(query),
  }).then(r => resolveJsonOrRejectWithError<LearningpathApiType>(r));
