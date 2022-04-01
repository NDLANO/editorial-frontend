/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { TaxonomyVars } from '../../interfaces';
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
  return useMutation<string, undefined, TaxonomyVars<NodePostPatchType>>(
    data => postNode(data.vars, data.taxonomyVersion),
    {
      onMutate: async data => {
        const newNode = data.vars;
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
    },
  );
};

export const useUpdateNodeMetadataMutation = () => {
  const qc = useQueryClient();
  const { i18n } = useTranslation();
  return useMutation<
    TaxonomyMetadata,
    unknown,
    TaxonomyVars<{ id: string; metadata: Partial<TaxonomyMetadata>; rootId?: string }>
  >(data => putNodeMetadata(data.vars.id, data.vars.metadata, data.taxonomyVersion), {
    onMutate: async vars => {
      const { id, metadata, rootId } = vars.vars;
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
    onSettled: (_, __, vars) => {
      const key = vars.vars.rootId
        ? [CHILD_NODES_WITH_ARTICLE_TYPE, vars.vars.rootId, i18n.language]
        : NODES;
      qc.invalidateQueries(key);
    },
  });
};

export const useDeleteNodeMutation = () => {
  const qc = useQueryClient();
  return useMutation<void, unknown, TaxonomyVars<{ id: string }>>(
    data => deleteNode(data.vars.id, data.taxonomyVersion),
    {
      onMutate: async vars => {
        const id = vars.vars.id;
        await qc.cancelQueries(NODES);
        const prevNodes = qc.getQueryData<NodeType[]>(NODES) ?? [];
        const withoutDeleted = prevNodes.filter(s => s.id !== id);
        qc.setQueryData<NodeType[]>(NODES, withoutDeleted);
      },
      onSettled: () => qc.invalidateQueries(NODES),
    },
  );
};

export const useDeleteNodeTranslationMutation = () => {
  return useMutation<void, unknown, TaxonomyVars<{ subjectId: string; locale: string }>>(data =>
    deleteNodeTranslation(data.vars.subjectId, data.vars.locale, data.taxonomyVersion),
  );
};

export const useUpdateNodeTranslationMutation = () => {
  return useMutation<
    void,
    unknown,
    TaxonomyVars<{ id: string; locale: string; newTranslation: NodeTranslationPutType }>
  >(data =>
    putNodeTranslation(
      data.vars.id,
      data.vars.locale,
      data.vars.newTranslation,
      data.taxonomyVersion,
    ),
  );
};

export const useDeleteNodeConnectionMutation = (
  options?: UseMutationOptions<void, unknown, TaxonomyVars<{ id: string }>>,
) => {
  return useMutation<void, unknown, TaxonomyVars<{ id: string }>>(
    data => deleteNodeConnection(data.vars.id, data.taxonomyVersion),
    options,
  );
};

export const useUpdateNodeConnectionMutation = (
  options?: UseMutationOptions<
    void,
    unknown,
    TaxonomyVars<{ id: string; body: NodeConnectionPutType }>
  >,
) => {
  return useMutation<void, unknown, TaxonomyVars<{ id: string; body: NodeConnectionPutType }>>(
    data => putNodeConnection(data.vars.id, data.vars.body, data.taxonomyVersion),
    options,
  );
};

export const usePostNodeConnectionMutation = (
  options?: UseMutationOptions<string, unknown, TaxonomyVars<{ body: NodeConnectionPostType }>>,
) => {
  return useMutation<string, unknown, TaxonomyVars<{ body: NodeConnectionPostType }>>(
    data => postNodeConnection(data.vars.body, data.taxonomyVersion),
    options,
  );
};

export const usePostResourceForNodeMutation = (
  options?: UseMutationOptions<void, unknown, TaxonomyVars<{ body: NodeResourcePostType }>>,
) => {
  return useMutation<void, unknown, TaxonomyVars<{ body: NodeResourcePostType }>>(
    data => postResourceForNode(data.vars.body, data.taxonomyVersion),
    options,
  );
};

export const useDeleteResourceForNodeMutation = (
  options?: UseMutationOptions<void, unknown, TaxonomyVars<{ id: string }>>,
) => {
  return useMutation<void, unknown, TaxonomyVars<{ id: string }>>(
    data => deleteResourceForNode(data.vars.id, data.taxonomyVersion),
    options,
  );
};

export const usePutResourceForNodeMutation = (
  options?: UseMutationOptions<
    void,
    unknown,
    TaxonomyVars<{ id: string; body: NodeResourcePutType }>
  >,
) => {
  return useMutation<void, unknown, TaxonomyVars<{ id: string; body: NodeResourcePutType }>>(
    data => putResourceForNode(data.vars.id, data.vars.body, data.taxonomyVersion),
    options,
  );
};
