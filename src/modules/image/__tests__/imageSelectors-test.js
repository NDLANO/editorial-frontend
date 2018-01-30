/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getImage, getSaving } from '../image';
import { image } from './mockImages';

const state = {
  locale: 'nb',
  images: {
    isSaving: true,
    all: {
      [image.id]: image,
      2: {
        id: '2',
        title: { title: 'Testing', language: 'en' },
        tags: {
          tags: [],
        },
        alttext: {
          alttext: '',
        },
        caption: {
          caption: '',
        },
      },
      3: {
        id: '3',
        title: { title: 'Tester', language: 'nb' },
        tags: {
          tags: [],
        },
        alttext: {
          alttext: '',
        },
        caption: {
          caption: '',
        },
      },
    },
  },
};

test('imageSelectors getSaving', () => {
  expect(getSaving(state)).toBe(true);
});

test('articleSelectors getImage with id', () => {
  expect(getImage(1)(state).id).toBe(1);
  expect(getImage(2)(state).id).toBe(2);
  expect(getImage(3)(state).id).toBe(3);
});
