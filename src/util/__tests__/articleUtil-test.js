/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';
import {
  transformArticleFromApiVersion,
  transformArticleToApiVersion,
  isDraftPublished,
  isGrepCodeValid,
} from '../articleUtil';
import { apiArticle, transformedArticle } from './articleMocks';
import { apiConcept } from './conceptMocks';

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

test('transformArticleFromApiVersion', async () => {
  nock('http://ndla-api/')
    .get('/concept-api/v1/drafts/1?fallback=true')
    .reply(200, { ...apiConcept, id: 1 });
  nock('http://ndla-api/')
    .get('/concept-api/v1/drafts/2?fallback=true')
    .reply(200, { ...apiConcept, id: 2 });

  nock('http://ndla-api/')
    .get('/draft-api/v1/drafts/3')
    .reply(200, { ...apiArticle, id: 3 });

  const conceptIds = [1, 2];
  const relatedContent = [3, { url: 'url', title: 'title' }];
  const transformed = await transformArticleFromApiVersion(
    { ...apiArticle, conceptIds, relatedContent },
    'nb',
  );
  expect(transformed).toMatchSnapshot();
});

test('transformArticleToApiVersion', () => {
  const transformed = transformArticleToApiVersion(transformedArticle);
  expect(transformed).toMatchSnapshot();
});

test('isGrepCodeValid correct behavior', () => {
  const grepCodes = new Map();
  grepCodes.set('KE1337', true);
  grepCodes.set('KM2255', true);
  grepCodes.set('TT3', true);
  grepCodes.set('TT9898', true);
  grepCodes.set('TTR13', false);
  grepCodes.set('TT12KE1337', false);
  grepCodes.set('KE1337TT12', false);
  grepCodes.set('K1', false);
  grepCodes.set('K123', false);
  grepCodes.set('KV5432', false);
  grepCodes.set('KJ12', false);
  grepCodes.set('1K123', false);
  grepCodes.set('K3K', false);
  grepCodes.set('k123', false);

  grepCodes.forEach((value, key) => expect(isGrepCodeValid(key)).toBe(value));
});
