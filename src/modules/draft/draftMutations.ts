/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ArticleDTO, UpdatedArticleDTO } from "@ndla/types-backend/draft-api";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { DraftStatusType } from "../../interfaces";
import { copyRevisionDates, deleteCurrentRevision, migrateCodes, updateDraft, updateStatusDraft } from "./draftApi";
import { draftQueryKeys } from "./draftQueries";

export const useUpdateDraftMutation = (
  options?: Partial<UseMutationOptions<ArticleDTO, unknown, { id: number; body: UpdatedArticleDTO }>>,
) => {
  return useMutation<ArticleDTO, undefined, { id: number; body: UpdatedArticleDTO }>({
    mutationFn: (vars) => updateDraft(vars.id, vars.body),
    ...options,
  });
};

export const useUpdateDraftStatusMutation = (
  options?: Partial<UseMutationOptions<ArticleDTO, unknown, { id: number; status: DraftStatusType }>>,
) => {
  return useMutation<ArticleDTO, unknown, { id: number; status: DraftStatusType }>({
    mutationFn: (vars) => updateStatusDraft(vars.id, vars.status),
    ...options,
  });
};

export const useCopyRevisionDates = (options?: UseMutationOptions<void, unknown, { nodeId: string }>) => {
  return useMutation<void, unknown, { nodeId: string }>({
    mutationFn: (vars) => copyRevisionDates(vars.nodeId),
    ...options,
  });
};

export const useMigrateCodes = (options?: UseMutationOptions<void>) => {
  return useMutation<void>({
    mutationFn: () => migrateCodes(),
    ...options,
  });
};

export const useDeleteCurrentRevision = () => {
  const queryClient = useQueryClient();
  return useMutation<void, unknown, { articleId: number }>({
    mutationFn: ({ articleId }) => deleteCurrentRevision(articleId),
    onSuccess: (_, { articleId }) => {
      queryClient.invalidateQueries({ queryKey: draftQueryKeys.articleRevisionHistory(articleId) });
      queryClient.invalidateQueries({ queryKey: draftQueryKeys.draft(articleId) });
    },
  });
};
