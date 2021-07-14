/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import * as queryString from 'query-string';
import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetchAuthorized,
} from '../../util/apiHelpers';
import {
  FilmFrontpageApiType,
  SubjectpageApiType,
  SubjectPagePatchApiType,
  SubjectPagePostDto,
} from './frontpageApiInterfaces';

const baseUrl = apiResourceUrl('/frontpage-api/v1');

export const fetchFilmFrontpage = (): Promise<FilmFrontpageApiType> =>
  fetchAuthorized(`${baseUrl}/filmfrontpage/`).then(resolveJsonOrRejectWithError);

export const updateFilmFrontpage = (
  filmfrontpage: FilmFrontpageApiType,
): Promise<FilmFrontpageApiType> => {
  return fetchAuthorized(`${baseUrl}/filmfrontpage/`, {
    method: 'POST',
    body: JSON.stringify(filmfrontpage),
  }).then(resolveJsonOrRejectWithError);
};

export const fetchSubjectpage = (id: string, language: string): Promise<SubjectpageApiType> => {
  const query = queryString.stringify({ language });
  const url = `${baseUrl}/subjectpage/${id}`;
  const urlLang = language ? url + `?${query}&fallback=true` : url;
  return fetchAuthorized(urlLang).then(resolveJsonOrRejectWithError);
};

export const updateSubjectpage = (
  subjectpage: SubjectPagePatchApiType,
  subjectpageId: number,
  language: string,
) => {
  const query = queryString.stringify({ language });
  return fetchAuthorized(`${baseUrl}/subjectpage/${subjectpageId}?${query}`, {
    method: 'PATCH',
    body: JSON.stringify(subjectpage),
  }).then(resolveJsonOrRejectWithError);
};

export const createSubjectpage = (
  subjectpage: SubjectPagePostDto & { id: number; supportedLanguages: string[] },
): Promise<SubjectpageApiType> =>
  fetchAuthorized(`${baseUrl}/subjectpage/`, {
    method: 'POST',
    body: JSON.stringify(subjectpage),
  }).then(resolveJsonOrRejectWithError);
