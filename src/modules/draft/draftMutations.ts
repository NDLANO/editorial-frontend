/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { IArticleDTO, IUpdatedArticleDTO } from "@ndla/types-backend/draft-api";
import { copyRevisionDates, deleteCurrentRevision, migrateCodes, updateDraft } from "./draftApi";
import { draftQueryKeys } from "./draftQueries";

export const useUpdateDraftMutation = (
  options?: Partial<UseMutationOptions<IArticleDTO, unknown, { id: number; body: IUpdatedArticleDTO }>>,
) => {
  return useMutation<IArticleDTO, undefined, { id: number; body: IUpdatedArticleDTO }>({
    mutationFn: (vars) => updateDraft(vars.id, vars.body),
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
