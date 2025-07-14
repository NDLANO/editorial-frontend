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
  ILearningStepV2DTO,
  INewLearningPathV2DTO,
  INewLearningStepV2DTO,
  IUpdatedLearningPathV2DTO,
  IUpdatedLearningStepV2DTO,
} from "@ndla/types-backend/learningpath-api";
import {
  deleteLearningStep,
  patchLearningpath,
  patchLearningStep,
  postLearningpath,
  postLearningStep,
} from "./learningpathApi";

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

interface UsePostLearningStepMutation {
  learningpathId: number;
  step: INewLearningStepV2DTO;
}

export const usePostLearningStepMutation = (
  options?: Partial<UseMutationOptions<ILearningStepV2DTO, unknown, UsePostLearningStepMutation>>,
) => {
  return useMutation<ILearningStepV2DTO, unknown, UsePostLearningStepMutation>({
    mutationFn: (vars) => postLearningStep(vars.learningpathId, vars.step),
    ...options,
  });
};

interface UsePatchLearningStepMutation {
  learningpathId: number;
  stepId: number;
  step: IUpdatedLearningStepV2DTO;
}

export const usePatchLearningStepMutation = (
  options?: Partial<UseMutationOptions<ILearningStepV2DTO, unknown, UsePatchLearningStepMutation>>,
) => {
  return useMutation<ILearningStepV2DTO, unknown, UsePatchLearningStepMutation>({
    mutationFn: (vars) => patchLearningStep(vars.learningpathId, vars.stepId, vars.step),
    ...options,
  });
};

interface UseDeleteLearningStepMutation {
  learningpathId: number;
  stepId: number;
}

export const useDeleteLearningStepMutation = (
  options?: Partial<UseMutationOptions<boolean, unknown, UseDeleteLearningStepMutation>>,
) => {
  return useMutation<boolean, unknown, UseDeleteLearningStepMutation>({
    mutationFn: (vars) => deleteLearningStep(vars.learningpathId, vars.stepId),
    ...options,
  });
};
