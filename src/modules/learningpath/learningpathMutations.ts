/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import {
  ILearningPathV2DTO,
  ILearningStepV2DTO,
  INewCopyLearningPathV2DTO,
  INewLearningPathV2DTO,
  INewLearningStepV2DTO,
  IUpdatedLearningPathV2DTO,
  IUpdatedLearningStepV2DTO,
} from "@ndla/types-backend/learningpath-api";
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
  const qc = useQueryClient();
  return useMutation<ILearningPathV2DTO, unknown, UsePatchLearningpathMutation>({
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
  step: INewLearningStepV2DTO;
}

export const usePostLearningStepMutation = (
  language: string,
  options?: Partial<UseMutationOptions<ILearningStepV2DTO, unknown, UsePostLearningStepMutation>>,
) => {
  const qc = useQueryClient();
  return useMutation<ILearningStepV2DTO, unknown, UsePostLearningStepMutation>({
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
  step: IUpdatedLearningStepV2DTO;
}

export const usePatchLearningStepMutation = (
  language: string,
  options?: Partial<UseMutationOptions<ILearningStepV2DTO, unknown, UsePatchLearningStepMutation>>,
) => {
  const qc = useQueryClient();
  return useMutation<ILearningStepV2DTO, unknown, UsePatchLearningStepMutation>({
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
  options?: Partial<UseMutationOptions<boolean, unknown, UseDeleteLearningStepMutation, ILearningPathV2DTO>>,
) => {
  const qc = useQueryClient();
  return useMutation<boolean, unknown, UseDeleteLearningStepMutation, ILearningPathV2DTO>({
    mutationFn: (vars) => deleteLearningStep(vars.learningpathId, vars.stepId),
    onMutate: (vars) => {
      qc.cancelQueries({ queryKey: learningpathQueryKeys.learningpath({ id: vars.learningpathId, language }) });
      const previousData = qc.getQueryData<ILearningPathV2DTO>(
        learningpathQueryKeys.learningpath({ id: vars.learningpathId, language }),
      )!;
      qc.setQueryData<ILearningPathV2DTO>(learningpathQueryKeys.learningpath({ id: vars.learningpathId, language }), {
        ...previousData,
        learningsteps: previousData.learningsteps.filter((step) => step.id !== vars.stepId),
      });
      return previousData;
    },
    onError: (_, vars, context) => {
      qc.setQueryData<ILearningPathV2DTO>(
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
  options?: Partial<UseMutationOptions<boolean, unknown, UsePutLearningStepOrderMutation, ILearningPathV2DTO>>,
) => {
  const qc = useQueryClient();
  return useMutation<boolean, unknown, UsePutLearningStepOrderMutation, ILearningPathV2DTO>({
    mutationFn: (vars) => putLearningStepOrder(vars.learningpathId, vars.stepId, vars.seqNo),
    onMutate: (vars) => {
      qc.cancelQueries({ queryKey: learningpathQueryKeys.learningpath({ id: vars.learningpathId, language }) });
      const previousData = qc.getQueryData<ILearningPathV2DTO>(
        learningpathQueryKeys.learningpath({ id: vars.learningpathId, language }),
      )!;
      const updatedSteps = [...previousData.learningsteps];
      const fromIndex = updatedSteps.findIndex((step) => step.id === vars.stepId)!;
      const movedElement = updatedSteps[fromIndex];
      // Remove from old position
      updatedSteps.splice(fromIndex, 1);
      // Add to new position
      updatedSteps.splice(vars.seqNo, 0, movedElement);

      qc.setQueryData<ILearningPathV2DTO>(learningpathQueryKeys.learningpath({ id: vars.learningpathId, language }), {
        ...previousData,
        learningsteps: updatedSteps,
      });

      return previousData;
    },
    onError: (_, vars, context) => {
      qc.setQueryData<ILearningPathV2DTO>(
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
  learningpath: INewCopyLearningPathV2DTO;
}

export const usePostCopyLearningpathMutation = (
  options?: Partial<UseMutationOptions<ILearningPathV2DTO, unknown, UsePostCopyLearningpathMutation>>,
) => {
  return useMutation<ILearningPathV2DTO, unknown, UsePostCopyLearningpathMutation>({
    mutationFn: (vars) => postCopyLearningpath(vars.learningpathId, vars.learningpath),
    ...options,
  });
};
