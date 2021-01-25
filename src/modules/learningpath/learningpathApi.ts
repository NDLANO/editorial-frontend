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
import { Learningpath } from '../../interfaces';
import {
  CopyLearningPathBody,
  LearningPathSearchResult,
  SearchBody,
} from './learningpathApiInterfaces';

const baseUrl = apiResourceUrl('/learningpath-api/v2/learningpaths');

export const fetchLearningpath = (
  id: number,
  locale?: string,
  ignore403: boolean = false,
): Promise<Learningpath> => {
  const language = locale ? `?language=${locale}&fallback=true` : '';
  return fetchAuthorized(`${baseUrl}/${id}${language}`).then((res: any) =>
    resolveJsonOrRejectWithError(res, { ignore403 }),
  );
};

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
  }).then(resolveJsonOrRejectWithError);

export const updateLearningPathTaxonomy = (
  id: number,
  createIfMissing: boolean = false,
): Promise<Learningpath> =>
  fetchAuthorized(`${baseUrl}/${id}/update-taxonomy/?create-if-missing=${createIfMissing}`, {
    method: 'POST',
  }).then(resolveJsonOrRejectWithError);

export const learningpathSearch = (query: SearchBody): Promise<LearningPathSearchResult> =>
  fetchAuthorized(`${baseUrl}/search/`, {
    method: 'POST',
    body: JSON.stringify(query),
  }).then(resolveJsonOrRejectWithError);

export const learningpathCopy = (id: string, query: CopyLearningPathBody): Promise<Learningpath> =>
  fetchAuthorized(`${baseUrl}/${id}/copy/`, {
    method: 'POST',
    body: JSON.stringify(query),
  }).then(resolveJsonOrRejectWithError);
