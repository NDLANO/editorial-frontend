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
import { License } from '../../interfaces';
import {
  AgreementApiType,
  AgreementSearchResult,
  DraftApiType,
  DraftSearchQuery,
  DraftSearchResult,
  DraftStatusStateMachineType,
  DraftStatusTypes,
  GrepCodesSearchResult,
  NewAgreementApiType,
  NewDraftApiType,
  TagResult,
  TagSearchResult,
  UpdatedAgreementApiType,
  UpdatedDraftApiType,
  UpdatedUserDataApiType,
  UploadedFileType,
  UserDataApiType,
} from './draftApiInterfaces';
import { resolveVoidOrRejectWithError } from '../../util/resolveJsonOrRejectWithError';

const baseUrl: string = apiResourceUrl('/draft-api/v1/drafts');
const baseAgreementsUrl: string = apiResourceUrl('/draft-api/v1/agreements');
const baseFileUrl: string = apiResourceUrl('/draft-api/v1/files');
const baseUserDataUrl: string = apiResourceUrl('/draft-api/v1/user-data');

export const fetchDraft = async (id: number | string, language?: string): Promise<DraftApiType> => {
  const query = queryString.stringify({ language });
  const url = language ? `${baseUrl}/${id}?${query}&fallback=true` : `${baseUrl}/${id}`;
  return fetchAuthorized(url).then(r => resolveJsonOrRejectWithError<DraftApiType>(r));
};

export const updateDraft = async (draft: UpdatedDraftApiType): Promise<DraftApiType> =>
  fetchAuthorized(`${baseUrl}/${draft.id}`, {
    method: 'PATCH',
    body: JSON.stringify(draft),
  }).then(r => resolveJsonOrRejectWithError<DraftApiType>(r));

export const createDraft = async (draft: NewDraftApiType): Promise<DraftApiType> =>
  fetchAuthorized(`${baseUrl}/`, {
    method: 'POST',
    body: JSON.stringify(draft),
  }).then(r => resolveJsonOrRejectWithError<DraftApiType>(r));

export const searchDrafts = async (query: DraftSearchQuery): Promise<DraftSearchResult> =>
  fetchAuthorized(`${baseUrl}/search/`, {
    method: 'POST',
    body: JSON.stringify(query),
  }).then(r => resolveJsonOrRejectWithError<DraftSearchResult>(r));

export const cloneDraft = async (
  id: number,
  language?: string,
  addCopyPostfixToArticleTitle: boolean = true,
): Promise<DraftApiType> => {
  const query = queryString.stringify({
    language,
    'copied-title-postfix': addCopyPostfixToArticleTitle,
    fallback: true,
  });
  const url = `${baseUrl}/clone/${id}?${query}`;
  return fetchAuthorized(url, { method: 'POST' }).then(r =>
    resolveJsonOrRejectWithError<DraftApiType>(r),
  );
};

export const fetchDraftHistory = async (id: number, language?: string): Promise<DraftApiType[]> => {
  const query = queryString.stringify({ language });
  const url = language
    ? `${baseUrl}/${id}/history?${query}&fallback=true`
    : `${baseUrl}/${id}/history`;
  return fetchAuthorized(url).then(r => resolveJsonOrRejectWithError<DraftApiType[]>(r));
};

export const deleteLanguageVersion = async (id: number, language: string): Promise<DraftApiType> =>
  fetchAuthorized(`${baseUrl}/${id}/language/${language}`, {
    method: 'DELETE',
  }).then(r => resolveJsonOrRejectWithError<DraftApiType>(r));

export const fetchNewArticleId = async (id: number): Promise<{ id: number }> => {
  const url = `${baseUrl}/external_id/${id}`;
  return fetchAuthorized(url).then(r => resolveJsonOrRejectWithError<{ id: number }>(r));
};

export const validateDraft = async (
  id: number,
  draft: UpdatedDraftApiType,
): Promise<{ id: number }> =>
  fetchAuthorized(`${baseUrl}/${id}/validate/`, {
    method: 'PUT',
    body: JSON.stringify(draft),
  }).then(r => resolveJsonOrRejectWithError<{ id: number }>(r));

export const updateStatusDraft = async (
  id: number,
  status: DraftStatusTypes,
): Promise<DraftApiType> =>
  fetchAuthorized(`${baseUrl}/${id}/status/${status}`, {
    method: 'PUT',
  }).then(r => resolveJsonOrRejectWithError<DraftApiType>(r));

export const fetchTags = async (language: string): Promise<TagResult> => {
  const query = queryString.stringify({ size: 7000, language });
  return fetchAuthorized(`${baseUrl}/tags/?${query}`).then(r =>
    resolveJsonOrRejectWithError<TagResult>(r),
  );
};

export const fetchSearchTags = async (input: string, language: string): Promise<TagSearchResult> =>
  fetchAuthorized(
    `${baseUrl}/tag-search/?language=${language}&query=${input}&fallback=true`,
  ).then(r => resolveJsonOrRejectWithError<TagSearchResult>(r));

export const fetchLicenses = async (): Promise<License[]> =>
  fetchAuthorized(`${baseUrl}/licenses/`).then(r => resolveJsonOrRejectWithError<License[]>(r));

export const fetchAgreements = async (query: string): Promise<AgreementSearchResult> =>
  fetchAuthorized(`${baseAgreementsUrl}?query=${query}`).then(r =>
    resolveJsonOrRejectWithError<AgreementSearchResult>(r),
  );

export const fetchAgreement = async (id: number): Promise<AgreementApiType> =>
  fetchAuthorized(`${baseAgreementsUrl}/${id}`).then(r =>
    resolveJsonOrRejectWithError<AgreementApiType>(r),
  );

export const updateAgreement = async (
  agreement: UpdatedAgreementApiType,
): Promise<AgreementApiType> =>
  fetchAuthorized(`${baseAgreementsUrl}/${agreement.id}`, {
    method: 'PATCH',
    body: JSON.stringify(agreement),
  }).then(r => resolveJsonOrRejectWithError<AgreementApiType>(r));

export const createAgreement = async (agreement: NewAgreementApiType): Promise<AgreementApiType> =>
  fetchAuthorized(`${baseAgreementsUrl}/`, {
    method: 'POST',
    body: JSON.stringify(agreement),
  }).then(r => resolveJsonOrRejectWithError<AgreementApiType>(r));

export const fetchGrepCodes = async (query: string): Promise<GrepCodesSearchResult> =>
  fetchAuthorized(`${baseUrl}/grep-codes/?query=${query}`).then(r =>
    resolveJsonOrRejectWithError<{ value: GrepCodesSearchResult }>(r).then(r => r.value),
  );

export const fetchUserData = async (): Promise<UserDataApiType> =>
  fetchAuthorized(`${baseUserDataUrl}`).then(r => resolveJsonOrRejectWithError<UserDataApiType>(r));

export const updateUserData = async (userData: UpdatedUserDataApiType): Promise<UserDataApiType> =>
  fetchAuthorized(`${baseUserDataUrl}`, {
    method: 'PATCH',
    body: JSON.stringify(userData),
  }).then(r => resolveJsonOrRejectWithError<UserDataApiType>(r));

export const fetchStatusStateMachine = async (): Promise<DraftStatusStateMachineType> =>
  fetchAuthorized(`${baseUrl}/status-state-machine/`).then(r =>
    resolveJsonOrRejectWithError<DraftStatusStateMachineType>(r),
  );

export const headFileAtRemote = async (fileUrl: string): Promise<boolean> => {
  const res = await fetch(fileUrl, {
    method: 'HEAD',
  });
  return res.status === 200;
};

export const uploadFile = async (formData: any): Promise<UploadedFileType> =>
  fetchAuthorized(`${baseFileUrl}/`, {
    method: 'POST',
    headers: { 'Content-Type': undefined },
    body: formData,
  }).then(r => resolveJsonOrRejectWithError<UploadedFileType>(r));

export const deleteFile = async (fileUrl: string): Promise<void> => {
  const query = encodeURIComponent(fileUrl);
  fetchAuthorized(`${baseFileUrl}/?path=${query}`, {
    method: 'DELETE',
  }).then(resolveVoidOrRejectWithError);
};
