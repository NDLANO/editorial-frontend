/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getAudio, getSaving } from '../audio';
import { audio } from './mockAudios';

const state = {
  locale: 'nb',
  audios: {
    isSaving: true,
    all: {
      [audio.id]: audio,
      2: {
        id: '2',
        title: { title: 'Testing', language: 'en' },
        tags: {
          tags: [],
        },
      },
      3: {
        id: '3',
        title: { title: 'Tester', language: 'nb' },
        tags: {
          tags: [],
        },
      },
    },
  },
};

test('audioSelectors getSaving', () => {
  expect(getSaving(state)).toBe(true);
});

test('articleSelectors getAudio with id', () => {
  expect(getAudio(1)(state).id).toBe('1');
  expect(getAudio(2)(state).id).toBe('2');
  expect(getAudio(3)(state).id).toBe('3');
});
