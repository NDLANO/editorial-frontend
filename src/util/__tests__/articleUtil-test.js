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
