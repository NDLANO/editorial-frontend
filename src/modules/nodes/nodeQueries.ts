/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { Node, NodeChild, NodeType } from "@ndla/types-taxonomy";
import { fetchChildNodes, fetchNode, fetchNodes, postSearchNodes, searchNodes } from "./nodeApi";
import { GetChildNodesParams, GetNodeParams, NodeResourceMeta, RESOURCE_NODE, TOPIC_NODE } from "./nodeApiTypes";
import { NodeTree } from "../../containers/NodeDiff/diffUtils";
import { SearchResultBase, WithTaxonomyVersion } from "../../interfaces";
import {
  CHILD_NODES,
  NODE,
  NODE_RESOURCES,
  NODES,
  POST_SEARCH_NODES,
  ROOT_NODE_WITH_CHILDREN,
  SEARCH_NODES,
} from "../../queryKeys";
import { getIdFromUrn, getTypeFromUrn } from "../../util/taxonomyHelpers";
import { fetchDrafts } from "../draft/draftApi";
import { fetchLearningpaths } from "../learningpath/learningpathApi";
import { fetchResourceStats } from "../myndla/myndlaApi";

export const nodeQueryKeys = {
  nodes: (params?: Partial<UseNodesParams>) => [NODES, params] as const,
  node: (params?: Partial<UseNodeParams>) => [NODE, params] as const,
  search: (params?: Partial<UseSearchNodes>) => [SEARCH_NODES, params] as const,
  postSearch: (params?: Partial<UseSearchNodes>) => [POST_SEARCH_NODES, params] as const,
  tree: (params?: Partial<UseNodeTree>) => [ROOT_NODE_WITH_CHILDREN, params] as const,
  resourceMetas: (params?: Partial<UseNodeResourceMetas>) => [NODE_RESOURCES, params] as const,
  childNodes: (params?: Partial<UseChildNodesParams>) => [CHILD_NODES, params] as const,
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
  ids: { id: string; type: string }[];
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

const partitionById = (ids: string[]) => {
  return ids
    .filter((uri) => !!uri)
    .reduce<ContentUriPartition>(
      (acc, curr) => {
        const type = getTypeFromUrn(curr!);
        const id = getIdFromUrn(curr!);
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
  if (!params.ids.length) return [];
  const { articleIds, learningpathIds } = partitionById(params.ids.map((id) => id.id));
  const articlesPromise = articleIds.length ? fetchDrafts(articleIds, params.language) : Promise.resolve([]);
  const learningpathsPromise = learningpathIds.length
    ? fetchLearningpaths(learningpathIds, params.language)
    : Promise.resolve([]);
  const resourceStatsPromise = fetchResourceStats(
    Array.from(new Set(params.ids.map((id) => id.type))),
    params.ids.map((id) => `${getIdFromUrn(id.id)}`),
  );
  const [articles, learningpaths, resourceStats] = await Promise.all([
    articlesPromise,
    learningpathsPromise,
    resourceStatsPromise,
  ]);

  const resourceMetas = params.ids.map((idObj) => {
    const id = getIdFromUrn(idObj.id);
    const isLearningpath = idObj.type.includes("learningpath");
    if (isLearningpath) {
      const learningpath = learningpaths.find((lp) => lp.id === id);
      if (learningpath) {
        return {
          ...learningpath,
          status: { current: learningpath.status, other: [] },
          contentUri: `urn:learningpath:${learningpath.id}`,
          hearts:
            resourceStats.find((stat) => stat.id === `${learningpath.id}` && stat.resourceType === "learningpath")
              ?.favourites || 0,
        };
      }
      return undefined;
    } else {
      const article = articles.find((article) => article.id === id);
      if (article) {
        return {
          ...article,
          contentUri: `urn:article:${article.id}`,
          hearts:
            resourceStats.find((stat) => stat.id === `${article.id}` && stat.resourceType === idObj.type)?.favourites ||
            0,
        };
      }
      return undefined;
    }
  });

  return resourceMetas.filter((rm) => rm !== undefined);
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
    fetchChildNodes({
      id,
      language,
      nodeType: [TOPIC_NODE, RESOURCE_NODE],
      taxonomyVersion,
      recursive: true,
      isVisible: false,
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

interface UseChildNodesParams extends WithTaxonomyVersion, GetChildNodesParams {
  id: string;
}

export const useChildNodes = (params: UseChildNodesParams, options?: Partial<UseQueryOptions<NodeChild[]>>) => {
  return useQuery<NodeChild[]>({
    queryKey: nodeQueryKeys.childNodes(params),
    queryFn: () => fetchChildNodes(params),
    ...options,
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
