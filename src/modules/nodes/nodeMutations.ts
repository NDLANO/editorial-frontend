/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { WithTaxonomyVersion } from '../../interfaces';
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
import { childNodesWithArticleTypeQueryKey, nodesQueryKey } from './nodeQueries';

interface UseAddNodeMutation extends WithTaxonomyVersion {
  body: NodePostPatchType;
}

export const useAddNodeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<string, undefined, UseAddNodeMutation>(
    ({ body, taxonomyVersion }) => postNode({ body, taxonomyVersion }),
    {
      onMutate: async ({ body: newNode, taxonomyVersion }) => {
        const key = nodesQueryKey({ taxonomyVersion, isRoot: true });
        await queryClient.cancelQueries(key);
        const previousNodes = queryClient.getQueryData<NodeType[]>(key) ?? [];
        const optimisticNode: NodeType = {
          ...newNode,
          contentUri: newNode.contentUri ?? '',
          id: newNode.id ?? '',
          path: '',
          translations: [],
          supportedLanguages: [],
          metadata: { visible: true, grepCodes: [], customFields: {} },
        };
        queryClient.setQueryData<NodeType[]>(key, [...previousNodes, optimisticNode]);
        return previousNodes;
      },
      onError: e => handleError(e),
      onSettled: (_, __, { taxonomyVersion }) =>
        queryClient.invalidateQueries(nodesQueryKey({ taxonomyVersion })),
    },
  );
};

interface UseUpdateNodeMetadataMutation extends WithTaxonomyVersion {
  id: string;
  metadata: Partial<TaxonomyMetadata>;
  rootId?: string;
}

export const useUpdateNodeMetadataMutation = () => {
  const qc = useQueryClient();
  const { i18n } = useTranslation();
  return useMutation<TaxonomyMetadata, unknown, UseUpdateNodeMetadataMutation>(
    ({ id, metadata, taxonomyVersion }) =>
      putNodeMetadata({ id: id, meta: metadata, taxonomyVersion }),
    {
      onMutate: async ({ id, metadata, rootId, taxonomyVersion }) => {
        const key = rootId
          ? childNodesWithArticleTypeQueryKey({
              taxonomyVersion,
              id: rootId,
              language: i18n.language,
            })
          : nodesQueryKey({ isRoot: true, taxonomyVersion });
        await qc.cancelQueries(key);
        const prevNodes = qc.getQueryData<NodeType[]>(key) ?? [];
        const newNodes = prevNodes.map(node => {
          if (node.id === id) {
            return { ...node, metadata: { ...node.metadata, ...metadata } };
          } else return node;
        });
        qc.setQueryData<NodeType[]>(key, newNodes);
      },
      onSettled: (_, __, { rootId, taxonomyVersion }) => {
        const key = rootId
          ? childNodesWithArticleTypeQueryKey({
              taxonomyVersion,
              id: rootId,
              language: i18n.language,
            })
          : nodesQueryKey({ taxonomyVersion, isRoot: true });
        qc.invalidateQueries(key);
      },
    },
  );
};

interface UseDeleteNodeMutation extends WithTaxonomyVersion {
  id: string;
  rootId?: string;
}

export const useDeleteNodeMutation = () => {
  const qc = useQueryClient();
  const { i18n } = useTranslation();
  return useMutation<void, unknown, UseDeleteNodeMutation>(
    ({ id, taxonomyVersion }) => deleteNode({ id, taxonomyVersion }),
    {
      onMutate: async ({ id, rootId, taxonomyVersion }) => {
        const key = rootId
          ? childNodesWithArticleTypeQueryKey({
              taxonomyVersion,
              id: rootId,
              language: i18n.language,
            })
          : nodesQueryKey({ taxonomyVersion, isRoot: true });
        await qc.cancelQueries(key);
        const prevNodes = qc.getQueryData<NodeType[]>(key) ?? [];
        const withoutDeleted = prevNodes.filter(s => s.id !== id);
        qc.setQueryData<NodeType[]>(key, withoutDeleted);
      },
      onSettled: (_, __, { rootId, taxonomyVersion }) => {
        const key = rootId
          ? childNodesWithArticleTypeQueryKey({
              taxonomyVersion,
              id: rootId,
              language: i18n.language,
            })
          : nodesQueryKey({ taxonomyVersion, isRoot: true });
        qc.invalidateQueries(key);
      },
    },
  );
};

interface UseDeleteNodeTranslationMutation extends WithTaxonomyVersion {
  id: string;
  language: string;
}

export const useDeleteNodeTranslationMutation = () => {
  return useMutation<void, unknown, UseDeleteNodeTranslationMutation>(
    ({ id, language, taxonomyVersion }) => deleteNodeTranslation({ id, language, taxonomyVersion }),
  );
};

interface UseUpdateNodeTranslationMutation extends WithTaxonomyVersion {
  id: string;
  language: string;
  body: NodeTranslationPutType;
}

export const useUpdateNodeTranslationMutation = () => {
  return useMutation<void, unknown, UseUpdateNodeTranslationMutation>(
    ({ taxonomyVersion, id, language, body }) =>
      putNodeTranslation({ id, language, body, taxonomyVersion }),
  );
};

interface UseDeleteNodeConnectionMutation extends WithTaxonomyVersion {
  id: string;
}

export const useDeleteNodeConnectionMutation = (
  options?: UseMutationOptions<void, unknown, UseDeleteNodeConnectionMutation>,
) => {
  return useMutation<void, unknown, UseDeleteNodeConnectionMutation>(
    ({ id, taxonomyVersion }) => deleteNodeConnection({ id, taxonomyVersion }),
    options,
  );
};

interface UseUpdateNodeConnectionMutation extends WithTaxonomyVersion {
  id: string;
  body: NodeConnectionPutType;
}

export const useUpdateNodeConnectionMutation = (
  options?: UseMutationOptions<void, unknown, UseUpdateNodeConnectionMutation>,
) => {
  return useMutation<void, unknown, UseUpdateNodeConnectionMutation>(
    ({ id, body, taxonomyVersion }) => putNodeConnection({ id, body, taxonomyVersion }),
    options,
  );
};

interface UsePostNodeConnectionMutation extends WithTaxonomyVersion {
  body: NodeConnectionPostType;
}
export const usePostNodeConnectionMutation = (
  options?: UseMutationOptions<string, unknown, UsePostNodeConnectionMutation>,
) => {
  return useMutation<string, unknown, UsePostNodeConnectionMutation>(
    ({ body, taxonomyVersion }) => postNodeConnection({ body, taxonomyVersion }),
    options,
  );
};

interface UsePostResourceForNodeMutation extends WithTaxonomyVersion {
  body: NodeResourcePostType;
}

export const usePostResourceForNodeMutation = (
  options?: UseMutationOptions<void, unknown, UsePostResourceForNodeMutation>,
) => {
  return useMutation<void, unknown, UsePostResourceForNodeMutation>(
    ({ body, taxonomyVersion }) => postResourceForNode({ body, taxonomyVersion }),
    options,
  );
};

interface UseDeleteResourceForNodeMutation extends WithTaxonomyVersion {
  id: string;
}

export const useDeleteResourceForNodeMutation = (
  options?: UseMutationOptions<void, unknown, UseDeleteResourceForNodeMutation>,
) => {
  return useMutation<void, unknown, UseDeleteResourceForNodeMutation>(
    ({ id, taxonomyVersion }) => deleteResourceForNode({ id, taxonomyVersion }),
    options,
  );
};

interface UsePutResourceForNodeMutation extends WithTaxonomyVersion {
  id: string;
  body: NodeResourcePutType;
}

export const usePutResourceForNodeMutation = (
  options?: UseMutationOptions<void, unknown, UsePutResourceForNodeMutation>,
) => {
  return useMutation<void, unknown, UsePutResourceForNodeMutation>(
    ({ id, body, taxonomyVersion }) => putResourceForNode({ id, body, taxonomyVersion }),
    options,
  );
};
