/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { UpdatedArticleDTO } from "@ndla/types-backend/draft-api";
import { mutationOptions } from "@tanstack/react-query";
import { DraftStatusType } from "../../interfaces";
import { deleteCurrentRevision, migrateCodes, updateDraft, updateStatusDraft } from "./draftApi";
import { draftQueryKeys } from "./draftQueries";

export const updateDraftMutationOptions = () => {
  return mutationOptions({
    mutationFn: (vars: { id: number; body: UpdatedArticleDTO }) => updateDraft(vars.id, vars.body),
  });
};

export const updateDraftStatusMutationOptions = () => {
  return mutationOptions({
    mutationFn: (vars: { id: number; status: DraftStatusType }) => updateStatusDraft(vars.id, vars.status),
  });
};

export const migrateCodesMutationOptions = () => {
  return mutationOptions({
    mutationFn: migrateCodes,
  });
};

export const deleteCurrentRevisionMutationOptions = () => {
  return mutationOptions({
    mutationFn: ({ articleId }: { articleId: number }) => deleteCurrentRevision(articleId),
    onSuccess: (_, vars, __, ctx) => {
      ctx.client.invalidateQueries({ queryKey: draftQueryKeys.articleRevisionHistory(vars.articleId) });
      ctx.client.invalidateQueries({ queryKey: draftQueryKeys.draft(vars.articleId) });
    },
  });
};
