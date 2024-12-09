/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from "query-string";
import { IArticleSearchParams } from "@ndla/types-backend/article-api";
import {
  ILicense,
  INewArticle,
  IUpdatedArticle,
  IArticle,
  ITagsSearchResult,
  IArticleTag,
  IUserData,
  ISearchResult,
  IUpdatedUserData,
  IUploadedFile,
} from "@ndla/types-backend/draft-api";
import { DraftStatusType, DraftStatusStateMachineType } from "../../interfaces";
import { resolveJsonOrRejectWithError, apiResourceUrl, fetchAuthorized } from "../../util/apiHelpers";
import { resolveVoidOrRejectWithError } from "../../util/resolveJsonOrRejectWithError";

const baseUrl: string = apiResourceUrl("/draft-api/v1/drafts");
const baseFileUrl: string = apiResourceUrl("/draft-api/v1/files");
const baseUserDataUrl: string = apiResourceUrl("/draft-api/v1/user-data");

export const fetchDraft = async (id: number | string, language?: string): Promise<IArticle> => {
  const query = queryString.stringify({ language });
  const url = language ? `${baseUrl}/${id}?${query}&fallback=true` : `${baseUrl}/${id}`;
  return fetchAuthorized(url).then((r) => resolveJsonOrRejectWithError<IArticle>(r));
};

export const fetchBySlug = async (slug: string, language?: string): Promise<IArticle> => {
  const query = queryString.stringify({ language });
  const url = language ? `${baseUrl}/slug/${slug}?${query}&fallback=true` : `${baseUrl}/slug/${slug}`;
  return fetchAuthorized(url).then((r) => resolveJsonOrRejectWithError<IArticle>(r));
};

export const fetchDrafts = async (ids: number[], language?: string): Promise<IArticle[]> => {
  const query = queryString.stringify({
    ids: ids.join(","),
    language,
    fallback: true,
    page: 1,
    "page-size": ids.length,
  });
  return fetchAuthorized(`${baseUrl}/ids/?${query}`, {
    method: "GET",
  }).then((r) => resolveJsonOrRejectWithError<[IArticle]>(r));
};

export const updateDraft = async (id: number, draft: IUpdatedArticle, versionHash = "default"): Promise<IArticle> =>
  fetchAuthorized(`${baseUrl}/${id}`, {
    method: "PATCH",
    headers: { VersionHash: versionHash },
    body: JSON.stringify(draft),
  }).then((r) => resolveJsonOrRejectWithError<IArticle>(r));

export const createDraft = async (draft: INewArticle): Promise<IArticle> =>
  fetchAuthorized(`${baseUrl}/`, {
    method: "POST",
    body: JSON.stringify(draft),
  }).then((r) => resolveJsonOrRejectWithError<IArticle>(r));

export const searchDrafts = async (query: IArticleSearchParams): Promise<ISearchResult> =>
  fetchAuthorized(`${baseUrl}/search/`, {
    method: "POST",
    body: JSON.stringify(query),
  }).then((r) => resolveJsonOrRejectWithError<ISearchResult>(r));

export const cloneDraft = async (
  id: number,
  language?: string,
  addCopyPostfixToArticleTitle: boolean = true,
): Promise<IArticle> => {
  const query = queryString.stringify({
    language,
    "copied-title-postfix": addCopyPostfixToArticleTitle,
    fallback: true,
  });
  const url = `${baseUrl}/clone/${id}?${query}`;
  return fetchAuthorized(url, { method: "POST" }).then((r) => resolveJsonOrRejectWithError<IArticle>(r));
};

export const fetchDraftHistory = async (id: number, language?: string): Promise<IArticle[]> => {
  const query = queryString.stringify({ language });
  const url = language ? `${baseUrl}/${id}/history?${query}&fallback=true` : `${baseUrl}/${id}/history`;
  return fetchAuthorized(url).then((r) => resolveJsonOrRejectWithError<IArticle[]>(r));
};

export const deleteLanguageVersion = async (id: number, language: string): Promise<IArticle> =>
  fetchAuthorized(`${baseUrl}/${id}/language/${language}`, {
    method: "DELETE",
  }).then((r) => resolveJsonOrRejectWithError<IArticle>(r));

export const fetchNewArticleId = async (id: number): Promise<{ id: number }> => {
  const url = `${baseUrl}/external_id/${id}`;
  return fetchAuthorized(url).then((r) => resolveJsonOrRejectWithError<{ id: number }>(r));
};

export const validateDraft = async (id: number, draft: IUpdatedArticle): Promise<{ id: number }> =>
  fetchAuthorized(`${baseUrl}/${id}/validate/`, {
    method: "PUT",
    body: JSON.stringify(draft),
  }).then((r) => resolveJsonOrRejectWithError<{ id: number }>(r));

export const updateStatusDraft = async (id: number, status: DraftStatusType): Promise<IArticle> =>
  fetchAuthorized(`${baseUrl}/${id}/status/${status}`, {
    method: "PUT",
  }).then((r) => resolveJsonOrRejectWithError<IArticle>(r));

export const fetchTags = async (language: string): Promise<IArticleTag> => {
  const query = queryString.stringify({ size: 7000, language });
  return fetchAuthorized(`${baseUrl}/tags/?${query}`).then((r) => resolveJsonOrRejectWithError<IArticleTag>(r));
};

export const fetchSearchTags = async (input: string, language: string): Promise<ITagsSearchResult> =>
  fetchAuthorized(`${baseUrl}/tag-search/?language=${language}&query=${input}&fallback=true`).then((r) =>
    resolveJsonOrRejectWithError<ITagsSearchResult>(r),
  );

export const fetchLicenses = async (): Promise<ILicense[]> =>
  fetchAuthorized(`${baseUrl}/licenses/`).then((r) => resolveJsonOrRejectWithError<ILicense[]>(r));

export const fetchUserData = async (): Promise<IUserData> =>
  fetchAuthorized(`${baseUserDataUrl}`).then((r) => resolveJsonOrRejectWithError<IUserData>(r));

export const updateUserData = async (userData: IUpdatedUserData): Promise<IUserData> =>
  fetchAuthorized(`${baseUserDataUrl}`, {
    method: "PATCH",
    body: JSON.stringify(userData),
  }).then((r) => resolveJsonOrRejectWithError<IUserData>(r));

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

export const uploadFile = async (formData: any): Promise<IUploadedFile> =>
  fetchAuthorized(`${baseFileUrl}/`, {
    method: "POST",
    headers: { "Content-Type": undefined },
    body: formData,
  }).then((r) => resolveJsonOrRejectWithError<IUploadedFile>(r));

export const deleteFile = async (fileUrl: string): Promise<void> => {
  const query = encodeURIComponent(fileUrl);
  fetchAuthorized(`${baseFileUrl}/?path=${query}`, {
    method: "DELETE",
  }).then(resolveVoidOrRejectWithError);
};
