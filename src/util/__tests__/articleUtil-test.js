/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  transformArticleFromApiVersion,
  transformArticleToApiVersion,
  isDraftPublished,
  isCompetenceValid,
} from '../articleUtil';
import { apiArticle, transformedArticle } from './articleMocks';

test('isDraftPublished is true', () => {
  const isPublished = isDraftPublished({
    current: 'STATUS',
    other: ['PUBLISHED'],
  });
  expect(isPublished).toBe(true);
});

test('isDraftPublished is false', () => {
  const isPublished = isDraftPublished({
    current: 'DRAFT',
    other: [],
  });
  expect(isPublished).toBe(false);
});

test('isDraftPublished status undefined', () => {
  const isPublished = isDraftPublished();
  expect(isPublished).toBe(false);
});

test('transformArticleFromApiVersion', () => {
  const transformed = transformArticleFromApiVersion(apiArticle);
  expect(transformed).toMatchSnapshot();
});

test('transformArticleToApiVersion', () => {
  const transformed = transformArticleToApiVersion(transformedArticle);
  expect(transformed).toMatchSnapshot();
});

test('isCompetenceValid correct behavior', () => {
  const competences = [
    'K1',
    'K123',
    'KE1337',
    'KM2255',
    'KV5432',
    'KJ12',
    '1K123',
    'K3K',
    'k123',
  ];
  const result = [false, false, true, true, true, false, false, false, false];

  competences.map((value, idx) =>
    expect(isCompetenceValid(value)).toBe(result[idx]),
  );
});
