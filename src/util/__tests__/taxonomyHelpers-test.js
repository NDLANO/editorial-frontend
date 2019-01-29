/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  flattenResourceTypesAndAddContextTypes,
  sortIntoCreateDeleteUpdate,
  getCurrentTopic,
} from '../taxonomyHelpers';
import {
  resourceTypesMock,
  flattenedResourceTypes,
  filtersMock,
} from './taxonomyMocks';

test('taxonomy/flattenResourceTypesAndAddContextTypes flattening', () => {
  const t = () => 'Emne'
  expect(flattenResourceTypesAndAddContextTypes(resourceTypesMock, t)).toEqual(
    flattenedResourceTypes,
  );
});

test('taxonomy/sortIntoCreateDeleteUpdate different item changes', () => {
  // No changes
  expect(
    sortIntoCreateDeleteUpdate({
      changedItems: [...filtersMock],
      originalItems: [...filtersMock],
    }),
  ).toEqual([[], [], []]);

  // Deleting items
  const keptItem = [
    {
      id: 'urn:filter:203679b7-7312-493c-97a2-5621437fa28e',
      name: 'VG1',
      connectionId: 'urn:resource-filter:0b6c66fe-c86f-4aa4-b5c0-8ebd26a53df4',
      relevanceId: 'urn:relevance:core',
    },
  ];

  expect(
    sortIntoCreateDeleteUpdate({
      changedItems: [...keptItem],
      originalItems: [...filtersMock],
    }),
  ).toEqual([
    [],
    [
      {
        connectionId:
          'urn:resource-filter:314662e7-9a7d-4e02-9a8c-76a8c744b9e7',
        id: 'urn:filter:04b81e41-dc1a-4635-b139-8fe25036ae45',
        name: 'VG2',
        relevanceId: 'urn:relevance:core',
      },
      {
        connectionId:
          'urn:resource-filter:c32f6276-8ff8-439d-ae3c-485e99e9d40a',
        id: 'urn:filter:3b6061e1-b611-47b5-9e48-3346fa7e20c0',
        name: 'VG2-YF',
        relevanceId: 'urn:relevance:core',
      },
    ],
    [],
  ]);

  // Update Item
  const updatedItem = [
    {
      id: 'urn:filter:203679b7-7312-493c-97a2-5621437fa28e',
      name: 'VG1',
      connectionId: 'urn:resource-filter:0b6c66fe-c86f-4aa4-b5c0-8ebd26a53df4',
      relevanceId: 'urn:relevance:supplementary',
    },
    {
      connectionId: 'urn:resource-filter:314662e7-9a7d-4e02-9a8c-76a8c744b9e7',
      id: 'urn:filter:04b81e41-dc1a-4635-b139-8fe25036ae45',
      name: 'VG2',
      relevanceId: 'urn:relevance:core',
    },
    {
      connectionId: 'urn:resource-filter:c32f6276-8ff8-439d-ae3c-485e99e9d40a',
      id: 'urn:filter:3b6061e1-b611-47b5-9e48-3346fa7e20c0',
      name: 'VG2-YF',
      relevanceId: 'urn:relevance:core',
    },
  ];

  expect(
    sortIntoCreateDeleteUpdate({
      changedItems: [...updatedItem],
      originalItems: [...filtersMock],
      updateProperty: 'relevanceId',
    }),
  ).toEqual([
    [],
    [],
    [
      {
        connectionId:
          'urn:resource-filter:0b6c66fe-c86f-4aa4-b5c0-8ebd26a53df4',
        id: 'urn:filter:203679b7-7312-493c-97a2-5621437fa28e',
        name: 'VG1',
        relevanceId: 'urn:relevance:supplementary',
      },
    ],
  ]);

  // Create Item
  const createNewItem = [
    {
      id: 'urn:filter:3ae5a086-8444-43c3-8fa4-db869e7292d2',
      name: 'Medieuttrykk',
      connectionId: 'urn:resource-filter:5e5de687-2412-46dc-b657-c09c1f340c94',
      relevanceId: 'urn:relevance:core',
    },
    {
      id: 'urn:filter:203679b7-7312-493c-97a2-5621437fa28e',
      name: 'VG1',
      connectionId: 'urn:resource-filter:0b6c66fe-c86f-4aa4-b5c0-8ebd26a53df4',
      relevanceId: 'urn:relevance:core',
    },
    {
      connectionId: 'urn:resource-filter:314662e7-9a7d-4e02-9a8c-76a8c744b9e7',
      id: 'urn:filter:04b81e41-dc1a-4635-b139-8fe25036ae45',
      name: 'VG2',
      relevanceId: 'urn:relevance:core',
    },
    {
      connectionId: 'urn:resource-filter:c32f6276-8ff8-439d-ae3c-485e99e9d40a',
      id: 'urn:filter:3b6061e1-b611-47b5-9e48-3346fa7e20c0',
      name: 'VG2-YF',
      relevanceId: 'urn:relevance:core',
    },
  ];

  expect(
    sortIntoCreateDeleteUpdate({
      changedItems: [...createNewItem],
      originalItems: [...filtersMock],
    }),
  ).toEqual([
    [
      {
        connectionId:
          'urn:resource-filter:5e5de687-2412-46dc-b657-c09c1f340c94',
        id: 'urn:filter:3ae5a086-8444-43c3-8fa4-db869e7292d2',
        name: 'Medieuttrykk',
        relevanceId: 'urn:relevance:core',
      },
    ],
    [],
    [],
  ]);
});

test('getCurrentTopic', () => {
  const input = [
    { params: { topic1: 'topic1' } },
    { params: { topic1: 'topic1' }, subject: {} },
    { params: { topic1: 'topic1' }, subject: { topics: [{ id: 'topic1' }] } },
    {
      params: { topic1: 'topic1', topic2: 'topic2' },
      subject: { topics: [{ id: 'topic1', subtopics: [{ id: 'topic2' }] }] },
    },
    {
      params: { topic1: 'topic1', topic2: 'topic99' },
      subject: { topics: [{ id: 'topic1', subtopics: [{ id: 'topic2' }] }] },
    },
  ];

  const output = [{}, {}, { id: 'topic1' }, { id: 'topic2' }, undefined];

  input.forEach((variables, i) => {
    expect(getCurrentTopic(variables)).toEqual(output[i]);
  });
});
