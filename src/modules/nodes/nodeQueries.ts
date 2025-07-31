/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { chunk, uniqBy } from "lodash-es";
import { useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { Node, NodeChild, NodeType } from "@ndla/types-taxonomy";
import { fetchChildNodes, fetchNode, fetchNodeResources, fetchNodes, postSearchNodes, searchNodes } from "./nodeApi";
import {
  GetNodeParams,
  GetNodeResourcesParams,
  NodeChildWithChildren,
  NodeResourceMeta,
  RESOURCE_NODE,
  TOPIC_NODE,
} from "./nodeApiTypes";
import { PUBLISHED } from "../../constants";
import { NodeTree } from "../../containers/NodeDiff/diffUtils";
import { SearchResultBase, WithTaxonomyVersion } from "../../interfaces";
import {
  CHILD_NODES_WITH_ARTICLE_TYPE,
  NODE,
  NODE_RESOURCES,
  NODES,
  POST_SEARCH_NODES,
  RESOURCES_WITH_NODE_CONNECTION,
  ROOT_NODE_WITH_CHILDREN,
  SEARCH_NODES,
} from "../../queryKeys";
import { fetchDrafts } from "../draft/draftApi";
import { fetchLearningpaths } from "../learningpath/learningpathApi";

export const nodeQueryKeys = {
  nodes: (params?: Partial<UseNodesParams>) => [NODES, params] as const,
  node: (params?: Partial<UseNodeParams>) => [NODE, params] as const,
  search: (params?: Partial<UseSearchNodes>) => [SEARCH_NODES, params] as const,
  postSearch: (params?: Partial<UseSearchNodes>) => [POST_SEARCH_NODES, params] as const,
  tree: (params?: Partial<UseNodeTree>) => [ROOT_NODE_WITH_CHILDREN, params] as const,
  resources: (params?: Partial<UseResourcesWithNodeConnectionParams>) =>
    [RESOURCES_WITH_NODE_CONNECTION, params] as const,
  resourceMetas: (params?: Partial<UseNodeResourceMetas>) => [NODE_RESOURCES, params] as const,
  childNodes: (params?: Partial<UseChildNodesWithArticleTypeParams>) =>
    [CHILD_NODES_WITH_ARTICLE_TYPE, params] as const,
};

interface UseNodesParams extends WithTaxonomyVersion, GetNodeParams {}
export const useNodes = (params: UseNodesParams, options?: Partial<UseQueryOptions<Node[]>>) => {
  return useQuery<Node[]>({
    queryKey: nodeQueryKeys.nodes(params),
    queryFn: () => fetchNodes(params),
    ...options,
  });
};

interface UseNodeParams extends WithTaxonomyVersion {
  id: string;
  language?: string;
}

export const useNode = (params: UseNodeParams, options?: Partial<UseQueryOptions<Node>>) => {
  const qc = useQueryClient();
  return useQuery<Node>({
    queryKey: nodeQueryKeys.node(params),
    queryFn: () => fetchNode(params),
    placeholderData: qc
      .getQueryData<Node[]>(
        nodeQueryKeys.nodes({
          taxonomyVersion: params.taxonomyVersion,
          language: params.language,
        }),
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

export const useNodeResourceMetas = (
  params: UseNodeResourceMetas,
  options?: Partial<UseQueryOptions<NodeResourceMeta[]>>,
) => {
  return useQuery<NodeResourceMeta[]>({
    queryKey: nodeQueryKeys.resourceMetas(params),
    queryFn: () => fetchNodeResourceMetas(params),
    ...options,
  });
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
        const split = curr!.split(":");
        const type = split[1];
        const id = parseInt(split[2]);
        if (!id) return acc;
        if (type === "article") {
          acc.articleIds = acc.articleIds.concat(id);
        } else if (type === "learningpath") {
          acc.learningpathIds = acc.learningpathIds.concat(id);
        }
        return acc;
      },
      { articleIds: [], learningpathIds: [] },
    );
};

const fetchNodeResourceMetas = async (params: UseNodeResourceMetas): Promise<NodeResourceMeta[]> => {
  const { articleIds, learningpathIds } = partitionByContentUri(params.ids);
  const articlesPromise = articleIds.length ? fetchDrafts(articleIds, params.language) : Promise.resolve([]);
  const learningpathsPromise = learningpathIds.length
    ? fetchLearningpaths(learningpathIds, params.language)
    : Promise.resolve([]);
  const [articles, learningpaths] = await Promise.all([articlesPromise, learningpathsPromise]);
  const transformedArticles: NodeResourceMeta[] = articles.map(
    ({ status, grepCodes, articleType, id, revision, revisions, notes, responsible, started, comments }) => ({
      status,
      grepCodes,
      articleType,
      contentUri: `urn:article:${id}`,
      revision,
      responsible,
      revisions,
      notes,
      started,
      comments,
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
    isVisible: false,
  });
  if (childNodes.length === 0) return [];

  const childIds = childNodes
    .filter((n) => n.contentUri?.includes("urn:article"))
    .map((n) => Number(n.contentUri?.split(":").pop()))
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
    const draftId = Number(node.contentUri?.split(":").pop());
    const articleType = articleTypeMap[draftId];
    const isPublished = isPublishedMap[draftId];
    return { ...node, articleType, isPublished };
  });
};

interface UseNodeTree extends WithTaxonomyVersion {
  id: string;
  language: string;
}

export const useNodeTree = (params: UseNodeTree, options?: Partial<UseQueryOptions<NodeTree>>) => {
  return useQuery<NodeTree>({
    queryKey: nodeQueryKeys.tree(params),
    queryFn: () => fetchNodeTree(params),
    ...options,
  });
};

interface NodeTreeGetParams extends WithTaxonomyVersion {
  id: string;
  language: string;
}

const fetchNodeTree = async ({ id, language, taxonomyVersion }: NodeTreeGetParams): Promise<NodeTree> => {
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
    root: {
      ...childOrRegularRoot,
      resources: resourcesForNodeIdMap[root.id] ?? [],
    },
    children: childrenWithResources,
  };
};

interface UseChildNodesWithArticleTypeParams extends WithTaxonomyVersion {
  id: string;
  language: string;
  nodeType?: NodeType[];
}

export const useChildNodesWithArticleType = (
  params: UseChildNodesWithArticleTypeParams,
  options?: Partial<UseQueryOptions<(NodeChildWithChildren & { articleType?: string })[]>>,
) => {
  return useQuery<NodeChildWithChildren[]>({
    queryKey: nodeQueryKeys.childNodes(params),
    queryFn: () => fetchChildNodesWithArticleType(params),
    ...options,
  });
};

interface UseResourcesWithNodeConnectionParams extends WithTaxonomyVersion, GetNodeResourcesParams {
  id: string;
}

export const useResourcesWithNodeConnection = (
  params: UseResourcesWithNodeConnectionParams,
  options?: Partial<UseQueryOptions<NodeChild[]>>,
) => {
  return useQuery<NodeChild[]>({
    ...options,
    queryKey: nodeQueryKeys.resources(params),
    queryFn: () => fetchNodeResources(params),
  });
};

interface UseSearchNodes extends WithTaxonomyVersion {
  ids?: string[];
  language?: string;
  nodeType?: NodeType;
  page?: number;
  pageSize?: number;
  query?: string;
}

export const useSearchNodes = (params: UseSearchNodes, options?: Partial<UseQueryOptions<SearchResultBase<Node>>>) => {
  return useQuery<SearchResultBase<Node>>({
    queryKey: nodeQueryKeys.search(params),
    queryFn: () => searchNodes(params),
    ...options,
  });
};

interface UsePostSearchNodes extends WithTaxonomyVersion {
  pageSize?: number;
  customFields?: Record<string, string>;
}
export const usePostSearchNodes = (
  body: UsePostSearchNodes,
  options?: Partial<UseQueryOptions<SearchResultBase<Node>>>,
) => {
  return useQuery<SearchResultBase<Node>>({
    queryKey: nodeQueryKeys.postSearch(body),
    queryFn: () => postSearchNodes(body),
    ...options,
  });
};
