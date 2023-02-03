/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import { NodeTree } from '../../containers/NodeDiff/diffUtils';
import { SearchResultBase, WithTaxonomyVersion } from '../../interfaces';
import { PUBLISHED } from '../../constants';
import {
  CHILD_NODES_WITH_ARTICLE_TYPE,
  CONNECTIONS_FOR_NODE,
  NODE,
  NODE_RESOURCES,
  NODE_TRANSLATIONS,
  NODES,
  RESOURCES_WITH_NODE_CONNECTION,
  ROOT_NODE_WITH_CHILDREN,
  SEARCH_NODES,
} from '../../queryKeys';
import { fetchDrafts } from '../draft/draftApi';
import {
  fetchChildNodes,
  fetchConnectionsForNode,
  fetchNode,
  fetchNodeResources,
  fetchNodes,
  fetchNodeTranslations,
  searchNodes,
} from './nodeApi';
import {
  ChildNodeType,
  ConnectionForNode,
  GetNodeParams,
  GetNodeResourcesParams,
  NodeTranslation,
  NodeType,
  RESOURCE_NODE,
  ResourceWithNodeConnection,
} from './nodeApiTypes';
import { fetchLearningpaths } from '../learningpath/learningpathApi';

interface UseNodesParams extends WithTaxonomyVersion, GetNodeParams {}
export const nodesQueryKey = (params?: Partial<UseNodesParams>) => [NODES, params];
export const useNodes = (params: UseNodesParams, options?: UseQueryOptions<NodeType[]>) => {
  return useQuery<NodeType[]>([NODES, params], () => fetchNodes(params), options);
};

interface UseNodeParams extends WithTaxonomyVersion {
  id: string;
  language?: string;
}
export const nodeQueryKey = (params?: Partial<UseNodeParams>) => [NODE, params];
export const useNode = (params: UseNodeParams, options?: UseQueryOptions<NodeType>) => {
  const qc = useQueryClient();
  return useQuery<NodeType>(nodeQueryKey(params), () => fetchNode(params), {
    placeholderData: qc
      .getQueryData<NodeType[]>(
        nodesQueryKey({ taxonomyVersion: params.taxonomyVersion, language: params.language }),
      )
      ?.find(s => s.id === params.id),
    ...options,
  });
};

interface UseNodeResourceMetas {
  nodeId: string;
  ids: string[];
  language?: string;
}

export interface NodeResourceMeta {
  contentUri: string;
  grepCodes?: string[];
  status?: { current: string; other: string[] };
  articleType?: string;
}

export const nodeResourceMetasQueryKey = (params: Partial<UseNodeResourceMetas>) => [
  NODE_RESOURCES,
  {
    nodeId: params.nodeId,
    language: params.language,
  },
];

export const useNodeResourceMetas = (
  params: UseNodeResourceMetas,
  options?: UseQueryOptions<NodeResourceMeta[]>,
) => {
  return useQuery<NodeResourceMeta[]>(
    nodeResourceMetasQueryKey(params),
    () => fetchNodeResourceMetas(params),
    options,
  );
};

interface ContentUriPartition {
  articleIds: number[];
  learningpathIds: number[];
}

const partitionByContentUri = (contentUris: (string | undefined)[]) => {
  return contentUris
    .filter(uri => !!uri)
    .reduce<ContentUriPartition>(
      (acc, curr) => {
        const split = curr!.split(':');
        const type = split[1];
        const id = parseInt(split[2]);
        if (!id) return acc;
        if (type === 'article') {
          acc.articleIds = acc.articleIds.concat(id);
        } else if (type === 'learningpath') {
          acc.learningpathIds = acc.learningpathIds.concat(id);
        }
        return acc;
      },
      { articleIds: [], learningpathIds: [] },
    );
};

const fetchNodeResourceMetas = async (
  params: UseNodeResourceMetas,
): Promise<NodeResourceMeta[]> => {
  const { articleIds, learningpathIds } = partitionByContentUri(params.ids);
  const articlesPromise = articleIds.length
    ? fetchDrafts(articleIds, params.language)
    : Promise.resolve([]);
  const learningpathsPromise = learningpathIds.length
    ? fetchLearningpaths(learningpathIds, params.language)
    : Promise.resolve([]);
  const [articles, learningpaths] = await Promise.all([articlesPromise, learningpathsPromise]);
  const transformedArticles: NodeResourceMeta[] = articles.map(
    ({ status, grepCodes, articleType, id }) => ({
      status,
      grepCodes,
      articleType,
      contentUri: `urn:article:${id}`,
    }),
  );
  const transformedLearningpaths: NodeResourceMeta[] = learningpaths.map(lp => ({
    status: { current: lp.status, other: [] },
    contentUri: `urn:learningpath:${lp.id}`,
  }));

  return transformedArticles.concat(transformedLearningpaths);
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
  isPublished?: boolean;
})[]> => {
  const childNodesWithResources = await fetchChildNodes({
    id,
    taxonomyVersion,
    language,
    recursive: true,
  });
  const childNodes = childNodesWithResources.filter(x => x.nodeType !== RESOURCE_NODE);

  if (childNodes.length === 0) return [];

  const childIds = childNodes.map(n => Number(n.contentUri?.split(':').pop())).filter(id => !!id);
  const searchRes = await fetchDrafts(childIds);

  const articleTypeMap = searchRes.reduce<Record<number, string>>((acc, curr) => {
    acc[curr.id] = curr.articleType;
    return acc;
  }, {});

  const isPublishedMap = searchRes.reduce<Record<number, boolean>>((acc, curr) => {
    acc[curr.id] = curr.status.current === PUBLISHED || curr.status.other.includes(PUBLISHED);
    return acc;
  }, {});

  return childNodes.map(node => {
    const draftId = Number(node.contentUri?.split(':').pop());
    const articleType = articleTypeMap[draftId];
    const isPublished = isPublishedMap[draftId];
    return { ...node, articleType, isPublished };
  });
};

interface UseNodeTree extends WithTaxonomyVersion {
  id: string;
  language: string;
}

export const nodeTreeQueryKeys = (params?: Partial<UseNodeTree>) => [
  ROOT_NODE_WITH_CHILDREN,
  params,
];

export const useNodeTree = (params: UseNodeTree, options?: UseQueryOptions<NodeTree>) => {
  return useQuery<NodeTree>(nodeTreeQueryKeys(params), () => fetchNodeTree(params), options);
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

  const rootFromChildren: ChildNodeType | undefined = children.find(child => child.id === id);
  const childOrRegularRoot = rootFromChildren ?? root;
  const allResources = children.filter(n => n.nodeType === RESOURCE_NODE);
  const resourcesForNodeIdMap = allResources.reduce<Record<string, ChildNodeType[]>>(
    (acc, curr) => {
      if (!curr.parent) return acc;

      if (acc[curr.parent]) {
        acc[curr.parent] = acc[curr.parent].concat([curr]);
      } else {
        acc[curr.parent] = [curr];
      }

      return acc;
    },
    {},
  );

  const childrenWithResources = children
    .filter(x => x.nodeType !== RESOURCE_NODE)
    .map(child => ({
      ...child,
      resources: resourcesForNodeIdMap[child.id] ?? [],
    }));
  return {
    root: { ...childOrRegularRoot, resources: resourcesForNodeIdMap[root.id] ?? [] },
    children: childrenWithResources,
  };
};

interface UseChildNodesWithArticleTypeParams extends WithTaxonomyVersion {
  id: string;
  language: string;
}

export const childNodesWithArticleTypeQueryKey = (
  params?: Partial<UseChildNodesWithArticleTypeParams>,
) => [CHILD_NODES_WITH_ARTICLE_TYPE, params];

export const useChildNodesWithArticleType = (
  params: UseChildNodesWithArticleTypeParams,
  options?: UseQueryOptions<(ChildNodeType & { articleType?: string })[]>,
) => {
  return useQuery<ChildNodeType[]>(
    childNodesWithArticleTypeQueryKey(params),
    () => fetchChildNodesWithArticleType(params),
    options,
  );
};

interface UseConnectionsForNodeParams extends WithTaxonomyVersion {
  id: string;
}
export const connectionsForNodeQueryKey = (params?: Partial<UseConnectionsForNodeParams>) => [
  CONNECTIONS_FOR_NODE,
  params,
];
export const useConnectionsForNode = (
  params: UseConnectionsForNodeParams,
  options?: UseQueryOptions<ConnectionForNode[]>,
) => {
  return useQuery<ConnectionForNode[]>(
    connectionsForNodeQueryKey(params),
    () => fetchConnectionsForNode(params),
    options,
  );
};

interface UseNodeTranslationParams extends WithTaxonomyVersion {
  id: string;
}

export const nodeTranslationsQueryKey = (params?: Partial<UseNodeTranslationParams>) => [
  NODE_TRANSLATIONS,
  params,
];

export const useNodeTranslations = (
  params: UseNodeTranslationParams,
  options?: UseQueryOptions<NodeTranslation[]>,
) => {
  return useQuery<NodeTranslation[]>(
    nodeTranslationsQueryKey(params),
    () => fetchNodeTranslations(params),
    options,
  );
};

interface UseResourcesWithNodeConnectionParams extends WithTaxonomyVersion, GetNodeResourcesParams {
  id: string;
}

export const resourcesWithNodeConnectionQueryKey = (
  params?: Partial<UseResourcesWithNodeConnectionParams>,
) => [RESOURCES_WITH_NODE_CONNECTION, params];

export const useResourcesWithNodeConnection = (
  params: UseResourcesWithNodeConnectionParams,
  options?: UseQueryOptions<ResourceWithNodeConnection[]>,
) => {
  return useQuery<ResourceWithNodeConnection[]>(
    resourcesWithNodeConnectionQueryKey(params),
    () => fetchNodeResources(params),
    options,
  );
};

interface UseSearchNodes extends WithTaxonomyVersion {
  ids?: string[];
  language?: string;
  nodeType?: 'NODE' | 'TOPIC' | 'SUBJECT' | 'RESOURCE';
  page?: number;
  pageSize?: number;
  query?: string;
}

export const searchNodesQueryKey = (params: UseSearchNodes) => [SEARCH_NODES, params];
export const useSearchNodes = (
  params: UseSearchNodes,
  options?: UseQueryOptions<SearchResultBase<NodeType>>,
) => {
  return useQuery<SearchResultBase<NodeType>>(
    searchNodesQueryKey(params),
    () => searchNodes(params),
    options,
  );
};
