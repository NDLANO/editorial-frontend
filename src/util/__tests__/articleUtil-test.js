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
  const competences = new Map();
  competences.set('KE1337', true);
  competences.set('KM2255', true);
  competences.set('TT3', true);
  competences.set('TT9898', true);
  competences.set('TTR13', false);
  competences.set('TT12KE1337', false);
  competences.set('KE1337TT12', false);
  competences.set('K1', false);
  competences.set('K123', false);
  competences.set('KV5432', false);
  competences.set('KJ12', false);
  competences.set('1K123', false);
  competences.set('K3K', false);
  competences.set('k123', false);

  competences.forEach((value, key) =>
    expect(isCompetenceValid(key)).toBe(value),
  );
});
