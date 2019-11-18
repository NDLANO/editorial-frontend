/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import queryString from 'query-string';
import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetchAuthorized,
} from '../../util/apiHelpers';

const baseUrl = apiResourceUrl('/draft-api/v1/drafts');
const baseAgreementsUrl = apiResourceUrl('/draft-api/v1/agreements');
const baseFileUrl = apiResourceUrl('/draft-api/v1/files');

export const fetchTags = language => {
  const query = queryString.stringify({ size: 7000, language });
  return fetchAuthorized(`${baseUrl}/tags/?${query}`).then(
    resolveJsonOrRejectWithError,
  );
};

export const fetchLicenses = () =>
  fetchAuthorized(`${baseUrl}/licenses/`).then(resolveJsonOrRejectWithError);

export const fetchDraft = (id, language) => {
  const query = queryString.stringify({ language });
  const url = language
    ? `${baseUrl}/${id}?${query}&fallback=true`
    : `${baseUrl}/${id}`;
  return fetchAuthorized(url).then(resolveJsonOrRejectWithError);
};

export const cloneDraft = (id, language) => {
  const query = queryString.stringify({ language });
  const url = language
    ? `${baseUrl}/clone/${id}?${query}&fallback=true`
    : `${baseUrl}/clone/${id}`;
  return fetchAuthorized(url, { method: 'POST' }).then(
    resolveJsonOrRejectWithError,
  );
};

export const updateDraft = draft =>
  fetchAuthorized(`${baseUrl}/${draft.id}`, {
    method: 'PATCH',
    body: JSON.stringify(draft),
  }).then(resolveJsonOrRejectWithError);

export const createDraft = draft =>
  fetchAuthorized(`${baseUrl}/`, {
    method: 'POST',
    body: JSON.stringify(draft),
  }).then(resolveJsonOrRejectWithError);

export const fetchDraftHistory = (id, language) => {
  const query = queryString.stringify({ language });
  const url = language
    ? `${baseUrl}/${id}/history?${query}&fallback=true`
    : `${baseUrl}/${id}/history`;
  return fetchAuthorized(url).then(resolveJsonOrRejectWithError);
};

export const deleteLanguageVersion = (id, language) =>
  fetchAuthorized(`${baseUrl}/${id}/language/${language}`, {
    method: 'DELETE',
  }).then(resolveJsonOrRejectWithError);

export const fetchNewArticleId = id => {
  const url = `${baseUrl}/external_id/${id}`;
  return fetchAuthorized(url).then(resolveJsonOrRejectWithError);
};

export const validateDraft = (id, draft) =>
  fetchAuthorized(`${baseUrl}/${id}/validate/`, {
    method: 'PUT',
    body: JSON.stringify(draft),
  }).then(resolveJsonOrRejectWithError);

export const updateStatusDraft = (id, status) =>
  fetchAuthorized(`${baseUrl}/${id}/status/${status}`, {
    method: 'PUT',
  }).then(resolveJsonOrRejectWithError);

export const fetchAgreements = query =>
  fetchAuthorized(`${baseAgreementsUrl}?query=${query}`).then(
    resolveJsonOrRejectWithError,
  );

export const fetchAgreement = id =>
  fetchAuthorized(`${baseAgreementsUrl}/${id}`).then(
    resolveJsonOrRejectWithError,
  );

export const updateAgreement = agreement =>
  fetchAuthorized(`${baseAgreementsUrl}/${agreement.id}`, {
    method: 'PATCH',
    body: JSON.stringify(agreement),
  }).then(resolveJsonOrRejectWithError);

export const createAgreement = agreement =>
  fetchAuthorized(`${baseAgreementsUrl}/`, {
    method: 'POST',
    body: JSON.stringify(agreement),
  }).then(resolveJsonOrRejectWithError);

export const fetchStatusStateMachine = () =>
  fetchAuthorized(`${baseUrl}/status-state-machine/`).then(
    resolveJsonOrRejectWithError,
  );

export const uploadFile = formData =>
  fetchAuthorized(`${baseFileUrl}/`, {
    method: 'POST',
    headers: { 'Content-Type': undefined },
    body: formData,
  }).then(resolveJsonOrRejectWithError);

export const searchDrafts = query =>
  fetchAuthorized(`${baseUrl}/search/`, {
    method: 'POST',
    body: JSON.stringify(query),
  }).then(resolveJsonOrRejectWithError);
