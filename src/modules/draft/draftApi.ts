/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ArticleSearchParamsDTO } from "@ndla/types-backend/article-api";
import {
  paths,
  LicenseDTO,
  NewArticleDTO,
  UpdatedArticleDTO,
  ArticleDTO,
  TagsSearchResultDTO,
  UserDataDTO,
  ArticleSearchResultDTO,
  UpdatedUserDataDTO,
  UploadedFileDTO,
  ArticleRevisionHistoryDTO,
} from "@ndla/types-backend/draft-api";
import { DraftStatusType, DraftStatusStateMachineType } from "../../interfaces";
import { createAuthClient } from "../../util/apiHelpers";
import { createFormData } from "../../util/formDataHelper";
import { resolveJsonOATS, resolveOATS } from "../../util/resolveJsonOrRejectWithError";

const client = createAuthClient<paths>();

export const fetchDraft = async (id: number, language?: string): Promise<ArticleDTO> => {
  return client
    .GET("/draft-api/v1/drafts/{article_id}", {
      params: {
        path: { article_id: id },
        query: { language, fallback: true },
      },
    })
    .then((r) => resolveJsonOATS(r));
};

export const fetchBySlug = async (slug: string, language?: string): Promise<ArticleDTO> => {
  return client
    .GET("/draft-api/v1/drafts/slug/{slug}", {
      params: {
        path: { slug },
        query: { language, fallback: true },
      },
    })
    .then((r) => resolveJsonOATS(r));
};

export const fetchDrafts = async (ids: number[], language?: string): Promise<ArticleDTO[]> =>
  client
    .GET("/draft-api/v1/drafts/ids", {
      params: {
        query: {
          ids,
          language,
          fallback: true,
          page: 1,
          "page-size": ids.length,
        },
      },
    })
    .then((r) => resolveJsonOATS(r));

export const updateDraft = async (id: number, draft: UpdatedArticleDTO, versionHash = "default"): Promise<ArticleDTO> =>
  client
    .PATCH("/draft-api/v1/drafts/{article_id}", {
      params: { path: { article_id: id } },
      headers: { VersionHash: versionHash },
      body: draft,
    })
    .then((r) => resolveJsonOATS(r));

export const createDraft = async (draft: NewArticleDTO): Promise<ArticleDTO> =>
  client.POST("/draft-api/v1/drafts", { body: draft }).then((r) => resolveJsonOATS(r));

export const searchDrafts = async (query: ArticleSearchParamsDTO): Promise<ArticleSearchResultDTO> =>
  client.POST("/draft-api/v1/drafts/search", { body: query }).then((r) => resolveJsonOATS(r));

export const cloneDraft = async (
  id: number,
  language?: string,
  addCopyPostfixToArticleTitle: boolean = true,
): Promise<ArticleDTO> =>
  client
    .POST("/draft-api/v1/drafts/clone/{article_id}", {
      params: {
        path: { article_id: id },
        query: {
          language,
          "copied-title-postfix": addCopyPostfixToArticleTitle,
          fallback: true,
        },
      },
    })
    .then((r) => resolveJsonOATS(r));

export const fetchArticleRevisionHistory = async (id: number, language?: string): Promise<ArticleRevisionHistoryDTO> =>
  client
    .GET("/draft-api/v1/drafts/{article_id}/revision-history", {
      params: {
        path: { article_id: id },
        query: { language, fallback: true },
      },
    })
    .then((r) => resolveJsonOATS(r));

export const deleteLanguageVersion = async (id: number, language: string): Promise<ArticleDTO> =>
  client
    .DELETE("/draft-api/v1/drafts/{article_id}/language/{language}", {
      params: { path: { article_id: id, language } },
    })
    .then((r) => resolveJsonOATS(r));

export const fetchNewArticleId = async (id: number): Promise<{ id: number }> => {
  return client
    .GET("/draft-api/v1/drafts/external_id/{deprecated_node_id}", {
      params: { path: { deprecated_node_id: id } },
    })
    .then((r) => resolveJsonOATS(r));
};

export const validateDraft = async (id: number, draft: UpdatedArticleDTO): Promise<{ id: number }> =>
  client
    .PUT("/draft-api/v1/drafts/{article_id}/validate", {
      body: draft,
      params: { path: { article_id: id } },
    })
    .then((r) => resolveJsonOATS(r));

export const updateStatusDraft = async (id: number, status: DraftStatusType): Promise<ArticleDTO> =>
  client
    .PUT("/draft-api/v1/drafts/{article_id}/status/{STATUS}", {
      params: { path: { article_id: id, STATUS: status } },
    })
    .then((r) => resolveJsonOATS(r));

export const fetchSearchTags = async (input: string, language: string): Promise<TagsSearchResultDTO> =>
  client
    .GET("/draft-api/v1/drafts/tag-search", {
      params: {
        query: {
          language,
          query: input,
          fallback: true,
        },
      },
    })
    .then((r) => resolveJsonOATS(r));

export const fetchLicenses = async (): Promise<LicenseDTO[]> =>
  client.GET("/draft-api/v1/drafts/licenses").then((r) => resolveJsonOATS(r));

export const fetchUserData = async (): Promise<UserDataDTO> =>
  client.GET("/draft-api/v1/user-data").then((r) => resolveJsonOATS(r));

export const updateUserData = async (userData: UpdatedUserDataDTO): Promise<UserDataDTO> =>
  client.PATCH("/draft-api/v1/user-data", { body: userData }).then((r) => resolveJsonOATS(r));

export const fetchStatusStateMachine = async (id?: number): Promise<DraftStatusStateMachineType> =>
  client
    .GET("/draft-api/v1/drafts/status-state-machine", {
      params: { query: { articleId: id } },
    })
    .then((r) => resolveJsonOATS(r));

export const copyRevisionDates = (nodeId: string): Promise<void> =>
  client
    .POST("/draft-api/v1/drafts/copyRevisionDates/{node_id}", {
      params: { path: { node_id: nodeId } },
    })
    .then((r) => resolveJsonOATS(r));

export const headFileAtRemote = async (fileUrl: string): Promise<boolean> => {
  const res = await fetch(fileUrl, {
    method: "HEAD",
  });
  return res.status === 200;
};

export const uploadFile = async (file: Blob): Promise<UploadedFileDTO> =>
  client
    .POST("/draft-api/v1/files", {
      body: { file },
      bodySerializer(body) {
        return createFormData(body.file, undefined);
      },
    })
    .then((r) => resolveJsonOATS(r));

export const migrateCodes = async (): Promise<void> => {
  return client.POST("/draft-api/v1/drafts/migrate-greps").then((r) => resolveOATS(r));
};

export const deleteCurrentRevision = async (articleId: number): Promise<void> =>
  client
    .DELETE("/draft-api/v1/drafts/{article_id}/current-revision", { params: { path: { article_id: articleId } } })
    .then((r) => resolveOATS(r));
