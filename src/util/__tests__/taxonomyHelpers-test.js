/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  flattenResourceTypesAndAddContextTypes,
  pathToUrnArray,
} from '../taxonomyHelpers';
import { resourceTypesMock, flattenedResourceTypes } from './taxonomyMocks';

test('taxonomy/flattenResourceTypesAndAddContextTypes flattening', () => {
  const types = {
    'contextTypes.topic': 'Emne',
    'contextTypes.frontpage': 'Forsideartikkel',
  };
  const t = (key) => types[key];
  expect(flattenResourceTypesAndAddContextTypes(resourceTypesMock, t)).toEqual(
    flattenedResourceTypes,
  );
});

test('pathToUrnArray', () => {
  const array = pathToUrnArray('/bla/blabla');
  array.forEach((path) => {
    expect(path.startsWith('urn:')).toBe(true);
  });
});
