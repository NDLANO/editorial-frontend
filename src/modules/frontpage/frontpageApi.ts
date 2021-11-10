/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import * as queryString from 'query-string';
import { LocaleType, SubjectpageApiType } from '../../interfaces';
import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetchAuthorized,
} from '../../util/apiHelpers';
import {
  FilmFrontpageApiType,
  FilmFrontpagePostPatchType,
  NewSubjectFrontPageData,
  UpdatedSubjectFrontPageData,
} from './frontpageApiInterfaces';

const baseUrl = apiResourceUrl('/frontpage-api/v1');

export const fetchFilmFrontpage = () =>
  fetchAuthorized(`${baseUrl}/filmfrontpage/`).then(r =>
    resolveJsonOrRejectWithError<FilmFrontpageApiType>(r),
  );

export const updateFilmFrontpage = (
  filmfrontpage: FilmFrontpagePostPatchType,
): Promise<FilmFrontpageApiType> => {
  return fetchAuthorized(`${baseUrl}/filmfrontpage/`, {
    method: 'POST',
    body: JSON.stringify(filmfrontpage),
  }).then(r => resolveJsonOrRejectWithError<FilmFrontpageApiType>(r));
};

export const fetchSubjectpage = (
  id: number | string,
  language: LocaleType,
): Promise<SubjectpageApiType> => {
  const query = queryString.stringify({ language });
  const url = `${baseUrl}/subjectpage/${id}`;
  const urlLang = language ? url + `?${query}&fallback=true` : url;
  return fetchAuthorized(urlLang).then(r => resolveJsonOrRejectWithError(r));
};

export const updateSubjectpage = (
  subjectpage: UpdatedSubjectFrontPageData,
  subjectpageId: number | string,
  language: LocaleType,
): Promise<SubjectpageApiType> => {
  const query = queryString.stringify({ language });
  return fetchAuthorized(`${baseUrl}/subjectpage/${subjectpageId}?${query}`, {
    method: 'PATCH',
    body: JSON.stringify(subjectpage),
  }).then(r => resolveJsonOrRejectWithError(r));
};

export const createSubjectpage = (
  subjectpage: NewSubjectFrontPageData,
): Promise<SubjectpageApiType> =>
  fetchAuthorized(`${baseUrl}/subjectpage/`, {
    method: 'POST',
    body: JSON.stringify(subjectpage),
  }).then(r => resolveJsonOrRejectWithError(r));
