/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { CreateTopicNodeConnections, createTopicNodeConnections } from "./taxonomyApi";

interface UseCreateTopicNodeConnections extends CreateTopicNodeConnections {}

// TODO: This can be deleted
export const useCreateTopicNodeConnectionsMutation = (
  options?: Partial<UseMutationOptions<void, unknown, UseCreateTopicNodeConnections>>,
) => {
  return useMutation<void, unknown, UseCreateTopicNodeConnections>({
    mutationFn: ({ articleId, placements, name, taxonomyVersion }) =>
      createTopicNodeConnections({
        articleId,
        placements,
        name,
        taxonomyVersion,
      }),
    ...options,
  });
};
