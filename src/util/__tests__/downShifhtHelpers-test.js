/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import {
  itemToString,
  downShifhtSorter,
  valueFieldForItem,
} from '../downShifhtHelpers';

test('util/downShifhtHelpers itemToString', () => {
  expect(itemToString({ name: 'Test Testesen' }, 'name')).toEqual(
    'Test Testesen',
  );
});

test('util/downShifhtHelpers itemToString undefined item', () => {
  expect(itemToString(undefined, 'name')).toEqual('');
});

test('util/downShifhtHelpers itemToString string item', () => {
  expect(itemToString('Testesen')).toEqual('Testesen');
});

test('util/downShifhtHelpers downShifhtSorter', () => {
  const list = [
    { name: 'Norge' },
    { name: 'Norje' },
    { name: 'NORGE' },
    { name: 'Sweden' },
  ];

  expect(downShifhtSorter(list, 'Nor', 'name')).toEqual([
    { name: 'Norge' },
    { name: 'Norje' },
    { name: 'NORGE' },
  ]);

  expect(downShifhtSorter(list, 'Norrge', 'name')).toEqual([]);
});

test('util/downShifhtHelpers downShifhtSorter string items', () => {
  const list = ['Norge', 'Norje', 'NORGE', 'Sweden'];
  expect(downShifhtSorter(list, 'Nor')).toEqual(['Norge', 'Norje', 'NORGE']);

  expect(downShifhtSorter(list, 'Norrge')).toEqual([]);
});

test('util/valueFieldForItem', () => {
  expect(valueFieldForItem({ idField: 'Test' }, 'idField')).toEqual('Test');
  expect(valueFieldForItem({ idField: 'Test' }, 'test')).toEqual('');
  expect(valueFieldForItem({ idField: 'Test' })).toEqual('');
});

test('util/valueFieldForItem no valueField', () => {
  expect(valueFieldForItem('Test')).toEqual('Test');
});
