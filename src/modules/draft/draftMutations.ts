/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IArticle, IUpdatedArticle } from '@ndla/types-draft-api';
import { useMutation, UseMutationOptions } from 'react-query';
import { updateDraft } from './draftApi';

export const useUpdateDraftMutation = (
  options?: UseMutationOptions<IArticle, unknown, { id: number; body: IUpdatedArticle }>,
) => {
  return useMutation<IArticle, undefined, { id: number; body: IUpdatedArticle }>(
    vars => updateDraft(vars.id, vars.body),
    options,
  );
};
