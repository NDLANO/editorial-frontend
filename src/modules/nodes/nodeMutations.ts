/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { CHILD_NODES_WITH_ARTICLE_TYPE, NODES } from '../../queryKeys';
import handleError from '../../util/handleError';
import { TaxonomyMetadata } from '../taxonomy/taxonomyApiInterfaces';
import {
  deleteNode,
  deleteNodeConnection,
  deleteNodeTranslation,
  deleteResourceForNode,
  postNode,
  postNodeConnection,
  postResourceForNode,
  putNodeConnection,
  putNodeMetadata,
  putNodeTranslation,
  putResourceForNode,
} from './nodeApi';
import {
  NodeConnectionPostType,
  NodeConnectionPutType,
  NodePostPatchType,
  NodeResourcePostType,
  NodeResourcePutType,
  NodeTranslationPutType,
  NodeType,
} from './nodeApiTypes';

export const useAddNodeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<string, undefined, NodePostPatchType>(data => postNode(data), {
    onMutate: async newNode => {
      await queryClient.cancelQueries(NODES);
      const previousNodes = queryClient.getQueryData<NodeType[]>(NODES) ?? [];
      const optimisticNode: NodeType = {
        ...newNode,
        contentUri: newNode.contentUri ?? '',
        id: newNode.id ?? '',
        path: '',
        metadata: { visible: true, grepCodes: [], customFields: {} },
      };
      queryClient.setQueryData<NodeType[]>(NODES, [...previousNodes, optimisticNode]);
      return previousNodes;
    },
    onError: e => handleError(e),
    onSettled: () => queryClient.invalidateQueries(NODES),
  });
};

export const useUpdateNodeMetadataMutation = () => {
  const qc = useQueryClient();
  const { i18n } = useTranslation();
  return useMutation<
    TaxonomyMetadata,
    unknown,
    { id: string; metadata: Partial<TaxonomyMetadata>; rootId?: string }
  >(data => putNodeMetadata(data.id, data.metadata), {
    onMutate: async ({ id, metadata, rootId }) => {
      const key = rootId ? [CHILD_NODES_WITH_ARTICLE_TYPE, rootId, i18n.language] : NODES;
      await qc.cancelQueries(key);
      const prevNodes = qc.getQueryData<NodeType[]>(key) ?? [];
      const newNodes = prevNodes.map(node => {
        if (node.id === id) {
          return { ...node, metadata: { ...node.metadata, ...metadata } };
        } else return node;
      });
      qc.setQueryData<NodeType[]>(key, newNodes);
    },
    onSettled: (_, __, { rootId }) => {
      const key = rootId ? [CHILD_NODES_WITH_ARTICLE_TYPE, rootId, i18n.language] : NODES;
      qc.invalidateQueries(key);
    },
  });
};

export const useDeleteNodeMutation = () => {
  const qc = useQueryClient();
  return useMutation<void, unknown, string>(id => deleteNode(id), {
    onMutate: async id => {
      await qc.cancelQueries(NODES);
      const prevNodes = qc.getQueryData<NodeType[]>(NODES) ?? [];
      const withoutDeleted = prevNodes.filter(s => s.id !== id);
      qc.setQueryData<NodeType[]>(NODES, withoutDeleted);
    },
    onSettled: () => qc.invalidateQueries(NODES),
  });
};

export const useDeleteNodeTranslationMutation = () => {
  return useMutation<void, unknown, { subjectId: string; locale: string }>(data =>
    deleteNodeTranslation(data.subjectId, data.locale),
  );
};

export const useUpdateNodeTranslationMutation = () => {
  return useMutation<
    void,
    unknown,
    { id: string; locale: string; newTranslation: NodeTranslationPutType }
  >(data => putNodeTranslation(data.id, data.locale, data.newTranslation));
};

export const useDeleteNodeConnectionMutation = (
  options?: UseMutationOptions<void, unknown, { id: string }>,
) => {
  return useMutation<void, unknown, { id: string }>(data => deleteNodeConnection(data.id), options);
};

export const useUpdateNodeConnectionMutation = (
  options?: UseMutationOptions<void, unknown, { id: string; body: NodeConnectionPutType }>,
) => {
  return useMutation<void, unknown, { id: string; body: NodeConnectionPutType }>(
    data => putNodeConnection(data.id, data.body),
    options,
  );
};

export const usePostNodeConnectionMutation = (
  options?: UseMutationOptions<string, unknown, { body: NodeConnectionPostType }>,
) => {
  return useMutation<string, unknown, { body: NodeConnectionPostType }>(
    data => postNodeConnection(data.body),
    options,
  );
};

export const usePostResourceForNodeMutation = (
  options?: UseMutationOptions<void, unknown, { body: NodeResourcePostType }>,
) => {
  return useMutation<void, unknown, { body: NodeResourcePostType }>(
    data => postResourceForNode(data.body),
    options,
  );
};

export const useDeleteResourceForNodeMutation = (
  options?: UseMutationOptions<void, unknown, { id: string }>,
) => {
  return useMutation<void, unknown, { id: string }>(
    data => deleteResourceForNode(data.id),
    options,
  );
};

export const usePutResourceForNodeMutation = (
  options?: UseMutationOptions<void, unknown, { id: string; body: NodeResourcePutType }>,
) => {
  return useMutation<void, unknown, { id: string; body: NodeResourcePutType }>(
    data => putResourceForNode(data.id, data.body),
    options,
  );
};
