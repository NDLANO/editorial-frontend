/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { VersionPostPut } from "@ndla/types-taxonomy";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { deleteVersion, postVersion, publishVersion, putVersion } from "./versionApi";

interface UsePostVersionMutationParams {
  body: VersionPostPut;
  sourceId?: string;
}

export const usePostVersionMutation = (
  options?: Partial<UseMutationOptions<string, unknown, UsePostVersionMutationParams>>,
) => {
  return useMutation<string, unknown, UsePostVersionMutationParams>({
    mutationFn: ({ body, sourceId }) => postVersion({ body, sourceId }),
    ...options,
  });
};

interface UsePutVersionMutationParams {
  id: string;
  body: VersionPostPut;
}

export const usePutVersionMutation = (
  options?: Partial<UseMutationOptions<void, unknown, UsePutVersionMutationParams>>,
) => {
  return useMutation<void, unknown, UsePutVersionMutationParams>({
    mutationFn: ({ id, body }) => putVersion({ id, body }),
    ...options,
  });
};

interface UseDeleteVersionMutationParams {
  id: string;
}

export const useDeleteVersionMutation = (
  options?: Partial<UseMutationOptions<void, unknown, UseDeleteVersionMutationParams>>,
) => {
  return useMutation<void, unknown, UseDeleteVersionMutationParams>({
    mutationFn: ({ id }) => deleteVersion({ id }),
    ...options,
  });
};

interface UsePublishVersionMutation {
  id: string;
}

export const usePublishVersionMutation = (
  options?: Partial<UseMutationOptions<void, unknown, UsePublishVersionMutation>>,
) => {
  return useMutation<void, unknown, UsePublishVersionMutation>({
    mutationFn: ({ id }) => publishVersion({ id }),
    ...options,
  });
};
