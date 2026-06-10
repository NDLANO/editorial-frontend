/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { NodeChild, NodeSearchBody } from "@ndla/types-backend/taxonomy-api";
import { queryOptions } from "@tanstack/react-query";
import { NodeTree } from "../../containers/NodeDiff/diffUtils";
import { WithTaxonomyVersion } from "../../interfaces";
import { CHILD_NODES, NODE, NODES, ROOT_NODE_WITH_CHILDREN, SEARCH_NODES } from "../../queryKeys";
import { fetchChildNodes, fetchNode, fetchNodes, postSearchNodes } from "./nodeApi";
import { GetChildNodesParams, GetNodesParams, RESOURCE_NODE, TOPIC_NODE } from "./nodeApiTypes";

export const nodeQueryKeys = {
  all: [NODES] as const,
  nodes: ({ contentURI, nodeType, taxonomyVersion, ...params }: Partial<UseNodesParams> = {}) =>
    [NODES, contentURI, nodeType, taxonomyVersion, params] as const,
  node: (params?: Partial<UseNodeParams>) => [NODE, params] as const,
  search: (params?: Partial<SearchNodesParams>) => [SEARCH_NODES, params] as const,
  tree: (params?: Partial<UseNodeTree>) => [ROOT_NODE_WITH_CHILDREN, params] as const,
  childNodes: ({ id, ...params }: Partial<UseChildNodesParams> = {}) => [CHILD_NODES, id, params] as const,
};

interface UseNodesParams extends WithTaxonomyVersion, GetNodesParams {}

export const nodesQueryOptions = (params: UseNodesParams) => {
  return queryOptions({
    queryKey: nodeQueryKeys.nodes(params),
    queryFn: () => fetchNodes(params),
  });
};

interface UseNodeParams extends WithTaxonomyVersion {
  id: string;
  language?: string;
}

export const nodeQueryOptions = (params: UseNodeParams) => {
  return queryOptions({
    queryKey: nodeQueryKeys.node(params),
    queryFn: () => fetchNode(params),
  });
};

interface UseNodeTree extends WithTaxonomyVersion {
  id: string;
  language: string;
}

export const nodeTreeQueryOptions = (params: UseNodeTree) => {
  return queryOptions({
    queryKey: nodeQueryKeys.tree(params),
    queryFn: () => fetchNodeTree(params),
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

export const childNodesQueryOptions = (params: UseChildNodesParams) => {
  return queryOptions({
    queryKey: nodeQueryKeys.childNodes(params),
    queryFn: () => fetchChildNodes(params),
  });
};

interface SearchNodesParams extends WithTaxonomyVersion, NodeSearchBody {}

export const searchNodesQueryOptions = (params: SearchNodesParams) => {
  const { taxonomyVersion, ...body } = params;
  return queryOptions({
    queryKey: nodeQueryKeys.search(params),
    queryFn: () => postSearchNodes({ body, taxonomyVersion: taxonomyVersion }),
  });
};
