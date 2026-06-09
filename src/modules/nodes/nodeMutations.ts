/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Node, NodePostPut, Metadata } from "@ndla/types-backend/taxonomy-api";
import { mutationOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { WithTaxonomyVersion } from "../../interfaces";
import handleError from "../../util/handleError";
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

interface UseAddNodeMutation extends WithTaxonomyVersion {
  body: NodePostPut;
}

export const postNodeMutationOptions = () => {
  return mutationOptions({ mutationFn: postNode });
};

export const useAddNodeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<string, undefined, UseAddNodeMutation>({
    mutationFn: ({ body, taxonomyVersion }) => postNode({ body, taxonomyVersion }),
    onMutate: async ({ body: newNode, taxonomyVersion }) => {
      const key = nodeQueryKeys.nodes({ taxonomyVersion, isRoot: true });
      await queryClient.cancelQueries({ queryKey: key });
      const previousNodes = queryClient.getQueryData<Node[]>(key) ?? [];
      const optimisticNode: Node = {
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
      };
      queryClient.setQueryData<Node[]>(key, [...previousNodes, optimisticNode]);
      return previousNodes;
    },
    onError: (e) => handleError(e),
    onSettled: (_, __, { taxonomyVersion }) =>
      queryClient.invalidateQueries({
        queryKey: nodeQueryKeys.nodes({ taxonomyVersion }),
      }),
  });
};

interface UseUpdateNodeMetadataMutation extends WithTaxonomyVersion {
  id: string;
  metadata: Partial<Metadata>;
  rootId?: string;
}

export const useUpdateNodeMetadataMutation = () => {
  const qc = useQueryClient();
  const { i18n } = useTranslation();
  return useMutation<Metadata, unknown, UseUpdateNodeMetadataMutation>({
    mutationFn: ({ id, metadata, taxonomyVersion }) => putNodeMetadata({ id: id, meta: metadata, taxonomyVersion }),

    onMutate: async ({ id, metadata, rootId, taxonomyVersion }) => {
      const key = rootId
        ? nodeQueryKeys.childNodes({
            taxonomyVersion,
            id: rootId,
            language: i18n.language,
          })
        : nodeQueryKeys.nodes({
            isContext: true,
            nodeType: ["SUBJECT"],
            language: i18n.language,
            taxonomyVersion,
          });
      await qc.cancelQueries({ queryKey: key });
      const prevNodes = qc.getQueryData<Node[]>(key) ?? [];
      const newNodes = prevNodes.map((node) => {
        if (node.id === id) {
          return { ...node, metadata: { ...node.metadata, ...metadata } };
        } else return node;
      });
      qc.setQueryData<Node[]>(key, newNodes);
    },
    onSettled: (_, __, { rootId, taxonomyVersion }) => {
      const key = rootId
        ? nodeQueryKeys.childNodes({
            taxonomyVersion,
            id: rootId,
            language: i18n.language,
          })
        : nodeQueryKeys.nodes({
            language: i18n.language,
            nodeType: ["SUBJECT"],
            isContext: true,
            taxonomyVersion,
          });
      qc.invalidateQueries({ queryKey: key });
    },
  });
};

interface UseDeleteNodeMutation extends WithTaxonomyVersion {
  id: string;
  rootId?: string;
}

export const useDeleteNodeMutation = () => {
  const qc = useQueryClient();
  const { i18n } = useTranslation();
  return useMutation<void, unknown, UseDeleteNodeMutation>({
    mutationFn: ({ id, taxonomyVersion }) => deleteNode({ id, taxonomyVersion }),
    onMutate: async ({ id, rootId, taxonomyVersion }) => {
      const key = rootId
        ? nodeQueryKeys.childNodes({
            taxonomyVersion,
            id: rootId,
            language: i18n.language,
          })
        : nodeQueryKeys.nodes({ taxonomyVersion, isRoot: true });
      await qc.cancelQueries({ queryKey: key });
      const prevNodes = qc.getQueryData<Node[]>(key) ?? [];
      const withoutDeleted = prevNodes.filter((s) => s.id !== id);
      qc.setQueryData<Node[]>(key, withoutDeleted);
    },
    onSettled: (_, __, { rootId, taxonomyVersion }) => {
      const key = rootId
        ? nodeQueryKeys.childNodes({
            taxonomyVersion,
            id: rootId,
            language: i18n.language,
          })
        : nodeQueryKeys.nodes({ taxonomyVersion, isRoot: true });
      qc.invalidateQueries({ queryKey: key });
    },
  });
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
