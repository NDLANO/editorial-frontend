/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  ILearningPathV2DTO,
  INewLearningPathV2DTO,
  IUpdatedLearningPathV2DTO,
} from "@ndla/types-backend/learningpath-api";
import { patchLearningpath, postLearningpath } from "./learningpathApi";

export const usePostLearningpathMutation = (
  options?: Partial<UseMutationOptions<ILearningPathV2DTO, unknown, INewLearningPathV2DTO>>,
) => {
  return useMutation<ILearningPathV2DTO, unknown, INewLearningPathV2DTO>({
    mutationFn: (vars) => postLearningpath(vars),
    ...options,
  });
};

interface UsePatchLearningpathMutation {
  id: number;
  learningpath: IUpdatedLearningPathV2DTO;
}

export const usePatchLearningpathMutation = (
  options?: Partial<UseMutationOptions<ILearningPathV2DTO, unknown, UsePatchLearningpathMutation>>,
) => {
  return useMutation<ILearningPathV2DTO, unknown, UsePatchLearningpathMutation>({
    mutationFn: (vars) => patchLearningpath(vars.id, vars.learningpath),
    ...options,
  });
};
