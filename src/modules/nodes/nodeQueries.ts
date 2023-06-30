/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { IDraftResponsible, IEditorNote, IRevisionMeta } from '@ndla/types-backend/draft-api';
import chunk from 'lodash/chunk';
import uniqBy from 'lodash/uniqBy';
import { Connection, Node, NodeChild, NodeType, Translation } from '@ndla/types-taxonomy';
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
import { fetchLearningpaths } from '../learningpath/learningpathApi';
import { GetNodeParams, GetNodeResourcesParams, RESOURCE_NODE, TOPIC_NODE } from './nodeApiTypes';

interface UseNodesParams extends WithTaxonomyVersion, GetNodeParams {}
export const nodesQueryKey = (params?: Partial<UseNodesParams>) => [NODES, params];
export const useNodes = (params: UseNodesParams, options?: UseQueryOptions<Node[]>) => {
  return useQuery<Node[]>([NODES, params], () => fetchNodes(params), options);
};

interface UseNodeParams extends WithTaxonomyVersion {
  id: string;
  language?: string;
}
export const nodeQueryKey = (params?: Partial<UseNodeParams>) => [NODE, params];
export const useNode = (params: UseNodeParams, options?: UseQueryOptions<Node>) => {
  const qc = useQueryClient();
  return useQuery<Node>(nodeQueryKey(params), () => fetchNode(params), {
    placeholderData: qc
      .getQueryData<Node[]>(
        nodesQueryKey({ taxonomyVersion: params.taxonomyVersion, language: params.language }),
      )
      ?.find((s) => s.id === params.id),
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
  revision?: number;
  notes?: IEditorNote[];
  revisions?: IRevisionMeta[];
  responsible?: IDraftResponsible;
  started?: boolean;
}

export const nodeResourceMetasQueryKey = (params: Partial<UseNodeResourceMetas>) => [
  NODE_RESOURCES,
  params,
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
    .filter((uri) => !!uri)
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
    ({ status, grepCodes, articleType, id, revision, revisions, notes, responsible, started }) => ({
      status,
      grepCodes,
      articleType,
      contentUri: `urn:article:${id}`,
      revision,
      responsible,
      revisions,
      notes,
      started,
    }),
  );
  const transformedLearningpaths: NodeResourceMeta[] = learningpaths.map((lp) => ({
    status: { current: lp.status, other: [] },
    contentUri: `urn:learningpath:${lp.id}`,
  }));

  return transformedArticles.concat(transformedLearningpaths);
};

interface ChildNodesWithArticleTypeParams extends WithTaxonomyVersion {
  id: string;
  language: string;
  nodeType?: NodeType[];
}

export interface NodeChildWithChildren extends NodeChild {
  childNodes?: NodeChildWithChildren[];
}

const fetchChildNodesWithArticleType = async ({
  id,
  language,
  nodeType,
  taxonomyVersion,
}: ChildNodesWithArticleTypeParams): Promise<
  (NodeChildWithChildren & {
    articleType?: string;
    isPublished?: boolean;
  })[]
> => {
  const childNodes = await fetchChildNodes({
    id,
    taxonomyVersion,
    language,
    recursive: true,
    nodeType,
  });
  if (childNodes.length === 0) return [];

  const childIds = childNodes
    .map((n) => Number(n.contentUri?.split(':').pop()))
    .filter((id) => !!id);

  const chunks = chunk(childIds, 250);
  const searchRes = await Promise.all(chunks.map((chunk) => fetchDrafts(chunk)));

  const flattenedUniqueSeachRes = uniqBy(searchRes.flat(), (s) => s.id);
  const articleTypeMap = flattenedUniqueSeachRes.reduce<Record<number, string>>((acc, curr) => {
    acc[curr.id] = curr.articleType;
    return acc;
  }, {});

  const isPublishedMap = flattenedUniqueSeachRes.reduce<Record<number, boolean>>((acc, curr) => {
    acc[curr.id] = curr.status.current === PUBLISHED || curr.status.other.includes(PUBLISHED);
    return acc;
  }, {});

  return childNodes.map((node) => {
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
    fetchChildNodesWithArticleType({
      id,
      language,
      nodeType: [TOPIC_NODE, RESOURCE_NODE],
      taxonomyVersion,
    }),
  ]);

  const rootFromChildren: NodeChild | undefined = children.find((child) => child.id === id);
  const childOrRegularRoot = rootFromChildren ?? root;
  const allResources = children.filter((n) => n.nodeType === RESOURCE_NODE);
  const resourcesForNodeIdMap = allResources.reduce<Record<string, NodeChild[]>>((acc, curr) => {
    if (!curr.parentId) return acc;

    if (acc[curr.parentId]) {
      acc[curr.parentId] = acc[curr.parentId].concat([curr]);
    } else {
      acc[curr.parentId] = [curr];
    }

    return acc;
  }, {});

  const childrenWithResources = children
    .filter((x) => x.nodeType !== RESOURCE_NODE)
    .map((child) => ({
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
  nodeType?: NodeType[];
}

export const childNodesWithArticleTypeQueryKey = (
  params?: Partial<UseChildNodesWithArticleTypeParams>,
) => [CHILD_NODES_WITH_ARTICLE_TYPE, params];

export const useChildNodesWithArticleType = (
  params: UseChildNodesWithArticleTypeParams,
  options?: UseQueryOptions<(NodeChildWithChildren & { articleType?: string })[]>,
) => {
  return useQuery<NodeChildWithChildren[]>(
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
  options?: UseQueryOptions<Connection[]>,
) => {
  return useQuery<Connection[]>(
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
  options?: UseQueryOptions<Translation[]>,
) => {
  return useQuery<Translation[]>(
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
  options?: UseQueryOptions<NodeChild[]>,
) => {
  return useQuery<NodeChild[]>(
    resourcesWithNodeConnectionQueryKey(params),
    () => fetchNodeResources(params),
    options,
  );
};

interface UseSearchNodes extends WithTaxonomyVersion {
  ids?: string[];
  language?: string;
  nodeType?: NodeType;
  page?: number;
  pageSize?: number;
  query?: string;
}

export const searchNodesQueryKey = (params: UseSearchNodes) => [SEARCH_NODES, params];
export const useSearchNodes = (
  params: UseSearchNodes,
  options?: UseQueryOptions<SearchResultBase<Node>>,
) => {
  return useQuery<SearchResultBase<Node>>(
    searchNodesQueryKey(params),
    () => searchNodes(params),
    options,
  );
};
