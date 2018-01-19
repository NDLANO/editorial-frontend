/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getDraft, getSaving } from '../draft';
import { topicArticleNB, topicArticleEN } from './mockDrafts';

const state = {
  locale: 'nb',
  drafts: {
    isSaving: true,
    all: {
      [topicArticleNB.id]: topicArticleNB,
      2: {
        id: '2',
        created: '2014-12-24T10:44:06Z',
        title: { title: 'Tester', language: 'nb' },
        metaDescription: { metaDescription: 'Beskrivelse', language: 'nb' },
      },
      3: {
        id: '3',
        created: '2014-11-24T10:44:06Z',
        title: { title: 'Tester', language: 'nb' },
      },
      [topicArticleEN.id]: topicArticleEN,
    },
  },
};

test('articleSelectors getArticle with id', () => {
  expect(getDraft(1)(state).id).toBe('1');
  expect(getDraft(2)(state).id).toBe('2');
  expect(getDraft(3)(state).id).toBe('3');
});

test('articleSelectors getArticle (nb locale)', () => {
  const getArticleSelector = getDraft(1);
  expect(getArticleSelector(state)).toMatchSnapshot();
});

test('articleSelectors getArticle (en locale)', () => {
  const getArticleSelector = getDraft('4');
  const stateWithEnLocale = { ...state, locale: 'en' };
  expect(getArticleSelector(stateWithEnLocale)).toMatchSnapshot();
});

test('articleSelectors getArticle returns undefined if article is not in state', () => {
  const getArticleSelector = getDraft(1337);
  expect(getArticleSelector(state)).toEqual(undefined);
});

test('articleSelectors getSaving', () => {
  expect(getSaving(state)).toBe(true);
});
