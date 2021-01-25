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
const baseUserDataUrl = apiResourceUrl('/draft-api/v1/user-data');

export const fetchTags = language => {
  const query = queryString.stringify({ size: 7000, language });
  return fetchAuthorized(`${baseUrl}/tags/?${query}`).then(resolveJsonOrRejectWithError);
};

export const fetchSearchTags = async (input, language) => {
  const response = await fetchAuthorized(
    `${baseUrl}/tag-search/?language=${language}&query=${input}&fallback=true`,
  );
  return resolveJsonOrRejectWithError(response);
};

export const fetchLicenses = () =>
  fetchAuthorized(`${baseUrl}/licenses/`).then(resolveJsonOrRejectWithError);

export const fetchDraft = (id, language) => {
  const query = queryString.stringify({ language });
  const url = language ? `${baseUrl}/${id}?${query}&fallback=true` : `${baseUrl}/${id}`;
  return fetchAuthorized(url).then(resolveJsonOrRejectWithError);
};

export const cloneDraft = (id, language, addCopyPostfixToArticleTitle = true) => {
  const query = queryString.stringify({
    language,
    'copied-title-postfix': addCopyPostfixToArticleTitle,
    fallback: true,
  });
  const url = `${baseUrl}/clone/${id}?${query}`;

  return fetchAuthorized(url, { method: 'POST' }).then(resolveJsonOrRejectWithError);
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
  fetchAuthorized(`${baseAgreementsUrl}?query=${query}`).then(resolveJsonOrRejectWithError);

export const fetchAgreement = id =>
  fetchAuthorized(`${baseAgreementsUrl}/${id}`).then(resolveJsonOrRejectWithError);

export const fetchGrepCodes = query =>
  fetchAuthorized(`${baseUrl}/grep-codes/?query=${query}`).then(resolveJsonOrRejectWithError);

export const fetchUserData = () =>
  fetchAuthorized(`${baseUserDataUrl}`).then(resolveJsonOrRejectWithError);

export const updateUserData = userData =>
  fetchAuthorized(`${baseUserDataUrl}`, {
    method: 'PATCH',
    body: JSON.stringify(userData),
  }).then(resolveJsonOrRejectWithError);

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
  fetchAuthorized(`${baseUrl}/status-state-machine/`).then(resolveJsonOrRejectWithError);

export const headFileAtRemote = async fileUrl => {
  const res = await fetch(fileUrl, {
    method: 'HEAD',
  });

  return res.status === 200;
};

export const uploadFile = formData =>
  fetchAuthorized(`${baseFileUrl}/`, {
    method: 'POST',
    headers: { 'Content-Type': undefined },
    body: formData,
  }).then(resolveJsonOrRejectWithError);

export const deleteFile = fileUrl => {
  const query = encodeURIComponent(fileUrl);
  fetchAuthorized(`${baseFileUrl}/?path=${query}`, {
    method: 'DELETE',
  }).then(resolveJsonOrRejectWithError);
};

export const searchDrafts = query =>
  fetchAuthorized(`${baseUrl}/search/`, {
    method: 'POST',
    body: JSON.stringify(query),
  }).then(resolveJsonOrRejectWithError);
