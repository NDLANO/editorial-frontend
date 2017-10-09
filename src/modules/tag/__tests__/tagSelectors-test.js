/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getAllTagsByLanguage, getHasFetched } from '../tag';
import { nn, zh } from './mockTags';

const state = {
  locale: 'zh',
  tags: {
    all: {
      nn: {
        ...nn,
        hasFetched: true,
      },
      zh: {
        ...zh,
        hasFetched: true,
      },
    },
  },
};

test('tagSelector getAllTagsByLanguage with chinese locale', () => {
  const getAllTagsSelector = getAllTagsByLanguage('zh');
  expect(getAllTagsSelector(state).length).toBe(4);
});

test('tagSelector getAllTagsByLanguage with newnorwegian locale', () => {
  const getAllTagsSelector = getAllTagsByLanguage('nn');
  expect(getAllTagsSelector(state).length).toBe(4);
});

test('tagSelector getAllTagsByLanguage with unknown locale', () => {
  const getAllTagsSelector = getAllTagsByLanguage('nbsdjf');
  expect(getAllTagsSelector(state).length).toBe(0);
});

test('tagSelector getHasFetched', () => {
  expect(getHasFetched(state, 'zh')).toBe(true);
});
