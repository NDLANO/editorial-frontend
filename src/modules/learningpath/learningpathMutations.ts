/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  LearningPathV2DTO,
  NewCopyLearningPathV2DTO,
  NewLearningPathV2DTO,
  NewLearningStepV2DTO,
  UpdatedLearningPathV2DTO,
  UpdatedLearningStepV2DTO,
} from "@ndla/types-backend/learningpath-api";
import { mutationOptions } from "@tanstack/react-query";
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
import { learningpathQueryKeys, learningpathQueryOptions } from "./learningpathQueries";

export const postLearningpathMutationOptions = () => {
  return mutationOptions({
    mutationFn: (vars: NewLearningPathV2DTO) => postLearningpath(vars),
  });
};

interface UsePatchLearningpathMutation {
  id: number;
  learningpath: UpdatedLearningPathV2DTO;
}

export const patchLearningpathMutationOptions = () => {
  return mutationOptions({
    mutationFn: (vars: UsePatchLearningpathMutation) => patchLearningpath(vars.id, vars.learningpath),
    // TODO: This can be improved. We can (should?) probably write to the cache
    onMutate: (vars, ctx) =>
      ctx.client.cancelQueries({ queryKey: learningpathQueryKeys.learningpath({ id: vars.id }) }),
    onSettled: (_, __, vars, ___, ctx) =>
      ctx.client.invalidateQueries({ queryKey: learningpathQueryKeys.learningpath({ id: vars.id }) }),
  });
};

interface UsePostLearningStepMutation {
  learningpathId: number;
  step: NewLearningStepV2DTO;
}

export const postLearningStepMutationOptions = () => {
  return mutationOptions({
    // TODO: Cache mutation?
    mutationFn: (vars: UsePostLearningStepMutation) => postLearningStep(vars.learningpathId, vars.step),
    onMutate: (vars, ctx) =>
      ctx.client.cancelQueries({ queryKey: learningpathQueryKeys.learningpath({ id: vars.learningpathId }) }),
    onSettled: (_, __, vars, ___, ctx) =>
      ctx.client.invalidateQueries({ queryKey: learningpathQueryKeys.learningpath({ id: vars.learningpathId }) }),
  });
};

interface UsePatchLearningStepMutation {
  learningpathId: number;
  stepId: number;
  step: UpdatedLearningStepV2DTO;
}

export const patchLearningStepMutationOptions = () => {
  return mutationOptions({
    mutationFn: (vars: UsePatchLearningStepMutation) => patchLearningStep(vars.learningpathId, vars.stepId, vars.step),
    onMutate: (vars, ctx) =>
      ctx.client.cancelQueries({ queryKey: learningpathQueryKeys.learningpath({ id: vars.learningpathId }) }),

    onSettled: (_, __, vars, ___, ctx) =>
      ctx.client.invalidateQueries({ queryKey: learningpathQueryKeys.learningpath({ id: vars.learningpathId }) }),
  });
};

interface UseDeleteLearningStepMutation {
  learningpathId: number;
  stepId: number;
}

export const deleteLearningStepMutationOptions = () => {
  return mutationOptions({
    mutationFn: (vars: UseDeleteLearningStepMutation) => deleteLearningStep(vars.learningpathId, vars.stepId),
    onMutate: async (vars, ctx) => {
      const queryOptions = learningpathQueryOptions({ id: vars.learningpathId });
      await ctx.client.cancelQueries({ queryKey: queryOptions.queryKey });
      const previousQueries = ctx.client.getQueriesData<LearningPathV2DTO>({ queryKey: queryOptions.queryKey });
      ctx.client.setQueriesData<LearningPathV2DTO>({ queryKey: queryOptions.queryKey }, (prevData) => {
        if (!prevData) return prevData;
        return { ...prevData, learningsteps: prevData.learningsteps.filter((step) => step.id !== vars.stepId) };
      });
      return { previousQueries };
    },
    onSettled: (_, __, vars, ___, ctx) =>
      ctx.client.invalidateQueries({ queryKey: learningpathQueryKeys.learningpath({ id: vars.learningpathId }) }),
    onError: (_, __, res, ctx) => res?.previousQueries.forEach(([key, data]) => ctx.client.setQueryData(key, data)),
  });
};

interface UsePutLearningStepOrderMutation {
  learningpathId: number;
  stepId: number;
  seqNo: number;
}

export const putLearningStepOrderMutationOptions = () => {
  return mutationOptions({
    mutationFn: (vars: UsePutLearningStepOrderMutation) =>
      putLearningStepOrder(vars.learningpathId, vars.stepId, vars.seqNo),
    onMutate: async (vars, ctx) => {
      const queryOptions = learningpathQueryOptions({ id: vars.learningpathId });
      await ctx.client.cancelQueries({ queryKey: learningpathQueryKeys.learningpath({ id: vars.learningpathId }) });
      const previousQueries = ctx.client.getQueriesData<LearningPathV2DTO>({ queryKey: queryOptions.queryKey });
      ctx.client.setQueriesData<LearningPathV2DTO>({ queryKey: queryOptions.queryKey }, (prevData) => {
        if (!prevData) return prevData;
        const updatedSteps = prevData.learningsteps.slice();
        const fromIndex = updatedSteps.findIndex((step) => step.id === vars.stepId);
        const movedElement = updatedSteps[fromIndex];

        // Remove from old position
        updatedSteps.splice(fromIndex, 1);
        // Add to new position
        updatedSteps.splice(vars.seqNo, 0, movedElement);

        return {
          ...prevData,
          learningsteps: updatedSteps,
        };
      });

      return { previousQueries };
    },
    onError: (_, __, res, ctx) => res?.previousQueries.forEach(([key, data]) => ctx.client.setQueryData(key, data)),
    onSettled: (_, __, vars, ___, ctx) =>
      ctx.client.invalidateQueries({ queryKey: learningpathQueryKeys.learningpath({ id: vars.learningpathId }) }),
  });
};

interface UsePutLearningpathStatusMutation {
  learningpathId: number;
  status: string;
}

export const putLearningpathStatusMutationOptions = () => {
  return mutationOptions({
    mutationFn: (vars: UsePutLearningpathStatusMutation) => putLearningpathStatus(vars.learningpathId, vars.status),
    onMutate: (vars, ctx) =>
      ctx.client.cancelQueries({ queryKey: learningpathQueryKeys.learningpath({ id: vars.learningpathId }) }),
    onSettled: (_, __, vars, ___, ctx) =>
      ctx.client.invalidateQueries({ queryKey: learningpathQueryKeys.learningpath({ id: vars.learningpathId }) }),
  });
};

interface UsePostCopyLearningpathMutation {
  learningpathId: number;
  learningpath: NewCopyLearningPathV2DTO;
}

export const postCopyLearningpathMutationOptions = () => {
  return mutationOptions({
    mutationFn: (vars: UsePostCopyLearningpathMutation) => postCopyLearningpath(vars.learningpathId, vars.learningpath),
  });
};
