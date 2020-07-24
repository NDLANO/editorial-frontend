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

const baseUrl = apiResourceUrl('/frontpage-api/v1');

export const fetchFilmFrontpage = () =>
  fetchAuthorized(`${baseUrl}/filmfrontpage/`).then(
    resolveJsonOrRejectWithError,
  );

export const updateFilmFrontpage = filmfrontpage => {
  fetchAuthorized(`${baseUrl}/filmfrontpage/`, {
    method: 'POST',
    body: JSON.stringify(filmfrontpage),
  }).then(resolveJsonOrRejectWithError);
};

export const fetchSubjectpage = (id, language) => {
  const query = queryString.stringify({ language });
  const url = `http://localhost:1339/frontpage-api/v1/subjectpage/${id}`;
  const urlLang = language ? url + `?${query}&fallback=true` : url;
  return fetchAuthorized(urlLang).then(resolveJsonOrRejectWithError);
};

export const updateSubjectpage = (subjectpage, subjectpageId) => {
  return fetchAuthorized(
    `http://localhost:1339/frontpage-api/v1/subjectpage/${subjectpageId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(subjectpage),
    },
  ).then(resolveJsonOrRejectWithError);
};

export const createSubjectpage = subjectpage =>
  fetchAuthorized(`http://localhost:1339/frontpage-api/v1/subjectpage/`, {
    method: 'POST',
    body: JSON.stringify(subjectpage),
  }).then(resolveJsonOrRejectWithError);
