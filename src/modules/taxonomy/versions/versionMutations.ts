/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMutation, UseMutationOptions } from 'react-query';
import { WithTaxonomyVersion } from '../../../interfaces';
import { deleteVersion, postVersion, publishVersion, putVersion } from './versionApi';
import { VersionPostBody, VersionPutBody } from './versionApiTypes';

interface UsePostVersionMutationParams extends WithTaxonomyVersion {
  body: VersionPostBody;
  sourceId?: string;
}

export const usePostVersionMutation = (
  options?: UseMutationOptions<string, unknown, UsePostVersionMutationParams>,
) => {
  return useMutation<string, unknown, UsePostVersionMutationParams>(
    ({ body, sourceId, taxonomyVersion }) => postVersion({ body, sourceId, taxonomyVersion }),
    options,
  );
};

interface UsePutVersionMutationParams extends WithTaxonomyVersion {
  id: string;
  body: VersionPutBody;
}

export const usePutVersionMutation = (
  options?: UseMutationOptions<void, unknown, UsePutVersionMutationParams>,
) => {
  return useMutation<void, unknown, UsePutVersionMutationParams>(
    ({ id, body, taxonomyVersion }) => putVersion({ id, body, taxonomyVersion }),
    options,
  );
};

interface UseDeleteVersionMutationParams extends WithTaxonomyVersion {
  id: string;
}

export const useDeleteVersionMutation = (
  options?: UseMutationOptions<void, unknown, UseDeleteVersionMutationParams>,
) => {
  return useMutation<void, unknown, UseDeleteVersionMutationParams>(
    ({ id, taxonomyVersion }) => deleteVersion({ id, taxonomyVersion }),
    options,
  );
};

interface UsePublishVersionMutation extends WithTaxonomyVersion {
  id: string;
}

export const usePublishVersionMutation = (
  options?: UseMutationOptions<void, unknown, UsePublishVersionMutation>,
) => {
  return useMutation<void, unknown, UsePublishVersionMutation>(
    ({ id, taxonomyVersion }) => publishVersion({ id, taxonomyVersion }),
    options,
  );
};
