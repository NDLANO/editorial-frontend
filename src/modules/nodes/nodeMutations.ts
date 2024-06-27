/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import {
  Node,
  NodeConnectionPOST,
  NodeConnectionPUT,
  NodePostPut,
  NodeResourcePOST,
  NodeResourcePUT,
  TranslationPUT,
  Metadata,
} from "@ndla/types-taxonomy";
import {
  deleteNode,
  deleteNodeConnection,
  deleteNodeTranslation,
  deleteResourceForNode,
  postNode,
  postNodeConnection,
  postResourceForNode,
  putNode,
  putNodeConnection,
  putNodeMetadata,
  PutNodeParams,
  putNodeTranslation,
  putResourceForNode,
  putResourcesPrimary,
  PutResourcesPrimaryParams,
} from "./nodeApi";
import { nodeQueryKeys } from "./nodeQueries";
import { WithTaxonomyVersion } from "../../interfaces";
import handleError from "../../util/handleError";
import { createResourceResourceType, ResourceResourceTypePostParams } from "../taxonomy/resourcetypes";

interface UseAddNodeMutation extends WithTaxonomyVersion {
  body: NodePostPut;
}

export const useAddNodeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<string, undefined, UseAddNodeMutation>({
    mutationFn: ({ body, taxonomyVersion }) => postNode({ body, taxonomyVersion }),
    onMutate: async ({ body: newNode, taxonomyVersion }) => {
      const key = nodeQueryKeys.nodes({ taxonomyVersion, isRoot: true });
      await queryClient.cancelQueries({ queryKey: key });
      const previousNodes = queryClient.getQueryData<Node[]>(key) ?? [];
      const optimisticNode: Node = {
        ...newNode,
        baseName: newNode.name ?? "",
        name: newNode.name ?? "",
        contentUri: newNode.contentUri ?? "",
        id: newNode.nodeId ?? "",
        path: "",
        paths: [],
        translations: [],
        supportedLanguages: [],
        resourceTypes: [],
        contexts: [],
        metadata: { visible: true, grepCodes: [], customFields: {} },
        breadcrumbs: [],
        qualityEvaluation: undefined,
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
            nodeType: "SUBJECT",
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
            nodeType: "SUBJECT",
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

interface UsePostResourceForNodeMutation extends WithTaxonomyVersion {
  body: NodeResourcePOST;
}

export const usePostResourceForNodeMutation = (
  options?: Partial<UseMutationOptions<string, unknown, UsePostResourceForNodeMutation>>,
) => {
  return useMutation<string, unknown, UsePostResourceForNodeMutation>({
    mutationFn: ({ body, taxonomyVersion }) => postResourceForNode({ body, taxonomyVersion }),
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

interface UseDeleteResourceForNodeMutation extends WithTaxonomyVersion {
  id: string;
}

export const useDeleteResourceForNodeMutation = (
  options?: Partial<UseMutationOptions<void, unknown, UseDeleteResourceForNodeMutation>>,
) => {
  return useMutation<void, unknown, UseDeleteResourceForNodeMutation>({
    mutationFn: ({ id, taxonomyVersion }) => deleteResourceForNode({ id, taxonomyVersion }),
    ...options,
  });
};

interface UsePutResourceForNodeMutation extends WithTaxonomyVersion {
  id: string;
  body: NodeResourcePUT;
}

export const usePutResourceForNodeMutation = (
  options?: Partial<UseMutationOptions<void, unknown, UsePutResourceForNodeMutation>>,
) => {
  return useMutation<void, unknown, UsePutResourceForNodeMutation>({
    mutationFn: ({ id, body, taxonomyVersion }) => putResourceForNode({ id, body, taxonomyVersion }),
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
  options?: Partial<UseMutationOptions<void, unknown, PutResourcesPrimaryParams>>,
) => {
  return useMutation<void, unknown, PutResourcesPrimaryParams>({
    mutationFn: (params) => putResourcesPrimary(params),
    ...options,
  });
};
