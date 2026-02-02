/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  LearningPathV2DTO,
  LearningStepV2DTO,
  NewCopyLearningPathV2DTO,
  NewLearningPathV2DTO,
  NewLearningStepV2DTO,
  UpdatedLearningPathV2DTO,
  UpdatedLearningStepV2DTO,
} from "@ndla/types-backend/learningpath-api";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import {
  deleteLearningStep,
  patchLearningpath,
  patchLearningStep,
  postCopyLearningpath,
  postLearningpath,
  postLearningStep,
  putLearningpathStatus,
  putLearningStepOrder,
} from "./learningpathApi";
import { learningpathQueryKeys } from "./learningpathQueries";

export const usePostLearningpathMutation = (
  options?: Partial<UseMutationOptions<LearningPathV2DTO, unknown, NewLearningPathV2DTO>>,
) => {
  return useMutation<LearningPathV2DTO, unknown, NewLearningPathV2DTO>({
    mutationFn: (vars) => postLearningpath(vars),
    ...options,
  });
};

interface UsePatchLearningpathMutation {
  id: number;
  learningpath: UpdatedLearningPathV2DTO;
}

export const usePatchLearningpathMutation = (
  options?: Partial<UseMutationOptions<LearningPathV2DTO, unknown, UsePatchLearningpathMutation>>,
) => {
  const qc = useQueryClient();
  return useMutation<LearningPathV2DTO, unknown, UsePatchLearningpathMutation>({
    mutationFn: (vars) => patchLearningpath(vars.id, vars.learningpath),
    onMutate: (vars) =>
      qc.cancelQueries({
        queryKey: learningpathQueryKeys.learningpath({ id: vars.id, language: vars.learningpath.language }),
      }),
    onSettled: (_, __, vars) =>
      qc.invalidateQueries({
        queryKey: learningpathQueryKeys.learningpath({ id: vars.id, language: vars.learningpath.language }),
      }),
    ...options,
  });
};

interface UsePostLearningStepMutation {
  learningpathId: number;
  step: NewLearningStepV2DTO;
}

export const usePostLearningStepMutation = (
  language: string,
  options?: Partial<UseMutationOptions<LearningStepV2DTO, unknown, UsePostLearningStepMutation>>,
) => {
  const qc = useQueryClient();
  return useMutation<LearningStepV2DTO, unknown, UsePostLearningStepMutation>({
    mutationFn: (vars) => postLearningStep(vars.learningpathId, vars.step),
    onMutate: (vars) =>
      qc.cancelQueries({
        queryKey: learningpathQueryKeys.learningpath({ id: vars.learningpathId, language }),
      }),
    onSettled: (_, __, vars) =>
      qc.invalidateQueries({
        queryKey: learningpathQueryKeys.learningpath({ id: vars.learningpathId, language }),
      }),
    ...options,
  });
};

interface UsePatchLearningStepMutation {
  learningpathId: number;
  stepId: number;
  step: UpdatedLearningStepV2DTO;
}

export const usePatchLearningStepMutation = (
  language: string,
  options?: Partial<UseMutationOptions<LearningStepV2DTO, unknown, UsePatchLearningStepMutation>>,
) => {
  const qc = useQueryClient();
  return useMutation<LearningStepV2DTO, unknown, UsePatchLearningStepMutation>({
    mutationFn: (vars) => patchLearningStep(vars.learningpathId, vars.stepId, vars.step),
    onMutate: (vars) =>
      qc.cancelQueries({ queryKey: learningpathQueryKeys.learningpath({ id: vars.learningpathId, language }) }),
    onSettled: (_, __, vars) =>
      qc.invalidateQueries({ queryKey: learningpathQueryKeys.learningpath({ id: vars.learningpathId, language }) }),
    ...options,
  });
};

interface UseDeleteLearningStepMutation {
  learningpathId: number;
  stepId: number;
}

export const useDeleteLearningStepMutation = (
  language: string,
  options?: Partial<UseMutationOptions<boolean, unknown, UseDeleteLearningStepMutation, LearningPathV2DTO>>,
) => {
  const qc = useQueryClient();
  return useMutation<boolean, unknown, UseDeleteLearningStepMutation, LearningPathV2DTO>({
    mutationFn: (vars) => deleteLearningStep(vars.learningpathId, vars.stepId),
    onMutate: (vars) => {
      qc.cancelQueries({ queryKey: learningpathQueryKeys.learningpath({ id: vars.learningpathId, language }) });
      const previousData = qc.getQueryData<LearningPathV2DTO>(
        learningpathQueryKeys.learningpath({ id: vars.learningpathId, language }),
      )!;
      qc.setQueryData<LearningPathV2DTO>(learningpathQueryKeys.learningpath({ id: vars.learningpathId, language }), {
        ...previousData,
        learningsteps: previousData.learningsteps.filter((step) => step.id !== vars.stepId),
      });
      return previousData;
    },
    onError: (_, vars, context) => {
      qc.setQueryData<LearningPathV2DTO>(
        learningpathQueryKeys.learningpath({ id: vars.learningpathId, language }),
        context,
      );
    },
    onSettled: (_, __, vars) =>
      qc.invalidateQueries({ queryKey: learningpathQueryKeys.learningpath({ id: vars.learningpathId, language }) }),
    ...options,
  });
};

interface UsePutLearningStepOrderMutation {
  learningpathId: number;
  stepId: number;
  seqNo: number;
}

export const usePutLearningStepOrderMutation = (
  language: string,
  options?: Partial<UseMutationOptions<boolean, unknown, UsePutLearningStepOrderMutation, LearningPathV2DTO>>,
) => {
  const qc = useQueryClient();
  return useMutation<boolean, unknown, UsePutLearningStepOrderMutation, LearningPathV2DTO>({
    mutationFn: (vars) => putLearningStepOrder(vars.learningpathId, vars.stepId, vars.seqNo),
    onMutate: (vars) => {
      qc.cancelQueries({ queryKey: learningpathQueryKeys.learningpath({ id: vars.learningpathId, language }) });
      const previousData = qc.getQueryData<LearningPathV2DTO>(
        learningpathQueryKeys.learningpath({ id: vars.learningpathId, language }),
      )!;
      const updatedSteps = [...previousData.learningsteps];
      const fromIndex = updatedSteps.findIndex((step) => step.id === vars.stepId)!;
      const movedElement = updatedSteps[fromIndex];
      // Remove from old position
      updatedSteps.splice(fromIndex, 1);
      // Add to new position
      updatedSteps.splice(vars.seqNo, 0, movedElement);

      qc.setQueryData<LearningPathV2DTO>(learningpathQueryKeys.learningpath({ id: vars.learningpathId, language }), {
        ...previousData,
        learningsteps: updatedSteps,
      });

      return previousData;
    },
    onError: (_, vars, context) => {
      qc.setQueryData<LearningPathV2DTO>(
        learningpathQueryKeys.learningpath({ id: vars.learningpathId, language }),
        context,
      );
    },
    onSettled: (_, __, vars) =>
      qc.invalidateQueries({ queryKey: learningpathQueryKeys.learningpath({ id: vars.learningpathId, language }) }),
    ...options,
  });
};

interface UsePutLearningpathStatusMutation {
  learningpathId: number;
  status: string;
}

export const usePutLearningpathStatusMutation = (
  language: string,
  options?: Partial<UseMutationOptions<boolean, unknown, UsePutLearningpathStatusMutation>>,
) => {
  const qc = useQueryClient();
  return useMutation<boolean, unknown, UsePutLearningpathStatusMutation>({
    mutationFn: (vars) => putLearningpathStatus(vars.learningpathId, vars.status),
    onMutate: (vars) =>
      qc.cancelQueries({ queryKey: learningpathQueryKeys.learningpath({ id: vars.learningpathId, language }) }),
    onSettled: (_, __, vars) =>
      qc.invalidateQueries({ queryKey: learningpathQueryKeys.learningpath({ id: vars.learningpathId, language }) }),
    ...options,
  });
};

interface UsePostCopyLearningpathMutation {
  learningpathId: number;
  learningpath: NewCopyLearningPathV2DTO;
}

export const usePostCopyLearningpathMutation = (
  options?: Partial<UseMutationOptions<LearningPathV2DTO, unknown, UsePostCopyLearningpathMutation>>,
) => {
  return useMutation<LearningPathV2DTO, unknown, UsePostCopyLearningpathMutation>({
    mutationFn: (vars) => postCopyLearningpath(vars.learningpathId, vars.learningpath),
    ...options,
  });
};
