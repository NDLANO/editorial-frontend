/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ArticleSearchParamsDTO } from "@ndla/types-backend/article-api";
import { UpdatedUserDataDTO } from "@ndla/types-backend/draft-api";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import {
  DRAFT,
  DRAFT_STATUS_STATE_MACHINE,
  LICENSES,
  USER_DATA,
  SEARCH_DRAFTS,
  DRAFT_HISTORY,
  DRAFT_SEARCH_TAGS,
  DRAFT_EDITORS,
  DRAFT_RESPONSIBLES,
} from "../../queryKeys";
import {
  fetchDraft,
  fetchLicenses,
  fetchStatusStateMachine,
  fetchUserData,
  updateUserData,
  fetchSearchTags,
  searchDrafts,
  fetchArticleRevisionHistory,
  fetchDraftEditors,
  fetchDraftResponsibles,
} from "./draftApi";

export interface UseDraft {
  id: number;
  language?: string;
  responsibleId?: string;
}

export interface UseDraftRevisionHistory {
  id: number;
  language?: string;
}

export const draftQueryKeys = {
  draft: (articleId: number) => [DRAFT, articleId] as const,
  draftWithLanguage: (articleId: number, language: string) => [DRAFT, articleId, language] as const,
  articleRevisionHistory: (articleId: number) => [DRAFT_HISTORY, articleId] as const,
  search: (params?: Partial<ArticleSearchParamsDTO>) => [SEARCH_DRAFTS, params] as const,
  licenses: [LICENSES] as const,
  userData: [USER_DATA] as const,
  statusStateMachine: (params?: Partial<StatusStateMachineParams>) => [DRAFT_STATUS_STATE_MACHINE, params] as const,
  draftSearchTags: (params?: Partial<UseSearchTags>) => [DRAFT_SEARCH_TAGS, params] as const,
  draftEditors: [DRAFT_EDITORS] as const,
  draftResponsibles: [DRAFT_RESPONSIBLES] as const,
};

export const draftQueryOptions = ({ id, language }: UseDraft) => {
  return queryOptions({
    queryKey: language ? draftQueryKeys.draftWithLanguage(id, language) : draftQueryKeys.draft(id),
    queryFn: () => fetchDraft(id, language),
  });
};

export const articleRevisionHistoryQueryOptions = ({ id, language }: UseDraftRevisionHistory) => {
  return queryOptions({
    queryKey: draftQueryKeys.articleRevisionHistory(id),
    queryFn: () => fetchArticleRevisionHistory(id, language),
  });
};

export const searchDraftQueryOptions = (params: ArticleSearchParamsDTO) => {
  return queryOptions({
    queryKey: draftQueryKeys.search(params),
    queryFn: () => searchDrafts(params),
  });
};

export const licenseQuery = () => {
  return queryOptions({
    queryKey: draftQueryKeys.licenses,
    queryFn: fetchLicenses,
    staleTime: Infinity,
    placeholderData: [],
  });
};

export const userDataQueryOptions = () => {
  return queryOptions({
    queryKey: draftQueryKeys.userData,
    queryFn: fetchUserData,
  });
};

export const updateUserDataMutationOptions = () => {
  return mutationOptions({
    mutationFn: (data: UpdatedUserDataDTO) => updateUserData(data),
    onMutate: (newUserData, ctx) => {
      const queryOptions = userDataQueryOptions();
      ctx.client.cancelQueries(queryOptions);
      const previousData = ctx.client.getQueryData(queryOptions.queryKey);
      if (previousData) {
        ctx.client.setQueryData(queryOptions.queryKey, {
          ...previousData,
          ...newUserData,
        });
      }
      return { previousData };
    },
    onError: (_, __, res, ctx) => {
      if (res) {
        ctx.client.setQueryData(draftQueryKeys.userData, res.previousData);
      }
    },
    onSettled: (_, __, ___, ____, ctx) => ctx.client.invalidateQueries({ queryKey: draftQueryKeys.userData }),
  });
};

export const draftEditorsQueryOptions = () => {
  return queryOptions({
    queryKey: draftQueryKeys.draftEditors,
    queryFn: fetchDraftEditors,
  });
};

export const draftResponsiblesQueryOptions = () => {
  return queryOptions({
    queryKey: draftQueryKeys.draftResponsibles,
    queryFn: fetchDraftResponsibles,
  });
};

interface StatusStateMachineParams {
  articleId?: number;
}

export const draftStatusStateMachineQueryOptions = (params: StatusStateMachineParams = {}) => {
  return queryOptions({
    queryKey: draftQueryKeys.statusStateMachine(params),
    queryFn: () => fetchStatusStateMachine(params.articleId),
  });
};

export interface UseSearchTags {
  input: string;
  language: string;
}

export const draftSearchTagsQueryOptions = (params: UseSearchTags) => {
  return queryOptions({
    queryKey: draftQueryKeys.draftSearchTags(params),
    queryFn: () => fetchSearchTags(params.input, params.language),
  });
};
