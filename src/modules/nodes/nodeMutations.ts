/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  Node,
  NodeConnectionPOST,
  NodeConnectionPUT,
  NodePostPut,
  TranslationPUT,
  Metadata,
} from "@ndla/types-taxonomy";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { WithTaxonomyVersion } from "../../interfaces";
import handleError from "../../util/handleError";
import {
  createResourceResourceType,
  deleteResourceResourceType,
  ResourceResourceTypeDeleteParams,
  ResourceResourceTypePostParams,
} from "../taxonomy/resourcetypes";
import {
  deleteNode,
  deleteNodeConnection,
  deleteNodeTranslation,
  postNode,
  postNodeConnection,
  putNode,
  putNodeConnection,
  putNodeMetadata,
  PutNodeParams,
  putNodeTranslation,
  putResourcesPrimary,
  PutResourcesPrimaryParams,
} from "./nodeApi";
import { nodeQueryKeys } from "./nodeQueries";

interface UseAddNodeMutation extends WithTaxonomyVersion {
  body: NodePostPut;
}

export const usePostNodeMutation = (options?: Partial<UseMutationOptions<string, undefined, UseAddNodeMutation>>) => {
  return useMutation<string, undefined, UseAddNodeMutation>({
    mutationFn: ({ body, taxonomyVersion }) => postNode({ body, taxonomyVersion }),
    ...options,
  });
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
        translations: [],
        supportedLanguages: [],
        resourceTypes: [],
        contexts: [],
        contextids: [],
        metadata: { visible: true, grepCodes: [], customFields: {} },
        breadcrumbs: [],
        language: "",
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

interface UseDeleteNodeTranslationMutation extends WithTaxonomyVersion {
  id: string;
  language: string;
}

export const useDeleteNodeTranslationMutation = () => {
  return useMutation<void, unknown, UseDeleteNodeTranslationMutation>({
    mutationFn: ({ id, language, taxonomyVersion }) => deleteNodeTranslation({ id, language, taxonomyVersion }),
  });
};

interface UseUpdateNodeTranslationMutation extends WithTaxonomyVersion {
  id: string;
  language: string;
  body: TranslationPUT;
}

export const useUpdateNodeTranslationMutation = () => {
  return useMutation<void, unknown, UseUpdateNodeTranslationMutation>({
    mutationFn: ({ taxonomyVersion, id, language, body }) =>
      putNodeTranslation({ id, language, body, taxonomyVersion }),
  });
};

interface UseDeleteNodeConnectionMutation extends WithTaxonomyVersion {
  id: string;
}

export const useDeleteNodeConnectionMutation = (
  options?: Partial<UseMutationOptions<void, unknown, UseDeleteNodeConnectionMutation>>,
) => {
  return useMutation<void, unknown, UseDeleteNodeConnectionMutation>({
    mutationFn: ({ id, taxonomyVersion }) => deleteNodeConnection({ id, taxonomyVersion }),
    ...options,
  });
};

interface UseUpdateNodeConnectionMutation extends WithTaxonomyVersion {
  id: string;
  body: NodeConnectionPUT;
}

export const useUpdateNodeConnectionMutation = (
  options?: Partial<UseMutationOptions<void, unknown, UseUpdateNodeConnectionMutation>>,
) => {
  return useMutation<void, unknown, UseUpdateNodeConnectionMutation>({
    mutationFn: ({ id, body, taxonomyVersion }) => putNodeConnection({ id, body, taxonomyVersion }),
    ...options,
  });
};

interface UsePostNodeConnectionMutation extends WithTaxonomyVersion {
  body: NodeConnectionPOST;
}
export const usePostNodeConnectionMutation = (
  options?: Partial<UseMutationOptions<string, unknown, UsePostNodeConnectionMutation>>,
) => {
  return useMutation<string, unknown, UsePostNodeConnectionMutation>({
    mutationFn: ({ body, taxonomyVersion }) => postNodeConnection({ body, taxonomyVersion }),
    ...options,
  });
};

export const useCreateResourceResourceTypeMutation = (
  options?: Partial<UseMutationOptions<string, unknown, ResourceResourceTypePostParams>>,
) => {
  return useMutation<string, unknown, ResourceResourceTypePostParams>({
    mutationFn: ({ body, taxonomyVersion }) => createResourceResourceType({ body, taxonomyVersion }),
    ...options,
  });
};

export const useDeleteResourceResourceTypeMutation = (
  options?: Partial<UseMutationOptions<void, unknown, ResourceResourceTypeDeleteParams>>,
) => {
  return useMutation<void, unknown, ResourceResourceTypeDeleteParams>({
    mutationFn: ({ id, taxonomyVersion }) => deleteResourceResourceType({ id, taxonomyVersion }),
    ...options,
  });
};

type UsePutNodeMutation = PutNodeParams;

export const usePutNodeMutation = (options?: Partial<UseMutationOptions<void, unknown, UsePutNodeMutation>>) => {
  return useMutation<void, unknown, UsePutNodeMutation>({
    mutationFn: (params) => putNode(params),
    ...options,
  });
};

export const usePutResourcesPrimaryMutation = (
  options?: Partial<UseMutationOptions<boolean, unknown, PutResourcesPrimaryParams>>,
) => {
  return useMutation<boolean, unknown, PutResourcesPrimaryParams>({
    mutationFn: (params) => putResourcesPrimary(params),
    ...options,
  });
};
