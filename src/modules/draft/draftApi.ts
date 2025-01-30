/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from "query-string";
import { IArticleSearchParamsDTO } from "@ndla/types-backend/article-api";
import {
  ILicenseDTO,
  INewArticleDTO,
  IUpdatedArticleDTO,
  IArticleDTO,
  ITagsSearchResultDTO,
  IArticleTagDTO,
  IUserDataDTO,
  ISearchResultDTO,
  IUpdatedUserDataDTO,
  IUploadedFileDTO,
} from "@ndla/types-backend/draft-api";
import { DraftStatusType, DraftStatusStateMachineType } from "../../interfaces";
import { resolveJsonOrRejectWithError, apiResourceUrl, fetchAuthorized } from "../../util/apiHelpers";
import { resolveVoidOrRejectWithError } from "../../util/resolveJsonOrRejectWithError";

const baseUrl: string = apiResourceUrl("/draft-api/v1/drafts");
const baseFileUrl: string = apiResourceUrl("/draft-api/v1/files");
const baseUserDataUrl: string = apiResourceUrl("/draft-api/v1/user-data");

export const fetchDraft = async (id: number | string, language?: string): Promise<IArticleDTO> => {
  const query = queryString.stringify({ language });
  const url = language ? `${baseUrl}/${id}?${query}&fallback=true` : `${baseUrl}/${id}`;
  return fetchAuthorized(url).then((r) => resolveJsonOrRejectWithError<IArticleDTO>(r));
};

export const fetchBySlug = async (slug: string, language?: string): Promise<IArticleDTO> => {
  const query = queryString.stringify({ language });
  const url = language ? `${baseUrl}/slug/${slug}?${query}&fallback=true` : `${baseUrl}/slug/${slug}`;
  return fetchAuthorized(url).then((r) => resolveJsonOrRejectWithError<IArticleDTO>(r));
};

export const fetchDrafts = async (ids: number[], language?: string): Promise<IArticleDTO[]> => {
  const query = queryString.stringify({
    ids: ids.join(","),
    language,
    fallback: true,
    page: 1,
    "page-size": ids.length,
  });
  return fetchAuthorized(`${baseUrl}/ids/?${query}`, {
    method: "GET",
  }).then((r) => resolveJsonOrRejectWithError<[IArticleDTO]>(r));
};

export const updateDraft = async (
  id: number,
  draft: IUpdatedArticleDTO,
  versionHash = "default",
): Promise<IArticleDTO> =>
  fetchAuthorized(`${baseUrl}/${id}`, {
    method: "PATCH",
    headers: { VersionHash: versionHash },
    body: JSON.stringify(draft),
  }).then((r) => resolveJsonOrRejectWithError<IArticleDTO>(r));

export const createDraft = async (draft: INewArticleDTO): Promise<IArticleDTO> =>
  fetchAuthorized(`${baseUrl}/`, {
    method: "POST",
    body: JSON.stringify(draft),
  }).then((r) => resolveJsonOrRejectWithError<IArticleDTO>(r));

export const searchDrafts = async (query: IArticleSearchParamsDTO): Promise<ISearchResultDTO> =>
  fetchAuthorized(`${baseUrl}/search/`, {
    method: "POST",
    body: JSON.stringify(query),
  }).then((r) => resolveJsonOrRejectWithError<ISearchResultDTO>(r));

export const cloneDraft = async (
  id: number,
  language?: string,
  addCopyPostfixToArticleTitle: boolean = true,
): Promise<IArticleDTO> => {
  const query = queryString.stringify({
    language,
    "copied-title-postfix": addCopyPostfixToArticleTitle,
    fallback: true,
  });
  const url = `${baseUrl}/clone/${id}?${query}`;
  return fetchAuthorized(url, { method: "POST" }).then((r) => resolveJsonOrRejectWithError<IArticleDTO>(r));
};

export const fetchDraftHistory = async (id: number, language?: string): Promise<IArticleDTO[]> => {
  const query = queryString.stringify({ language });
  const url = language ? `${baseUrl}/${id}/history?${query}&fallback=true` : `${baseUrl}/${id}/history`;
  return fetchAuthorized(url).then((r) => resolveJsonOrRejectWithError<IArticleDTO[]>(r));
};

export const deleteLanguageVersion = async (id: number, language: string): Promise<IArticleDTO> =>
  fetchAuthorized(`${baseUrl}/${id}/language/${language}`, {
    method: "DELETE",
  }).then((r) => resolveJsonOrRejectWithError<IArticleDTO>(r));

export const fetchNewArticleId = async (id: number): Promise<{ id: number }> => {
  const url = `${baseUrl}/external_id/${id}`;
  return fetchAuthorized(url).then((r) => resolveJsonOrRejectWithError<{ id: number }>(r));
};

export const validateDraft = async (id: number, draft: IUpdatedArticleDTO): Promise<{ id: number }> =>
  fetchAuthorized(`${baseUrl}/${id}/validate/`, {
    method: "PUT",
    body: JSON.stringify(draft),
  }).then((r) => resolveJsonOrRejectWithError<{ id: number }>(r));

export const updateStatusDraft = async (id: number, status: DraftStatusType): Promise<IArticleDTO> =>
  fetchAuthorized(`${baseUrl}/${id}/status/${status}`, {
    method: "PUT",
  }).then((r) => resolveJsonOrRejectWithError<IArticleDTO>(r));

export const fetchTags = async (language: string): Promise<IArticleTagDTO> => {
  const query = queryString.stringify({ size: 7000, language });
  return fetchAuthorized(`${baseUrl}/tags/?${query}`).then((r) => resolveJsonOrRejectWithError<IArticleTagDTO>(r));
};

export const fetchSearchTags = async (input: string, language: string): Promise<ITagsSearchResultDTO> =>
  fetchAuthorized(`${baseUrl}/tag-search/?language=${language}&query=${input}&fallback=true`).then((r) =>
    resolveJsonOrRejectWithError<ITagsSearchResultDTO>(r),
  );

export const fetchLicenses = async (): Promise<ILicenseDTO[]> =>
  fetchAuthorized(`${baseUrl}/licenses/`).then((r) => resolveJsonOrRejectWithError<ILicenseDTO[]>(r));

export const fetchUserData = async (): Promise<IUserDataDTO> =>
  fetchAuthorized(`${baseUserDataUrl}`).then((r) => resolveJsonOrRejectWithError<IUserDataDTO>(r));

export const updateUserData = async (userData: IUpdatedUserDataDTO): Promise<IUserDataDTO> =>
  fetchAuthorized(`${baseUserDataUrl}`, {
    method: "PATCH",
    body: JSON.stringify(userData),
  }).then((r) => resolveJsonOrRejectWithError<IUserDataDTO>(r));

export const fetchStatusStateMachine = async (id?: number): Promise<DraftStatusStateMachineType> => {
  const idParam = id ? `?articleId=${id}` : "";
  return fetchAuthorized(`${baseUrl}/status-state-machine/${idParam}`).then((r) =>
    resolveJsonOrRejectWithError<DraftStatusStateMachineType>(r),
  );
};

export const copyRevisionDates = (nodeId: string): Promise<void> => {
  return fetchAuthorized(`${baseUrl}/copyRevisionDates/${nodeId}`, {
    method: "POST",
  }).then((r) => resolveVoidOrRejectWithError(r));
};

export const headFileAtRemote = async (fileUrl: string): Promise<boolean> => {
  const res = await fetch(fileUrl, {
    method: "HEAD",
  });
  return res.status === 200;
};

export const uploadFile = async (formData: any): Promise<IUploadedFileDTO> =>
  fetchAuthorized(`${baseFileUrl}/`, {
    method: "POST",
    headers: { "Content-Type": undefined },
    body: formData,
  }).then((r) => resolveJsonOrRejectWithError<IUploadedFileDTO>(r));

export const deleteFile = async (fileUrl: string): Promise<void> => {
  const query = encodeURIComponent(fileUrl);
  fetchAuthorized(`${baseFileUrl}/?path=${query}`, {
    method: "DELETE",
  }).then(resolveVoidOrRejectWithError);
};
