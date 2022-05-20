/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMutation, UseMutationOptions } from 'react-query';
import { deleteVersion, postVersion, publishVersion, putVersion } from './versionApi';
import { VersionPostBody, VersionPutBody } from './versionApiTypes';

interface UsePostVersionMutationParams {
  body: VersionPostBody;
  sourceId?: string;
}

export const usePostVersionMutation = (
  options?: UseMutationOptions<string, unknown, UsePostVersionMutationParams>,
) => {
  return useMutation<string, unknown, UsePostVersionMutationParams>(
    ({ body, sourceId }) => postVersion({ body, sourceId }),
    options,
  );
};

interface UsePutVersionMutationParams {
  id: string;
  body: VersionPutBody;
}

export const usePutVersionMutation = (
  options?: UseMutationOptions<void, unknown, UsePutVersionMutationParams>,
) => {
  return useMutation<void, unknown, UsePutVersionMutationParams>(
    ({ id, body }) => putVersion({ id, body }),
    options,
  );
};

interface UseDeleteVersionMutationParams {
  id: string;
}

export const useDeleteVersionMutation = (
  options?: UseMutationOptions<void, unknown, UseDeleteVersionMutationParams>,
) => {
  return useMutation<void, unknown, UseDeleteVersionMutationParams>(
    ({ id }) => deleteVersion({ id }),
    options,
  );
};

interface UsePublishVersionMutation {
  id: string;
}

export const usePublishVersionMutation = (
  options?: UseMutationOptions<void, unknown, UsePublishVersionMutation>,
) => {
  return useMutation<void, unknown, UsePublishVersionMutation>(
    ({ id }) => publishVersion({ id }),
    options,
  );
};
