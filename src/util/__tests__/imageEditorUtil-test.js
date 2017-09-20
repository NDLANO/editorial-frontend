/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getFocalPoint, getCrop, getSrcSets } from '../imageEditorUtil';

test('util/getFocalPoint returns focal point string', () => {
  expect(typeof getFocalPoint).toBe('function');
  const transformData = {
    'focal-x': 30,
    'focal-y': 40,
  };
  expect(getFocalPoint(transformData)).toBe('focalX=30&focalY=40');
});

test('util/getFocalPoint returns focal point string even if focal x is 0', () => {
  expect(typeof getFocalPoint).toBe('function');
  const transformData = {
    'focal-x': 0,
    'focal-y': 40,
  };
  expect(getFocalPoint(transformData)).toBe('focalX=0&focalY=40');
});

test('util/getFocalPoint returns undefined if missing transform data', () => {
  expect(typeof getFocalPoint).toBe('function');
  const transformData = {
    'focal-y': 40,
  };
  expect(getFocalPoint(transformData)).toBe(undefined);
  expect(getFocalPoint({})).toBe(undefined);
});

test('util/getCrop returns crop string', () => {
  expect(typeof getCrop).toBe('function');
  const transformData = {
    'upper-left-x': 30,
    'upper-left-y': 40,
    'lower-right-x': 50,
    'lower-right-y': 60,
  };
  expect(getCrop(transformData)).toBe(
    'cropStartX=30&cropStartY=40&cropEndX=50&cropEndY=60',
  );
});

test('util/getCrop returns crop string even if crop start x is 0', () => {
  expect(typeof getCrop).toBe('function');
  const transformData = {
    'upper-left-x': 0,
    'upper-left-y': 40,
    'lower-right-x': 50,
    'lower-right-y': 60,
  };
  expect(getCrop(transformData)).toBe(
    'cropStartX=0&cropStartY=40&cropEndX=50&cropEndY=60',
  );
});

test('util/getCrop returns undefined if missing transform data', () => {
  expect(typeof getFocalPoint).toBe('function');
  const transformData = {
    'upper-left-x': 0,
    'upper-left-y': 40,
    'lower-right-x': 50,
  };

  expect(getCrop(transformData)).toBe(undefined);
  expect(getCrop({})).toBe(undefined);
});

test('util/getSrcSets only crop', () => {
  expect(typeof getSrcSets).toBe('function');
  const transformData = {
    'upper-left-x': 30,
    'upper-left-y': 40,
    'lower-right-x': 50,
    'lower-right-y': 60,
  };
  expect(getSrcSets(3, transformData)).toMatchSnapshot();
});

test('util/getSrcSets only focalpoint', () => {
  expect(typeof getSrcSets).toBe('function');
  const transformData = {
    'focal-x': 30,
    'focal-y': 40,
  };
  expect(getSrcSets(3, transformData)).toMatchSnapshot();
});

test('util/getSrcSets crop and focal point', () => {
  expect(typeof getSrcSets).toBe('function');
  const transformData = {
    'upper-left-x': 30,
    'upper-left-y': 40,
    'lower-right-x': 50,
    'lower-right-y': 60,
    'focal-x': 30,
    'focal-y': 40,
  };
  expect(getSrcSets(3, transformData)).toMatchSnapshot();
});

test('util/getSrcSets without transformData', () => {
  expect(typeof getSrcSets).toBe('function');

  expect(getSrcSets(3, {})).toMatchSnapshot();
});
