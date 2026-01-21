/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { Node, NodeChild, NodeType, NodeSearchBody } from "@ndla/types-taxonomy";
import { MultiSearchSummaryDTO } from "@ndla/types-backend/search-api";
import { fetchChildNodes, fetchNode, fetchNodes, postSearchNodes, searchNodes } from "./nodeApi";
import { GetChildNodesParams, GetNodesParams, RESOURCE_NODE, TOPIC_NODE } from "./nodeApiTypes";
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
import { getContentUriInfo } from "../../util/taxonomyHelpers";
import { postSearch } from "../search/searchApi";
import { NoNodeResultTypes } from "../search/searchApiInterfaces";

export const nodeQueryKeys = {
  nodes: (params?: Partial<UseNodesParams>) => [NODES, params] as const,
  node: (params?: Partial<UseNodeParams>) => [NODE, params] as const,
  search: (params?: Partial<UseSearchNodes>) => [SEARCH_NODES, params] as const,
  postSearch: (params?: Partial<UseSearchNodes>) => [POST_SEARCH_NODES, params] as const,
  tree: (params?: Partial<UseNodeTree>) => [ROOT_NODE_WITH_CHILDREN, params] as const,
  resourceMetas: (params?: Partial<UseNodeResourceMetas>) => [NODE_RESOURCES, params] as const,
  childNodes: (params?: Partial<UseChildNodesParams>) => [CHILD_NODES, params] as const,
};

interface UseNodesParams extends WithTaxonomyVersion, GetNodesParams {}
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
  contentUris: string[];
  language?: string;
}

export const useNodeResourceMetas = (
  params: UseNodeResourceMetas,
  options?: Partial<UseQueryOptions<MultiSearchSummaryDTO[]>>,
) => {
  return useQuery<MultiSearchSummaryDTO[]>({
    queryKey: nodeQueryKeys.resourceMetas(params),
    queryFn: () => fetchNodeResourceMetas(params),
    ...options,
  });
};

const getIdsAndResultTypes = (contentUris: string[]) => {
  return contentUris.reduce<{ ids: Set<number>; resultTypes: Set<NoNodeResultTypes> }>(
    (acc, curr) => {
      const info = getContentUriInfo(curr);
      if (!info) return acc;
      acc.ids.add(info.id);
      acc.resultTypes.add(info.type === "learningpath" ? "learningpath" : "draft");
      return acc;
    },
    { ids: new Set<number>(), resultTypes: new Set<NoNodeResultTypes>() },
  );
};

const fetchNodeResourceMetas = async (params: UseNodeResourceMetas): Promise<MultiSearchSummaryDTO[]> => {
  if (!params.contentUris.length) {
    return [];
  }
  const { ids, resultTypes } = getIdsAndResultTypes(params.contentUris);

  const search = await postSearch({
    resultTypes: Array.from(resultTypes),
    ids: Array.from(ids),
    pageSize: ids.size * resultTypes.size,
  });

  const keyedByContentUri = search.results.reduce<Record<string, MultiSearchSummaryDTO>>((acc, curr) => {
    acc[`urn:${curr.learningResourceType === "learningpath" ? "learningpath" : "article"}:${curr.id}`] = curr;
    return acc;
  }, {});

  return params.contentUris.reduce<MultiSearchSummaryDTO[]>((acc, curr) => {
    const res = keyedByContentUri[curr];
    if (!res) return acc;
    acc.push(res);
    return acc;
  }, []);
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
  nodeType?: NodeType[];
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
  body: NodeSearchBody;
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
