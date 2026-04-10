/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { NodeChild, ResourceType } from "@ndla/types-taxonomy";
import { partition, sortBy, uniqBy } from "@ndla/util";
import { RESOURCE_FILTER_SUPPLEMENTARY, RESOURCE_TYPE_LEARNING_PATH } from "../constants";
import { ContentUriInfo } from "../interfaces";
import { NodeChildWithChildren } from "../modules/nodes/nodeApiTypes";

// Kan hende at id i contentUri fra taxonomy inneholder '#xxx' (revision)
export const getContentUriInfo = (urn?: string): ContentUriInfo | undefined => {
  if (!urn) return undefined;
  const [, type, id] = urn.split(":");
  const idWithoutRevision = parseInt(id.split("#")[0]);
  return { type, id: idWithoutRevision, contentUri: urn };
};

type ResourceLike = Pick<NodeChild, "id" | "resourceTypes" | "rank" | "relevanceId">;
export const sortResources = <T extends ResourceLike>(
  resources: T[],
  resourceTypes: ResourceType[],
  grouped?: boolean,
) => {
  const uniq = uniqBy(resources, (res) => res.id);
  const sortedByRank = sortBy(uniq, (res) => res.rank ?? res.id);
  if (!grouped) {
    return sortedByRank;
  }
  const resourceTypeOrder = resourceTypes.reduce<Record<string, number>>((order, rt, index) => {
    order[rt.id] = index;
    return order;
  }, {});
  return sortBy(uniq, (res) => resourceTypeOrder[res.resourceTypes?.[0]?.id ?? ""] ?? Number.MAX_SAFE_INTEGER);
};

interface PartitionedResources<T> {
  learningpaths: T[];
  supplementaryArticles: T[];
  coreArticles: T[];
}

export const partitionResources = (
  resources: NodeChild[],
  resourceTypes: ResourceType[],
  ungrouped: boolean,
): PartitionedResources<NodeChild> => {
  const sortedResources = sortResources(resources, resourceTypes ?? [], !ungrouped);

  const [learningpaths, articles] = partition(
    sortedResources,
    (res) => !!res.resourceTypes?.some((type) => type.id === RESOURCE_TYPE_LEARNING_PATH),
  );

  const [supplementaryArticles, coreArticles] = partition(
    articles,
    (a) => a.relevanceId === RESOURCE_FILTER_SUPPLEMENTARY,
  );

  return {
    learningpaths,
    supplementaryArticles,
    coreArticles,
  };
};

export const safeConcat = <T>(toAdd: T, existing?: T[]) => (existing ? existing.concat(toAdd) : [toAdd]);

const insertChild = (
  childNodes: NodeChildWithChildren[],
  childNode: NodeChildWithChildren,
): NodeChildWithChildren[] => {
  return childNodes.map((node) => {
    if (node.id === childNode.parentId) {
      return { ...node, childNodes: safeConcat(childNode, node.childNodes) };
    }
    if (node.childNodes) {
      return { ...node, childNodes: insertChild(node.childNodes, childNode) };
    }
    return node;
  });
};

const parentIsRoot = (node: NodeChild) => node.path?.startsWith(node.parentId.replace("urn:", "/"));

const groupChildNodes = (childNodes: NodeChild[]): NodeChildWithChildren[] =>
  childNodes.reduce((acc, curr) => {
    if (parentIsRoot(curr)) return acc;
    const withoutCurrent = acc.filter((node) => node.id !== curr.id);
    return insertChild(withoutCurrent, curr);
  }, childNodes);

export const nodePathToUrnPath = (path?: string) => path?.replace(/\//g, "/urn:")?.substring(1);

export { groupChildNodes };
