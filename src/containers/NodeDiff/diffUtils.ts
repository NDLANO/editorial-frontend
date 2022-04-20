/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isEqual, partition } from 'lodash';
import { isObjectLike } from 'lodash/fp';
import { ChildNodeType, NodeType } from '../../modules/nodes/nodeApiTypes';

export type DiffResultType = 'NONE' | 'MODIFIED' | 'ADDED' | 'DELETED';
export interface DiffResult<TType> {
  original?: TType;
  other?: TType;
  diffType: DiffResultType;
}

export type DiffType<T> = {
  [key in keyof T]: T[key] extends Array<infer ArrType>
    ? DiffResult<ArrType[]>
    : T[key] extends object
    ? DiffType<T[key]>
    : DiffResult<T[key]>;
} & { changed: DiffResult<null>; childrenChanged?: DiffResult<null> };

export interface RootNodeWithChildren extends NodeType {
  children: ChildNodeType[];
}

type TagType = 'original' | 'other';

interface NodeWithTag {
  node: ChildNodeType;
  tag: TagType;
}

interface NodeGrouping<T extends NodeType = NodeType> {
  original?: T;
  other?: T;
}

export interface DiffTypeWithChildren extends DiffType<ChildNodeType> {
  children?: DiffTypeWithChildren[];
}

const diffAndGroupChildren = <T extends NodeType = NodeType>(
  parentNode: NodeGrouping<T>,
  remainingChildren: NodeGrouping<ChildNodeType>[],
): DiffTypeWithChildren[] => {
  const [children, other] = partition(remainingChildren, child => {
    const parent = child.original?.parent ?? child.other?.parent;
    const parentId = parentNode.original?.id ?? parentNode.other?.id;
    return !!parent && parent === parentId;
  });
  return children.map(child => {
    const diff = diffObject(child.original, child.other);
    const diffedChildren = diffAndGroupChildren(child, other);
    const childrenDiffType = diffedChildren.some(
      child => child.changed.diffType !== 'NONE' || child.childrenChanged?.diffType !== 'NONE',
    )
      ? 'MODIFIED'
      : 'NONE';

    return { ...diff, children: diffedChildren, childrenChanged: { diffType: childrenDiffType } };
  });
};

const diffChildren = (
  rootDiff: NodeGrouping<NodeType>,
  children: NodeGrouping<ChildNodeType>[],
  viewType: 'flat' | 'tree',
): DiffTypeWithChildren[] => {
  if (viewType === 'flat') {
    return children.map(child => ({
      ...diffObject(child.original, child.other),
      childrenChanged: { diffType: 'NONE' },
    }));
  } else return diffAndGroupChildren(rootDiff, children);
};

export interface DiffTree {
  root: DiffType<NodeType>;
  children: DiffTypeWithChildren[];
}

export const diffTrees = (
  originalTree: RootNodeWithChildren,
  otherTree: RootNodeWithChildren,
  viewType: 'flat' | 'tree',
): DiffTree => {
  const { children: originalChildren, ...originalRoot } = originalTree;
  const { children: otherChildren, ...otherRoot } = otherTree;
  const originals: NodeWithTag[] = originalChildren.map(node => ({ node, tag: 'original' }));
  const others: NodeWithTag[] = otherChildren.map(node => ({ node, tag: 'other' }));
  const allChildren = originals.concat(others);
  const grouping = allChildren.reduce<Record<string, NodeGrouping<ChildNodeType>>>((acc, curr) => {
    // The root node is returned from the recursive endpoint as well, filter it out.
    if (curr.node.id === originalTree.id || curr.node.id === otherTree.id) {
      return acc;
    }
    if (acc[curr.node.id]) {
      acc[curr.node.id][curr.tag] = curr.node;
    } else {
      acc[curr.node.id] = {
        [curr.tag]: curr.node,
      };
    }
    return acc;
  }, {});

  const rootDiff = diffObject(originalRoot, otherRoot);
  const childrenDiff = diffChildren(
    { original: originalRoot, other: otherRoot },
    Object.values(grouping),
    viewType,
  );
  const childrenChanged: DiffResult<null> = childrenDiff.some(
    child => child.childrenChanged?.diffType !== 'NONE' || child.changed.diffType !== 'NONE',
  )
    ? { diffType: 'MODIFIED' }
    : { diffType: 'NONE' };

  return {
    root: {
      ...rootDiff,
      childrenChanged,
    },
    children: childrenDiff,
  };
};

const isObject = <T>(original: T | undefined, other: T | undefined) => {
  return isObjectLike(original) || isObjectLike(other);
};

const diffObject = <T>(original: T | undefined, other: T | undefined): DiffType<T> => {
  let hasChanged = false;
  const objDiff = diffField(original, other, undefined, true);
  const allKeys = Object.keys({ ...original, ...other }) as Array<keyof T>;
  const test = allKeys.reduce<Record<keyof T, any>>((acc, key) => {
    if (Array.isArray(original?.[key]) || Array.isArray(other?.[key])) {
      const res = diffField(original?.[key], other?.[key], objDiff.diffType);
      if (res.diffType !== 'NONE') {
        hasChanged = true;
      }
      acc[key] = res;
    } else if (isObject(original?.[key], other?.[key])) {
      const res = diffObject(original?.[key], other?.[key]);
      if (res.changed.diffType !== 'NONE') {
        hasChanged = true;
      }
      acc[key] = res;
    } else {
      const res = diffField(original?.[key], other?.[key], objDiff.diffType);
      if (res.diffType !== 'NONE') {
        hasChanged = true;
      }
      acc[key] = res;
    }
    return acc;
    //@ts-ignore
  }, {});
  return {
    //@ts-ignore
    ...test,
    changed: {
      diffType: !hasChanged && objDiff.diffType === 'MODIFIED' ? 'NONE' : objDiff.diffType,
    },
  } as DiffType<T>;
};

export const diffField = <T>(
  original: T | undefined,
  other: T | undefined,
  parentDiff: DiffResultType | undefined,
  skipEqualityCheck?: boolean,
): DiffResult<T> => {
  if (parentDiff === 'ADDED' || parentDiff === 'DELETED') {
    return { diffType: parentDiff, original, other };
  }
  if (original == null && other != null) {
    return { diffType: 'ADDED', original, other };
  } else if (original != null && other == null) {
    return { diffType: 'DELETED', original, other };
    // Skip equality check for cheap diffType in diffObject.
  } else if (
    !skipEqualityCheck &&
    (isEqual(original, other) || (original == null && other == null))
  ) {
    return { diffType: 'NONE', original, other };
  } else {
    return { diffType: 'MODIFIED', original, other };
  }
};

export const removeUnchangedFromTree = (nodes: DiffTypeWithChildren[]): DiffTypeWithChildren[] => {
  if (!nodes.length) {
    return [];
  }
  const mutatedChildren = nodes.filter(
    node => node.changed.diffType !== 'NONE' || node.childrenChanged?.diffType !== 'NONE',
  );
  return mutatedChildren.map(node => ({
    ...node,
    children: removeUnchangedFromTree(node.children ?? []),
  }));
};

export const removeType = <T>(diff: DiffType<T>, type: DiffResultType): Partial<DiffType<T>> => {
  return Object.entries(diff)
    .filter(([, entry]) => entry?.diffType !== type) //entry is either nested object or difftype
    .reduce<Partial<DiffType<T>>>((acc, [key, entry]) => {
      if (Array.isArray(entry) || (entry && 'diffType' in entry)) {
        //@ts-ignore
        acc[key] = entry;
      } else {
        //@ts-ignore
        acc[key] = removeType(entry, type);
      }
      return acc;
    }, {});
};
