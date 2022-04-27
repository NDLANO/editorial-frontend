/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isEqual, partition } from 'lodash';
import { isObjectLike } from 'lodash/fp';
import {
  ChildNodeType,
  NodeType,
  ResourceWithNodeConnection,
} from '../../modules/nodes/nodeApiTypes';

export type DiffResultType = 'NONE' | 'MODIFIED' | 'ADDED' | 'DELETED';
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

export interface NodeTree {
  root: NodeType;
  children: ChildNodeTypeWithResources[];
}

export interface ChildNodeTypeWithResources extends ChildNodeType {
  resources: ResourceWithNodeConnection[];
}

type TagType = 'original' | 'other';

interface TagGrouping<T> {
  value: T;
  tag: TagType;
}

interface Grouping<T> {
  original?: T;
  other?: T;
}

export interface DiffTypeWithChildren extends DiffType<Omit<ChildNodeType, 'resources'>> {
  children?: DiffTypeWithChildren[];
  resources?: DiffType<ResourceWithNodeConnection>[];
}

const diffAndGroupChildren = <T extends NodeType = NodeType>(
  parentNode: Grouping<T>,
  remainingChildren: Grouping<ChildNodeTypeWithResources>[],
): DiffTypeWithChildren[] => {
  const [children, other] = partition(remainingChildren, child => {
    const parent = child.original?.parent ?? child.other?.parent;
    const parentId = parentNode.original?.id ?? parentNode.other?.id;
    return !!parent && parent === parentId;
  });
  return children.map(child => {
    const diff = diffObject(child.original, child.other, ['path', 'paths', 'resources']);
    const resourcesDiff = doDiff(child.original?.resources, child.other?.resources, [
      'path',
      'paths',
    ]);
    const diffedChildren = diffAndGroupChildren(child, other);
    const childrenDiffType = diffedChildren.some(
      child =>
        child.changed.diffType !== 'NONE' ||
        child.childrenChanged?.diffType !== 'NONE' ||
        child.resourcesChanged?.diffType !== 'NONE',
    );

    return {
      ...diff,
      resources: resourcesDiff.diff,
      resourcesChanged: resourcesDiff.changed,
      children: diffedChildren,
      childrenChanged: { diffType: childrenDiffType ? 'MODIFIED' : 'NONE' },
    };
  });
};

interface DoDiffResult<T> {
  diff: DiffType<T>[];
  changed: DiffResult<null>;
}

const doDiff = <T extends { id: string }>(
  original: T[] | undefined,
  other: T[] | undefined,
  skipFields: (keyof T)[] = [],
): DoDiffResult<T> => {
  const grouped = createTagGroupings(original ?? [], other ?? []);
  const diff = Object.values(grouped).map(val => diffObject(val.original, val.other, skipFields));
  const changed = diff.some(v => v.changed.diffType !== 'NONE');
  return { diff, changed: { diffType: changed ? 'MODIFIED' : 'NONE' } };
};

const createTagGroupings = <Value extends { id: string }>(
  original: Value[],
  other: Value[],
): Record<string, Grouping<Value>> => {
  const originalValues: TagGrouping<Value>[] = original.map(value => ({ value, tag: 'original' }));
  const otherValues: TagGrouping<Value>[] = other.map(value => ({ value, tag: 'other' }));
  const allChildren = originalValues.concat(otherValues);
  return allChildren.reduce<Record<string, Grouping<Value>>>((acc, curr) => {
    if (acc[curr.value.id]) {
      acc[curr.value.id][curr.tag] = curr.value;
    } else {
      acc[curr.value.id] = { [curr.tag]: curr.value };
    }
    return acc;
  }, {});
};

const diffChildren = (
  rootDiff: Grouping<NodeType>,
  children: Grouping<ChildNodeTypeWithResources>[],
  viewType: 'flat' | 'tree',
): DiffTypeWithChildren[] => {
  if (viewType === 'flat') {
    return children.map(child => {
      const { original, other } = child;
      const diffedResources = doDiff(original?.resources, other?.resources, ['path', 'paths']);
      return {
        ...diffObject(original, other, ['path', 'paths', 'resources']),
        resources: diffedResources.diff,
        resourcesChanged: diffedResources.changed,
        childrenChanged: { diffType: 'NONE' },
      };
    });
  } else return diffAndGroupChildren(rootDiff, children);
};

export interface DiffTree {
  root: DiffType<NodeType>;
  children: DiffTypeWithChildren[];
}

export const diffTrees = (
  originalTree: NodeTree | undefined,
  otherTree: NodeTree | undefined,
  viewType: 'flat' | 'tree',
): DiffTree => {
  // The root node is returned from the recursive endpoint as well, filter it out.
  const originalChildren = originalTree?.children.filter(c => c.id !== originalTree.root.id) ?? [];
  const originalRoot = originalTree?.root;
  const otherChildren = otherTree?.children.filter(c => c.id !== otherTree.root.id) ?? [];
  const otherRoot = otherTree?.root;
  const grouping = createTagGroupings(originalChildren, otherChildren);

  const rootDiff = diffObject(originalRoot, otherRoot, ['path', 'paths']);
  const childrenDiff = diffChildren(
    { original: originalRoot, other: otherRoot },
    Object.values(grouping),
    viewType,
  );
  const childrenChanged = childrenDiff.some(
    child =>
      child.childrenChanged?.diffType !== 'NONE' ||
      child.changed.diffType !== 'NONE' ||
      child.resourcesChanged?.diffType !== 'NONE',
  );

  return {
    root: {
      ...rootDiff,
      childrenChanged: { diffType: childrenChanged ? 'MODIFIED' : 'NONE' },
    },
    children: childrenDiff,
  };
};

const isObject = <T>(original: T | undefined, other: T | undefined) => {
  return isObjectLike(original) || isObjectLike(other);
};

const diffObject = <T>(
  original: T | undefined,
  other: T | undefined,
  skipFields: (keyof T)[] = [],
): DiffType<T> => {
  let hasChanged = false;
  const objDiff = diffField(original, other, undefined, true);
  const allKeys = Object.keys({ ...original, ...other }) as Array<keyof T>;
  const test = allKeys.reduce<Record<keyof T, any>>((acc, key) => {
    if (skipFields.includes(key)) {
      acc[key] = {
        original: original?.[key],
        other: other?.[key],
        diffType: objDiff.diffType !== 'MODIFIED' ? objDiff.diffType : 'NONE',
        ignored: true,
      };
      return acc;
    }
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
    node =>
      node.changed.diffType !== 'NONE' ||
      node.childrenChanged?.diffType !== 'NONE' ||
      node.resourcesChanged?.diffType !== 'NONE',
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
