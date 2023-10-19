/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { WithTaxonomyVersion } from '../../interfaces';
import {
  CreateTopicNodeConnections,
  UpdateTaxParams,
  createTopicNodeConnections,
  updateTax,
} from './taxonomyApi';

interface UseUpdateTaxMutation extends WithTaxonomyVersion, UpdateTaxParams {}

export const useUpdateTaxonomyMutation = (
  options?: Partial<UseMutationOptions<void, unknown, UseUpdateTaxMutation>>,
) => {
  return useMutation<void, unknown, UseUpdateTaxMutation>({
    mutationFn: ({ node, originalNode, taxonomyVersion }) =>
      updateTax({ node, originalNode }, taxonomyVersion),
    ...options,
  });
};

interface UseCreateTopicNodeConnections extends CreateTopicNodeConnections {}

export const useCreateTopicNodeConnectionsMutation = (
  options?: Partial<UseMutationOptions<void, unknown, UseCreateTopicNodeConnections>>,
) => {
  return useMutation<void, unknown, UseCreateTopicNodeConnections>({
    mutationFn: ({ articleId, placements, name, taxonomyVersion }) =>
      createTopicNodeConnections({ articleId, placements, name, taxonomyVersion }),
    ...options,
  });
};
