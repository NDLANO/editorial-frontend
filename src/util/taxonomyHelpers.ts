/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { groupBy, merge, sortBy, uniqBy } from "lodash-es";
import { NodeChild, ResourceType } from "@ndla/types-taxonomy";
import { getContentTypeFromResourceTypes } from "./resourceHelpers";
import { RESOURCE_TYPE_LEARNING_PATH } from "../constants";
import { FlattenedResourceType } from "../interfaces";
import { NodeChildWithChildren, ResourceWithNodeConnectionAndMeta } from "../modules/nodes/nodeApiTypes";

// Kan hende at id i contentUri fra taxonomy inneholder '#xxx' (revision)
export const getIdFromUrn = (urn?: string) => {
  if (!urn) return;
  const [, , id] = urn.split(":");
  const idWithoutRevision = parseInt(id.split("#")[0]);
  return idWithoutRevision;
};

const flattenResourceTypesAndAddContextTypes = (data: ResourceType[] = [], t: (key: string) => string) => {
  const resourceTypes: FlattenedResourceType[] = [];
  data.forEach((type) => {
    if (type.subtypes) {
      type.subtypes.forEach((subtype) =>
        resourceTypes.push({
          typeName: type.name,
          typeId: type.id,
          name: subtype.name,
          id: subtype.id,
        }),
      );
    } else if (type.id !== RESOURCE_TYPE_LEARNING_PATH) {
      resourceTypes.push({
        name: type.name,
        id: type.id,
      });
    }
  });
  resourceTypes.push({ name: t("contextTypes.learningpath"), id: "learningpath" });
  resourceTypes.push({ name: t("contextTypes.topic"), id: "topic-article" });
  resourceTypes.push({
    name: t("contextTypes.frontpage"),
    id: "frontpage-article",
  });
  resourceTypes.push({ name: t("contextTypes.concept"), id: "concept" });
  resourceTypes.push({ name: t("contextTypes.gloss"), id: "gloss" });
  return resourceTypes;
};

export const groupResourcesByType = (resources: ResourceWithNodeConnectionAndMeta[], resourceTypes: ResourceType[]) => {
  const types = resourceTypes.reduce<Record<string, string>>((types, rt) => {
    const reversedMapping =
      rt.subtypes?.reduce<Record<string, string>>((acc, curr) => {
        acc[curr.id] = rt.id;
        return acc;
      }, {}) ?? {};
    reversedMapping[rt.id] = rt.id;
    return merge(types, reversedMapping);
  }, {});

  const typeToResourcesMapping = resources
    .flatMap((res) => res.resourceTypes.map<[string, ResourceWithNodeConnectionAndMeta]>((rt) => [rt.id, res]))
    .reduce<
      Record<
        string,
        {
          parentId: string;
          resources: ResourceWithNodeConnectionAndMeta[];
        }
      >
    >((acc, [id, curr]) => {
      if (acc[id]) {
        acc[id]["resources"] = acc[id]["resources"].concat(curr);
      } else {
        acc[id] = {
          parentId: types[id],
          resources: [curr],
        };
      }
      return acc;
    }, {});

  const groupedValues = groupBy(Object.values(typeToResourcesMapping), (t) => t.parentId);

  const unique = Object.entries(groupedValues).reduce<Record<string, ResourceWithNodeConnectionAndMeta[]>>(
    (acc, [id, val]) => {
      const uniqueValues = uniqBy(
        val.flatMap((v) => v.resources),
        (r) => r.id,
      );

      acc[id] = uniqueValues;
      return acc;
    },
    {},
  );

  return resourceTypes
    .map((rt) => ({
      ...rt,
      resources: sortBy(unique[rt.id], (res) => res.rank) ?? [],
      contentType: getContentTypeFromResourceTypes([rt]),
    }))
    .filter((rt) => rt.resources.length > 0);
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

export { groupChildNodes, flattenResourceTypesAndAddContextTypes };
