/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { transformQuery } from '../searchHelpers';

test('util/searchHelpers transformQuery', () => {
  const query = { page: '1', 'page-size': '10', sort: '-relevance' };
  expect(transformQuery(query)).toMatchSnapshot();
});

test('util/searchHelpers transformQuery', () => {
  const query = {
    page: '1',
    'page-size': '10',
    sort: '-relevance',
    'resource-types': 'urn:resourcetype:academicArticle',
  };
  expect(transformQuery(query)).toMatchSnapshot();
});

test('util/searchHelpers transformQuery', () => {
  const query = {
    page: '1',
    'page-size': '10',
    sort: '-relevance',
    'resource-types': 'topic-article',
  };
  expect(transformQuery(query)).toMatchSnapshot();
});
