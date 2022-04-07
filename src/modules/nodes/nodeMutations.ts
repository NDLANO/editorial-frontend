/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { TaxonomyParameters } from '../../interfaces';
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
  return useMutation<string, undefined, TaxonomyParameters<NodePostPatchType>>(
    ({ params, taxonomyVersion }) => postNode({ body: params, taxonomyVersion }),
    {
      onMutate: async ({ params }) => {
        const newNode = params;
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
    TaxonomyParameters<{ id: string; metadata: Partial<TaxonomyMetadata>; rootId?: string }>
  >(
    ({ params, taxonomyVersion }) =>
      putNodeMetadata({ id: params.id, meta: params.metadata, taxonomyVersion }),
    {
      onMutate: async ({ params }) => {
        const { id, metadata, rootId } = params;
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
      onSettled: (_, __, { params }) => {
        const key = params.rootId
          ? [CHILD_NODES_WITH_ARTICLE_TYPE, params.rootId, i18n.language]
          : NODES;
        qc.invalidateQueries(key);
      },
    },
  );
};

export const useDeleteNodeMutation = () => {
  const qc = useQueryClient();
  return useMutation<void, unknown, TaxonomyParameters<{ id: string }>>(
    ({ params, taxonomyVersion }) => deleteNode({ id: params.id, taxonomyVersion }),
    {
      onMutate: async ({ params }) => {
        const id = params.id;
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
  return useMutation<void, unknown, TaxonomyParameters<{ subjectId: string; locale: string }>>(
    ({ params, taxonomyVersion }) =>
      deleteNodeTranslation({ id: params.subjectId, language: params.locale, taxonomyVersion }),
  );
};

export const useUpdateNodeTranslationMutation = () => {
  return useMutation<
    void,
    unknown,
    TaxonomyParameters<{ id: string; locale: string; newTranslation: NodeTranslationPutType }>
  >(({ taxonomyVersion, params }) =>
    putNodeTranslation({
      id: params.id,
      language: params.locale,
      body: params.newTranslation,
      taxonomyVersion,
    }),
  );
};

export const useDeleteNodeConnectionMutation = (
  options?: UseMutationOptions<void, unknown, TaxonomyParameters<{ id: string }>>,
) => {
  return useMutation<void, unknown, TaxonomyParameters<{ id: string }>>(
    ({ params, taxonomyVersion }) => deleteNodeConnection({ id: params.id, taxonomyVersion }),
    options,
  );
};

export const useUpdateNodeConnectionMutation = (
  options?: UseMutationOptions<
    void,
    unknown,
    TaxonomyParameters<{ id: string; body: NodeConnectionPutType }>
  >,
) => {
  return useMutation<
    void,
    unknown,
    TaxonomyParameters<{ id: string; body: NodeConnectionPutType }>
  >(
    ({ params, taxonomyVersion }) =>
      putNodeConnection({ id: params.id, body: params.body, taxonomyVersion }),
    options,
  );
};

export const usePostNodeConnectionMutation = (
  options?: UseMutationOptions<
    string,
    unknown,
    TaxonomyParameters<{ body: NodeConnectionPostType }>
  >,
) => {
  return useMutation<string, unknown, TaxonomyParameters<{ body: NodeConnectionPostType }>>(
    ({ params, taxonomyVersion }) => postNodeConnection({ body: params.body, taxonomyVersion }),
    options,
  );
};

export const usePostResourceForNodeMutation = (
  options?: UseMutationOptions<void, unknown, TaxonomyParameters<{ body: NodeResourcePostType }>>,
) => {
  return useMutation<void, unknown, TaxonomyParameters<{ body: NodeResourcePostType }>>(
    ({ params, taxonomyVersion }) => postResourceForNode({ body: params.body, taxonomyVersion }),
    options,
  );
};

export const useDeleteResourceForNodeMutation = (
  options?: UseMutationOptions<void, unknown, TaxonomyParameters<{ id: string }>>,
) => {
  return useMutation<void, unknown, TaxonomyParameters<{ id: string }>>(
    ({ params, taxonomyVersion }) => deleteResourceForNode({ id: params.id, taxonomyVersion }),
    options,
  );
};

export const usePutResourceForNodeMutation = (
  options?: UseMutationOptions<
    void,
    unknown,
    TaxonomyParameters<{ id: string; body: NodeResourcePutType }>
  >,
) => {
  return useMutation<void, unknown, TaxonomyParameters<{ id: string; body: NodeResourcePutType }>>(
    ({ params, taxonomyVersion }) =>
      putResourceForNode({ id: params.id, body: params.body, taxonomyVersion }),
    options,
  );
};
