/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import {
  itemToString,
  downShiftSorter,
  valueFieldForItem,
} from '../downShiftHelpers';

test('util/downShifhtHelpers itemToString', () => {
  expect(itemToString({ name: 'Test Testesen' }, 'name')).toEqual(
    'Test Testesen',
  );
});

test('util/downShiftHelpers itemToString undefined item', () => {
  expect(itemToString(undefined, 'name')).toEqual('');
});

test('util/downShiftHelpers itemToString string item', () => {
  expect(itemToString({ Testesen: 'Testesen' }, 'Testesen')).toEqual(
    'Testesen',
  );
});

test('util/downShiftHelpers downShiftSorter', () => {
  const list = [
    { name: 'Norge' },
    { name: 'Norje' },
    { name: 'NORGE' },
    { name: 'Sweden' },
  ];

  expect(downShiftSorter(list, 'Nor', 'name')).toEqual([
    { name: 'Norge' },
    { name: 'Norje' },
    { name: 'NORGE' },
  ]);

  expect(downShiftSorter(list, 'Norrge', 'name')).toEqual([]);
});

test('util/downShiftHelpers downShiftSorter string items', () => {
  const list = ['Norge', 'Norje', 'NORGE', 'Sweden'];
  expect(downShiftSorter(list, 'Nor')).toEqual(['Norge', 'Norje', 'NORGE']);

  expect(downShiftSorter(list, 'Norrge')).toEqual([]);
});

test('util/valueFieldForItem', () => {
  expect(valueFieldForItem({ idField: 'Test' }, 'idField')).toEqual('Test');
  expect(valueFieldForItem({ idField: 'Test' }, 'test')).toEqual('');
  expect(valueFieldForItem({ idField: 'Test' })).toEqual('');
});

test('util/valueFieldForItem no valueField', () => {
  expect(valueFieldForItem('Test')).toEqual('Test');
});
