/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getArticle, getSaving } from '../article';
import { topicArticle } from './mockArticles';

const state = {
  locale: 'nb',
  articles: {
    isSaving: true,
    all: {
      [topicArticle.id]: topicArticle,
      2: {
        id: '2',
        created: '2014-12-24T10:44:06Z',
        title: [
          { title: 'Tester', language: 'nb' },
          { title: 'Testing', language: 'en' },
        ],
        metaDescription: [
          { metaDescription: 'Beskrivelse', language: 'nb' },
          { metaDescription: 'Description', language: 'en' },
        ],
      },
      3: {
        id: '3',
        created: '2014-11-24T10:44:06Z',
        title: [
          { title: 'Tester', language: 'nb' },
          { title: 'Testing', language: 'en' },
        ],
      },
    },
  },
};

test('articleSelectors getArticle with id', () => {
  expect(getArticle(1)(state).id).toBe('1');
  expect(getArticle(2)(state).id).toBe('2');
  expect(getArticle(3)(state).id).toBe('3');
});

test('articleSelectors getArticle (nb locale)', () => {
  const getArticleSelector = getArticle(1);
  expect(getArticleSelector).toMatchSnapshot();
});

test('articleSelectors getArticle (en locale)', () => {
  const getArticleSelector = getArticle('1');
  const stateWithEnLocale = { ...state, locale: 'en' };
  expect(getArticleSelector(stateWithEnLocale)).toMatchSnapshot();
});

test('articleSelectors getArticle returns undefined if article is not in state', () => {
  const getArticleSelector = getArticle(1337);
  expect(getArticleSelector(state)).toEqual(undefined);
});

test('articleSelectors getSaving', () => {
  expect(getSaving(state)).toBe(true);
});
