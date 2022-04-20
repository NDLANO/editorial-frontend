/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
import { useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import { NodeTree } from '../../containers/NodeDiff/diffUtils';
import { WithTaxonomyVersion } from '../../interfaces';
import {
  CHILD_NODES_WITH_ARTICLE_TYPE,
  CONNECTIONS_FOR_NODE,
  NODE,
  NODE_TRANSLATIONS,
  RESOURCES_WITH_NODE_CONNECTION,
  ROOT_NODE_WITH_CHILDREN,
} from '../../queryKeys';
import { searchDrafts } from '../draft/draftApi';
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

interface UseNodesParams extends WithTaxonomyVersion, GetNodeParams {}

export const useNodes = (
  { taxonomyVersion, ...params }: UseNodesParams,
  options?: UseQueryOptions<NodeType[]>,
) => {
  const query = queryString.stringify(params);
  return useQuery<NodeType[]>(
    ['nodes', query],
    () => fetchNodes({ ...params, taxonomyVersion }),
    options,
  );
};

interface UseNodeParams extends WithTaxonomyVersion {
  id: string;
  language?: string;
}

export const useNode = (
  { id, language, taxonomyVersion }: UseNodeParams,
  options?: UseQueryOptions<NodeType>,
) => {
  const qc = useQueryClient();
  return useQuery<NodeType>(
    [NODE, id, language],
    () => fetchNode({ id, taxonomyVersion, language }),
    {
      placeholderData: qc.getQueryData<NodeType[]>(NODE)?.find(s => s.id === id),
      ...options,
    },
  );
};

interface ChildNodesWithArticleTypeParams extends WithTaxonomyVersion {
  id: string;
  language: string;
}

const fetchChildNodesWithArticleType = async ({
  id,
  language,
  taxonomyVersion,
}: ChildNodesWithArticleTypeParams): Promise<(ChildNodeType & {
  articleType?: string;
})[]> => {
  const childNodes = await fetchChildNodes({ id, taxonomyVersion, language, recursive: true });
  if (childNodes.length === 0) return [];

  const childIds = childNodes.map(n => Number(n.contentUri?.split(':').pop())).filter(id => !!id);
  const searchRes = await searchDrafts({ idList: childIds });

  const articleTypeMap = searchRes.results.reduce<Record<number, string>>((acc, curr) => {
    acc[curr.id] = curr.articleType;
    return acc;
  }, {});

  return childNodes.map(node => {
    const draftId = Number(node.contentUri?.split(':').pop());
    const articleType = articleTypeMap[draftId];
    return { ...node, articleType };
  });
};

interface UseNodeTree extends WithTaxonomyVersion {
  id: string;
  language: string;
}

export const useNodeTree = (
  { id, language, taxonomyVersion }: UseNodeTree,
  options?: UseQueryOptions<NodeTree>,
) => {
  return useQuery<NodeTree>(
    [ROOT_NODE_WITH_CHILDREN, id, language, taxonomyVersion],
    () => fetchNodeTree({ id, language, taxonomyVersion }),
    options,
  );
};
interface NodeTreeGetParams extends WithTaxonomyVersion {
  id: string;
  language: string;
}

const fetchNodeTree = async ({
  id,
  language,
  taxonomyVersion,
}: NodeTreeGetParams): Promise<NodeTree> => {
  const [root, children] = await Promise.all([
    fetchNode({ id, language, taxonomyVersion }),
    fetchChildNodesWithArticleType({ id, language, taxonomyVersion }),
  ]);
  return { root, children };
};

interface UseChildNodesWithArticleTypeParams extends WithTaxonomyVersion {
  id: string;
  language: string;
}

export const useChildNodesWithArticleType = (
  { id, language, taxonomyVersion }: UseChildNodesWithArticleTypeParams,
  options?: UseQueryOptions<(ChildNodeType & { articleType?: string })[]>,
) => {
  return useQuery<ChildNodeType[]>(
    [CHILD_NODES_WITH_ARTICLE_TYPE, taxonomyVersion, id, language],
    () => fetchChildNodesWithArticleType({ id, language, taxonomyVersion }),
    options,
  );
};

interface UseConnectionsForNodeParams extends WithTaxonomyVersion {
  id: string;
}

export const useConnectionsForNode = (
  { id, taxonomyVersion }: UseConnectionsForNodeParams,
  options?: UseQueryOptions<ConnectionForNode[]>,
) => {
  return useQuery<ConnectionForNode[]>(
    [CONNECTIONS_FOR_NODE, id],
    () => fetchConnectionsForNode({ id, taxonomyVersion }),
    options,
  );
};

interface UseNodeTranslationParams extends WithTaxonomyVersion {
  id: string;
}

export const useNodeTranslations = (
  { id, taxonomyVersion }: UseNodeTranslationParams,
  options?: UseQueryOptions<NodeTranslation[]>,
) => {
  return useQuery<NodeTranslation[]>(
    [NODE_TRANSLATIONS, id],
    () => fetchNodeTranslations({ id, taxonomyVersion }),
    options,
  );
};

interface UseResourcesWithNodeConnectionParams extends WithTaxonomyVersion, GetNodeResourcesParams {
  id: string;
}

export const useResourcesWithNodeConnection = (
  { id, taxonomyVersion, ...params }: UseResourcesWithNodeConnectionParams,
  options?: UseQueryOptions<ResourceWithNodeConnection[]>,
) => {
  return useQuery<ResourceWithNodeConnection[]>(
    [RESOURCES_WITH_NODE_CONNECTION, id, params],
    () => fetchNodeResources({ id, taxonomyVersion, ...params }),
    options,
  );
};
