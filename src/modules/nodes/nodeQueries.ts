/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MultiSearchSummaryDTO } from "@ndla/types-backend/search-api";
import { Node, NodeChild, NodeSearchBody } from "@ndla/types-backend/taxonomy-api";
import { keyBy } from "@ndla/util";
import { queryOptions, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { NodeTree } from "../../containers/NodeDiff/diffUtils";
import { WithTaxonomyVersion } from "../../interfaces";
import { CHILD_NODES, NODE, NODES, ROOT_NODE_WITH_CHILDREN, SEARCH_NODES } from "../../queryKeys";
import { getContentUriInfo } from "../../util/taxonomyHelpers";
import { NoNodeResultTypes, NoNodeSearchParams } from "../search/searchApiInterfaces";
import { fetchChildNodes, fetchNode, fetchNodes, postSearchNodes } from "./nodeApi";
import { GetChildNodesParams, GetNodesParams, RESOURCE_NODE, TOPIC_NODE } from "./nodeApiTypes";

export const nodeQueryKeys = {
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

// TODO: Let this one sit for a bit. I think we can/should remove the placeholder data, but it's a case by case decision.
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

export const convertContentUrisToSearchParams = (contentUris: string[]): NoNodeSearchParams => {
  const { ids, resultTypes } = getIdsAndResultTypes(contentUris);
  return {
    ids: Array.from(ids),
    resultTypes: Array.from(resultTypes),
    pageSize: ids.size * resultTypes.size,
  };
};

export const extrapolateNodeResourcesFromSearch = (contentUris: string[], results: MultiSearchSummaryDTO[]) => {
  const keyed = keyBy<MultiSearchSummaryDTO, string>(
    results,
    (r) => `urn:${r.learningResourceType === "learningpath" ? "learningpath" : "article"}:${r.id}`,
  );

  return contentUris.reduce<MultiSearchSummaryDTO[]>((acc, curr) => {
    const res = keyed[curr];
    if (!res) return acc;
    acc.push(res);
    return acc;
  }, []);
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
