/**
 * Copyright (c) 2019-present, NDLA.
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
import {
  CopyLearningPathBody,
  Learningpath,
  LearningPathSearchResult,
  SearchBody,
} from './learningpathApiInterfaces';

const baseUrl = apiResourceUrl('/learningpath-api/v2/learningpaths');

export const fetchLearningpath = (id: number, locale?: string): Promise<Learningpath> => {
  const language = locale ? `?language=${locale}&fallback=true` : '';
  return fetchAuthorized(`${baseUrl}/${id}${language}`).then(res =>
    resolveJsonOrRejectWithError<Learningpath>(res),
  );
};

export const fetchLearningpathsWithArticle = (id: number): Promise<Learningpath[]> =>
  fetchAuthorized(`${baseUrl}/contains-article/${id}`).then(r =>
    resolveJsonOrRejectWithError<Learningpath[]>(r),
  );

export const updateStatusLearningpath = (
  id: number,
  status: string,
  message?: string,
): Promise<Learningpath> =>
  fetchAuthorized(`${baseUrl}/${id}/status/`, {
    method: 'PUT',
    body: JSON.stringify({
      status,
      message,
    }),
  }).then(r => resolveJsonOrRejectWithError<Learningpath>(r));

export const updateLearningPathTaxonomy = (
  id: number,
  createIfMissing: boolean = false,
): Promise<Learningpath> =>
  fetchAuthorized(`${baseUrl}/${id}/update-taxonomy/?create-if-missing=${createIfMissing}`, {
    method: 'POST',
  }).then(r => resolveJsonOrRejectWithError<Learningpath>(r));

export const learningpathSearch = (query: SearchBody): Promise<LearningPathSearchResult> =>
  fetchAuthorized(`${baseUrl}/search/`, {
    method: 'POST',
    body: JSON.stringify(query),
  }).then(r => resolveJsonOrRejectWithError<LearningPathSearchResult>(r));

export const learningpathCopy = (id: number, query: CopyLearningPathBody): Promise<Learningpath> =>
  fetchAuthorized(`${baseUrl}/${id}/copy/`, {
    method: 'POST',
    body: JSON.stringify(query),
  }).then(r => resolveJsonOrRejectWithError<Learningpath>(r));
