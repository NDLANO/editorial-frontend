/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Node, NodePostPut } from "@ndla/types-backend/taxonomy-api";
import { mutationOptions } from "@tanstack/react-query";
import { createResourceResourceType, deleteResourceResourceType } from "../taxonomy/resourcetypes";
import {
  deleteNode,
  deleteNodeConnection,
  postNode,
  postNodeConnection,
  putNode,
  putNodeConnection,
  putNodeMetadata,
  putResourcesPrimary,
} from "./nodeApi";
import { nodeQueryKeys } from "./nodeQueries";

export const postNodeMutationOptions = () => {
  return mutationOptions({ mutationFn: postNode });
};

export const getOptimisticNode = (newNode: NodePostPut): Node => ({
  baseName: newNode.name ?? "",
  name: newNode.name ?? "",
  contentUri: newNode.contentUri ?? "",
  id: newNode.nodeId ?? "",
  nodeType: newNode.nodeType ?? "NODE",
  path: "",
  paths: [],
  translations: newNode.translations ?? [],
  supportedLanguages: [],
  resourceTypes: [],
  contexts: [],
  contextids: [],
  metadata: { visible: true, grepCodes: [], customFields: {} },
  breadcrumbs: [],
  language: "",
  updatedAt: "",
  qualityEvaluation: newNode.qualityEvaluation ? newNode.qualityEvaluation : undefined,
});

interface UseUpdateNodeMetadataMutationOptions {
  rootId?: string;
}

export const updateNodeMetadataMutationOptions = ({ rootId }: UseUpdateNodeMetadataMutationOptions = {}) => {
  return mutationOptions({
    mutationFn: putNodeMetadata,
    onMutate: async (vars, ctx) => {
      const queryKey = rootId ? nodeQueryKeys.childNodes({ id: rootId }) : nodeQueryKeys.nodes();
      await ctx.client.cancelQueries({ queryKey });
      const previousQueries = ctx.client.getQueriesData<Node[]>({ queryKey });
      ctx.client.setQueriesData<Node[]>({ queryKey }, (old) => {
        if (!old) return old;
        return old.map((n) => {
          if (n.id === vars.id) {
            const metadata = { ...n.metadata };
            if (vars.meta.grepCodes) {
              metadata.grepCodes = vars.meta.grepCodes;
            }
            if (typeof vars.meta.visible === "boolean") {
              metadata.visible = vars.meta.visible;
            }
            if (vars.meta.customFields) {
              metadata.customFields = vars.meta.customFields;
            }
            return { ...n, metadata };
          }
          return n;
        });
      });
      return { previousQueries, queryKey };
    },
    onSuccess: (_, __, res, ctx) => ctx.client.invalidateQueries({ queryKey: res.queryKey }),
    onError: (_, __, res, ctx) => res?.previousQueries.forEach(([key, data]) => ctx.client.setQueryData(key, data)),
  });
};

export const deleteNodeMutationOptions = () => {
  return mutationOptions({ mutationFn: deleteNode });
};

export const deleteNodeConnectionMutationOptions = () => {
  return mutationOptions({ mutationFn: deleteNodeConnection });
};

export const updateNodeConnectionMutationOptions = () => {
  return mutationOptions({ mutationFn: putNodeConnection });
};

export const postNodeConnectionMutationOptions = () => {
  return mutationOptions({ mutationFn: postNodeConnection });
};

export const createResourceResourceTypeMutationOptions = () => {
  return mutationOptions({ mutationFn: createResourceResourceType });
};

export const deleteResourceResourceTypeMutationOptions = () => {
  return mutationOptions({ mutationFn: deleteResourceResourceType });
};

export const putNodeMutationOptions = () => {
  return mutationOptions({ mutationFn: putNode });
};

export const putResourcesPrimaryMutationOptions = () => {
  return mutationOptions({ mutationFn: putResourcesPrimary });
};
