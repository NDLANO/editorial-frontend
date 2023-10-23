/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IArticle, IUpdatedArticle } from '@ndla/types-backend/draft-api';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { copyRevisionDates, updateDraft } from './draftApi';

export const useUpdateDraftMutation = (
  options?: Partial<UseMutationOptions<IArticle, unknown, { id: number; body: IUpdatedArticle }>>,
) => {
  return useMutation<IArticle, undefined, { id: number; body: IUpdatedArticle }>({
    mutationFn: (vars) => updateDraft(vars.id, vars.body),
    ...options,
  });
};

export const useCopyRevisionDates = (
  options?: UseMutationOptions<void, unknown, { nodeId: string }>,
) => {
  return useMutation<void, unknown, { nodeId: string }>({
    mutationFn: (vars) => copyRevisionDates(vars.nodeId),
    ...options,
  });
};
