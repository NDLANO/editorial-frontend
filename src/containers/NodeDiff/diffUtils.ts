/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import isObjectLike from "lodash/fp/isObjectLike";
import isEqual from "lodash/isEqual";
import partition from "lodash/partition";
import { NodeChild, Node } from "@ndla/types-taxonomy";

export type DiffResultType = "NONE" | "MODIFIED" | "ADDED" | "DELETED";
export interface DiffResult<TType> {
  original?: TType;
  other?: TType;
  diffType: DiffResultType;
  ignored?: boolean;
}

export type DiffType<T> = {
  [key in keyof T]: T[key] extends Array<infer ArrType>
    ? DiffResult<ArrType[]>
    : T[key] extends object
      ? DiffType<T[key]>
      : DiffResult<T[key]>;
} & {
  changed: DiffResult<null>;
  childrenChanged?: DiffResult<null>;
  resourcesChanged?: DiffResult<null>;
};

type Keys<T> = {
  [key in keyof T]: T[key] extends Array<any> ? boolean : T[key] extends object ? Partial<Keys<T[key]>> : boolean;
};

type SkipKeys<T> = Partial<Keys<T>>;

export interface NodeTree {
  root: NodeTypeWithResources | ChildNodeTypeWithResources;
  children: ChildNodeTypeWithResources[];
}

export interface NodeTypeWithResources extends Node {
  resources: NodeChild[];
}

export interface ChildNodeTypeWithResources extends NodeChild {
  resources: NodeChild[];
}

type TagType = "original" | "other";

interface TagGrouping<T> {
  value: T;
  tag: TagType;
}

interface Grouping<T> {
  original?: T;
  other?: T;
}

export interface DiffTypeWithChildren extends DiffType<Omit<NodeChild, "resources">> {
  children?: DiffTypeWithChildren[];
  resources?: DiffType<NodeChild>[];
}

export interface RootDiffType extends DiffType<Omit<NodeTypeWithResources, "resources">> {
  resources?: DiffType<NodeChild>[];
}

const diffAndGroupChildren = <T extends Node = Node>(
  parentNode: Grouping<T>,
  remainingChildren: Grouping<ChildNodeTypeWithResources>[],
): DiffTypeWithChildren[] => {
  const [children, other] = partition(remainingChildren, (child) => {
    const parent = child.original?.parentId ?? child.other?.parentId;
    const parentId = parentNode.original?.id ?? parentNode.other?.id;
    return !!parent && parent === parentId;
  });
  return children.map((child) => {
    const diff = diffObject(child.original, child.other, {
      path: true,
      paths: true,
      resources: true,
      contexts: true,
      breadcrumbs: true,
      language: true,
      metadata: {
        customFields: {},
      },
    });
    const resourcesDiff = doDiff(
      child.original?.resources,
      child.other?.resources,
      {
        path: true,
        paths: true,
        contexts: true,
        breadcrumbs: true,
        language: true,
      },
      "id",
    );
    const diffedChildren = diffAndGroupChildren(child, other);
    const childrenDiffType = diffedChildren.some(
      (child) =>
        child.changed.diffType !== "NONE" ||
        child.childrenChanged?.diffType !== "NONE" ||
        child.resourcesChanged?.diffType !== "NONE",
    );

    return {
      ...diff,
      resources: resourcesDiff.diff,
      resourcesChanged: resourcesDiff.changed,
      children: diffedChildren,
      childrenChanged: { diffType: childrenDiffType ? "MODIFIED" : "NONE" },
    };
  });
};

interface DoDiffResult<T> {
  diff: DiffType<T>[];
  changed: DiffResult<null>;
}

export const doDiff = <T extends object, ID extends keyof T & string>(
  original: T[] | undefined,
  other: T[] | undefined,
  skipFields: SkipKeys<T>,
  identifier: ID,
): DoDiffResult<T> => {
  const grouped = createTagGroupings(original ?? [], other ?? [], identifier);
  const diff = Object.values(grouped).map((val) => diffObject(val.original, val.other, skipFields));
  const changed = diff.some((v) => v.changed.diffType !== "NONE");
  return { diff, changed: { diffType: changed ? "MODIFIED" : "NONE" } };
};

const createTagGroupings = <Value extends object, Identifier extends keyof Value & string>(
  original: Value[],
  other: Value[],
  identifier: Identifier,
): Record<string, Grouping<Value>> => {
  const originalValues: TagGrouping<Value>[] = original.map((value) => ({
    value,
    tag: "original",
  }));
  const otherValues: TagGrouping<Value>[] = other.map((value) => ({
    value,
    tag: "other",
  }));
  const allChildren = originalValues.concat(otherValues);
  return allChildren.reduce<Record<string, Grouping<Value>>>((acc, curr) => {
    //@ts-expect-error - Typing this is too hard
    if (acc[curr.value[identifier]]) {
      //@ts-expect-error - Typing this is too hard
      acc[curr.value[identifier]][curr.tag] = curr.value;
    } else {
      //@ts-expect-error - Typing this is too hard
      acc[curr.value[identifier]] = { [curr.tag]: curr.value };
    }
    return acc;
  }, {});
};

const diffChildren = (
  rootDiff: Grouping<Node>,
  children: Grouping<ChildNodeTypeWithResources>[],
  viewType: "flat" | "tree",
): DiffTypeWithChildren[] => {
  if (viewType === "flat") {
    return children.map((child) => {
      const { original, other } = child;
      const diffedResources = doDiff(
        original?.resources,
        other?.resources,
        {
          path: true,
          paths: true,
          contexts: true,
          breadcrumbs: true,
          language: true,
        },
        "id",
      );
      return {
        ...diffObject(original, other, {
          path: true,
          paths: true,
          resources: true,
          contexts: true,
          language: true,
          metadata: {
            customFields: {},
          },
        }),
        resources: diffedResources.diff,
        resourcesChanged: diffedResources.changed,
        childrenChanged: { diffType: "NONE" },
      };
    });
  } else return diffAndGroupChildren(rootDiff, children);
};

export interface DiffTree {
  root: RootDiffType | Omit<DiffTypeWithChildren, "children">;
  children: DiffTypeWithChildren[];
}

export const diffTrees = (
  originalTree: NodeTree | undefined,
  otherTree: NodeTree | undefined,
  viewType: "flat" | "tree",
): DiffTree => {
  // The root node is returned from the recursive endpoint as well, filter it out.
  const originalChildren = originalTree?.children.filter((c) => c.id !== originalTree.root.id) ?? [];
  const originalRoot = originalTree?.root;
  const otherChildren = otherTree?.children.filter((c) => c.id !== otherTree.root.id) ?? [];
  const otherRoot = otherTree?.root;
  const grouping = createTagGroupings(originalChildren, otherChildren, "id");

  const rootDiff = diffObject(originalRoot, otherRoot, {
    path: true,
    paths: true,
    resources: true,
    contexts: true,
    breadcrumbs: true,
    language: true,
    metadata: {
      customFields: {},
    },
  });
  const rootResourcesDiff = doDiff(
    originalRoot?.resources,
    otherRoot?.resources,
    {
      path: true,
      paths: true,
      contexts: true,
      breadcrumbs: true,
      language: true,
    },
    "id",
  );
  const childrenDiff = diffChildren({ original: originalRoot, other: otherRoot }, Object.values(grouping), viewType);
  const childrenChanged = childrenDiff.some(
    (child) =>
      child.childrenChanged?.diffType !== "NONE" ||
      child.changed.diffType !== "NONE" ||
      child.resourcesChanged?.diffType !== "NONE",
  );

  return {
    root: {
      ...rootDiff,
      resources: rootResourcesDiff.diff,
      resourcesChanged: rootResourcesDiff.changed,
      childrenChanged: { diffType: childrenChanged ? "MODIFIED" : "NONE" },
    },
    children: childrenDiff,
  };
};

const isObject = <T>(original: T | undefined, other: T | undefined) => {
  return isObjectLike(original) || isObjectLike(other);
};

export const diffObject = <T>(original: T | undefined, other: T | undefined, skipFields?: SkipKeys<T>): DiffType<T> => {
  let hasChanged = false;
  const objDiff = diffField(original, other, undefined, true);
  const allKeys = Object.keys({ ...original, ...other }) as Array<keyof T>;
  const test = allKeys.reduce<Record<keyof T, any>>((acc, key) => {
    if (typeof skipFields?.[key] === "boolean") {
      acc[key] = {
        original: original?.[key],
        other: other?.[key],
        diffType: objDiff.diffType !== "MODIFIED" ? objDiff.diffType : "NONE",
        ignored: true,
      };
      return acc;
    }
    if (Array.isArray(original?.[key]) || Array.isArray(other?.[key])) {
      const res = diffField(original?.[key], other?.[key], objDiff.diffType);
      if (res.diffType !== "NONE") {
        hasChanged = true;
      }
      acc[key] = res;
    } else if (isObject(original?.[key], other?.[key])) {
      //@ts-expect-error - Typing this is too hard
      const res = diffObject(original?.[key], other?.[key], skipFields?.[key]);
      if (res.changed.diffType !== "NONE") {
        hasChanged = true;
      }
      acc[key] = res;
    } else {
      const res = diffField(original?.[key], other?.[key], objDiff.diffType);
      if (res.diffType !== "NONE") {
        hasChanged = true;
      }
      acc[key] = res;
    }
    return acc;
    //@ts-expect-error - Typing this is too hard
  }, {});
  return {
    //@ts-expect-error - Typing this is too hard
    ...test,
    changed: {
      diffType: !hasChanged && objDiff.diffType === "MODIFIED" ? "NONE" : objDiff.diffType,
    },
  } as DiffType<T>;
};

export const diffField = <T>(
  original: T | undefined,
  other: T | undefined,
  parentDiff: DiffResultType | undefined,
  skipEqualityCheck?: boolean,
): DiffResult<T> => {
  if (parentDiff === "ADDED" || parentDiff === "DELETED") {
    return { diffType: parentDiff, original, other };
  }
  if (original == null && other != null) {
    return { diffType: "ADDED", original, other };
  } else if (original != null && other == null) {
    return { diffType: "DELETED", original, other };
    // Skip equality check for cheap diffType in diffObject.
  } else if (!skipEqualityCheck && (isEqual(original, other) || (original == null && other == null))) {
    return { diffType: "NONE", original, other };
  } else {
    return { diffType: "MODIFIED", original, other };
  }
};

export const removeUnchangedFromTree = (nodes: DiffTypeWithChildren[]): DiffTypeWithChildren[] => {
  if (!nodes.length) {
    return [];
  }
  const mutatedChildren = nodes.filter(
    (node) =>
      node.changed.diffType !== "NONE" ||
      node.childrenChanged?.diffType !== "NONE" ||
      node.resourcesChanged?.diffType !== "NONE",
  );
  return mutatedChildren.map((node) => ({
    ...node,
    children: removeUnchangedFromTree(node.children ?? []),
  }));
};

export const removeType = <T>(diff: DiffType<T>, type: DiffResultType): Partial<DiffType<T>> => {
  return Object.entries(diff)
    .filter(([, entry]) => entry?.diffType !== type) //entry is either nested object or difftype
    .reduce<Partial<DiffType<T>>>((acc, [key, entry]) => {
      if (Array.isArray(entry) || (entry && "diffType" in entry)) {
        //@ts-expect-error - Typing this is too hard
        acc[key] = entry;
      } else {
        //@ts-expect-error - Typing this is too hard
        acc[key] = removeType(entry, type);
      }
      return acc;
    }, {});
};
