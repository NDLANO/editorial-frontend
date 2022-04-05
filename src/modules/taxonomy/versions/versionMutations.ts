/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMutation, UseMutationOptions } from 'react-query';
import { deleteVersion, postVersion, publishVersion, putVersion } from './versionApi';
import type { VersionPostBody, VersionPutBody } from './versionApiTypes';

export const usePostVersionMutation = (
  options?: UseMutationOptions<string, unknown, { body: VersionPostBody; sourceId?: string}>,
) => {
  return useMutation<string, unknown, { body: VersionPostBody; sourceId?: string}>(
    data => postVersion(data.body, data.sourceId),
    options,
  );
};

export const usePutVersionMutation = (
  options?: UseMutationOptions<void, unknown, { id: string; body: VersionPutBody }>,
) => {
  return useMutation<void, unknown, { id: string; body: VersionPutBody }>(
    data => putVersion(data.id, data.body),
    options,
  );
};

export const useDeleteVersionMutation = (
  options?: UseMutationOptions<void, unknown, { id: string }>,
) => {
  return useMutation<void, unknown, { id: string }>(data => deleteVersion(data.id), options);
};

export const usePublishVersionMutation = (
    options?: UseMutationOptions<void, unknown, {id: string}>,
) => {
    return useMutation<void, unknown, {id: string}>(data => publishVersion(data.id), options);
}