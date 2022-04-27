import { diffField, DiffResult, diffTrees } from '../diffUtils';
import {
  nodeTreeInOriginalVersionDiff,
  nodeTreeInOtherVersionDiff,
  nodeTreeWithDirectChildren,
  nodeTreeWithDirectChildrenDiff,
  nodeTreeWithDirectChildrenUpdated,
  nodeTreeWithNestedChildren,
  nodeTreeWithNestedChildrenDiff,
  nodeTreeWithNestedChildrenUpdated,
  nodeTreeWithNoChildren,
  nodeTreeWithNoChildrenDiff,
  nodeTreeWithNoChildrenUpdated,
} from './diffTestData';

describe('diffField', () => {
  test('considers two equal fields to be equal', () => {
    const expected: DiffResult<string> = {
      diffType: 'NONE',
      original: 'tester',
      other: 'tester',
    };
    const res = diffField('tester', 'tester', undefined);
    expect(res).toEqual(expected);
  });

  test('considers two different fields to not be equal', () => {
    const expected: DiffResult<string> = {
      diffType: 'MODIFIED',
      original: 'tester',
      other: 'tester2',
    };
    const res = diffField('tester', 'tester2', undefined);
    expect(res).toEqual(expected);
  });

  test('considers a field to be added if only present in other', () => {
    const expected: DiffResult<number> = {
      diffType: 'ADDED',
      original: undefined,
      other: 3,
    };
    const res = diffField(undefined, 3, undefined);
    expect(res).toEqual(expected);

    const expected2: DiffResult<number> = {
      diffType: 'ADDED',
      original: null,
      other: 3,
    };
    const res2 = diffField(null, 3, undefined);
    expect(res2).toEqual(expected2);
  });

  test('considers a field to be deleted if only present in original', () => {
    const expected: DiffResult<number[]> = {
      diffType: 'DELETED',
      original: [1, 2, 3],
      other: undefined,
    };
    const res = diffField([1, 2, 3], undefined, undefined);
    expect(res).toEqual(expected);

    const expected2: DiffResult<number[]> = {
      diffType: 'DELETED',
      original: [1, 2, 3],
      other: null,
    };
    const res2 = diffField([1, 2, 3], null, undefined);
    expect(res2).toEqual(expected2);
  });

  test('correctly identifies a modified array', () => {
    const expected: DiffResult<number[]> = {
      diffType: 'MODIFIED',
      original: [1, 2, 3],
      other: [1, 2, 3, 4],
    };
    const res = diffField([1, 2, 3], [1, 2, 3, 4], undefined);
    expect(res).toEqual(expected);
  });

  test('correctly handles boolean values', () => {
    const falseOriginalExpected: DiffResult<boolean> = {
      diffType: 'MODIFIED',
      original: false,
      other: true,
    };
    const res = diffField(false, true, undefined);
    expect(res).toEqual(falseOriginalExpected);

    const trueOriginalExpected: DiffResult<boolean> = {
      diffType: 'MODIFIED',
      original: true,
      other: false,
    };
    const res2 = diffField(true, false, undefined);
    expect(res2).toEqual(trueOriginalExpected);
  });

  test('considers null and undefined to be equal', () => {
    const expected1: DiffResult<number[]> = {
      diffType: 'NONE',
      original: undefined,
      other: null,
    };
    const res1 = diffField(undefined, null, undefined);
    expect(res1).toEqual(expected1);

    const expected2: DiffResult<number[]> = {
      diffType: 'NONE',
      original: null,
      other: undefined,
    };
    const res2 = diffField(null, undefined, undefined);
    expect(res2).toEqual(expected2);
  });
});

describe('diffTrees', () => {
  test('correctly diffs trees with only root', () => {
    const original = nodeTreeWithNoChildren;
    const other = nodeTreeWithNoChildrenUpdated;
    const expected = nodeTreeWithNoChildrenDiff;
    const res = diffTrees(original, other, 'flat');
    expect(res).toEqual(expected);
  });

  test('correctly diffs direct children', () => {
    const original = nodeTreeWithDirectChildren;
    const other = nodeTreeWithDirectChildrenUpdated;
    const expected = nodeTreeWithDirectChildrenDiff;
    const res = diffTrees(original, other, 'tree');
    expect(res).toEqual(expected);
  });

  test('correctly diffs nested children', () => {
    const original = nodeTreeWithNestedChildren;
    const other = nodeTreeWithNestedChildrenUpdated;
    const expected = nodeTreeWithNestedChildrenDiff;
    const res = diffTrees(original, other, 'tree');
    expect(res).toEqual(expected);
  });

  test('correctly diffs original tree if other tree does not exist', () => {
    const original = nodeTreeWithNoChildren;
    const expected = nodeTreeInOriginalVersionDiff;
    const res = diffTrees(original, undefined, 'tree');
    expect(res).toEqual(expected);
  });

  test('correcly diffs other tree if original tree does not exist', () => {
    const other = nodeTreeWithNoChildren;
    const expected = nodeTreeInOtherVersionDiff;
    const res = diffTrees(undefined, other, 'tree');
    expect(res).toEqual(expected);
  });
});
