/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
import { useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import {
  CHILD_NODES_WITH_ARTICLE_TYPE,
  CONNECTIONS_FOR_NODE,
  NODE,
  NODE_TRANSLATIONS,
  RESOURCES_WITH_NODE_CONNECTION,
} from '../../queryKeys';
import { fetchDraft } from '../draft/draftApi';
import {
  fetchChildNodes,
  fetchConnectionsForNode,
  fetchNode,
  fetchNodeResources,
  fetchNodes,
  fetchNodeTranslations,
} from './nodeApi';
import {
  ChildNodeType,
  ConnectionForNode,
  GetNodeParams,
  GetNodeResourcesParams,
  NodeTranslation,
  NodeType,
  ResourceWithNodeConnection,
} from './nodeApiTypes';

export const useNodes = (params: GetNodeParams, options?: UseQueryOptions<NodeType[]>) => {
  const query = queryString.stringify(params);
  return useQuery<NodeType[]>(['nodes', query], () => fetchNodes(params), options);
};

export const useNode = (id: string, language?: string, options?: UseQueryOptions<NodeType>) => {
  const qc = useQueryClient();
  return useQuery<NodeType>([NODE, id, language], () => fetchNode(id, language), {
    placeholderData: qc.getQueryData<NodeType[]>(NODE)?.find(s => s.id === id),
    ...options,
  });
};

const fetchChildNodesWithArticleType = async (
  id: string,
  language: string,
): Promise<(ChildNodeType & {
  articleType?: string;
})[]> => {
  const childNodes = await fetchChildNodes(id, { language, recursive: true });
  return await Promise.all(
    childNodes.map(async t => {
      const articleId = t.contentUri?.split(':').pop();
      if (articleId) {
        try {
          const draft = await fetchDraft(parseInt(articleId));
          return { ...t, articleType: draft.articleType };
        } catch (e) {
          return t;
        }
      }
      return t;
    }),
  );
};

export const useChildNodesWithArticleType = (
  id: string,
  language: string,
  options?: UseQueryOptions<(ChildNodeType & { articleType?: string })[]>,
) => {
  return useQuery<ChildNodeType[]>(
    [CHILD_NODES_WITH_ARTICLE_TYPE, id, language],
    () => fetchChildNodesWithArticleType(id, language),
    options,
  );
};

export const useConnectionsForNode = (
  id: string,
  options?: UseQueryOptions<ConnectionForNode[]>,
) => {
  return useQuery<ConnectionForNode[]>(
    [CONNECTIONS_FOR_NODE, id],
    () => fetchConnectionsForNode(id),
    options,
  );
};

export const useNodeTranslations = (id: string, options?: UseQueryOptions<NodeTranslation[]>) => {
  return useQuery<NodeTranslation[]>(
    [NODE_TRANSLATIONS, id],
    () => fetchNodeTranslations(id),
    options,
  );
};

export const useResourcesWithNodeConnection = (
  id: string,
  params: GetNodeResourcesParams,
  options?: UseQueryOptions<ResourceWithNodeConnection[]>,
) => {
  return useQuery<ResourceWithNodeConnection[]>(
    [RESOURCES_WITH_NODE_CONNECTION, id, params],
    () => fetchNodeResources(id, params),
    options,
  );
};
