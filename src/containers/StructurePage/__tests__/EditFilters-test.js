/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import nock from 'nock';
import { render, Simulate, wait } from 'react-testing-library';
import EditFilters from '../components/EditFilters';

const filterMock = [
  { id: 'urn:filter:f85f8f24-9e00-4267-82f5-ffd0dd3c53fa', name: 'SF VG1' },
  { id: 'urn:filter:0a0dc7e0-911f-4674-801a-580b3e8fa09a', name: 'SF VG2' },
  {
    id: 'urn:filter:e8aa33b2-f5b7-4dee-84f6-4b594127b4c5',
    name: 'Mediesamfunnet',
  },
  {
    id: 'urn:filter:3ae5a086-8444-43c3-8fa4-db869e7292d2',
    name: 'Medieuttrykk',
  },
  { id: 'urn:filter:9e522d29-edf0-4949-bb94-a2089c79e437', name: 'SF VG3' },
];

beforeEach(() => {
  nock('http://ndla-api')
    .get('/taxonomy/v1/subjects/test/filters')
    .reply(200, filterMock);
});
const wrapper = () =>
  render(<EditFilters id="test" classes={() => {}} t={() => 'Errormelding'} />);

it('maps out filters', async () => {
  const { container } = wrapper();
  await wait();
  await wait();
  expect(container.firstChild).toMatchSnapshot();
});

it('calls add filter', async () => {
  nock('http://ndla-api')
    .post(
      '/taxonomy/v1/filters',
      JSON.stringify({ subjectId: 'test', name: 'Nytt filter' }),
    )
    .reply(201);
  nock('http://ndla-api')
    .get('/taxonomy/v1/subjects/test/filters')
    .reply(200, [...filterMock, { name: 'Nytt filter', id: 'test' }]);
  const { getByTestId, container } = wrapper();
  Simulate.click(getByTestId('addFilterButton'));

  const input = getByTestId('addFilterInput');
  input.value = 'Nytt filter';
  Simulate.change(input);
  Simulate.keyDown(input, { key: 'Enter', keyCode: 13, which: 13 });
  await wait();
  await wait();
  expect(container.firstChild).toMatchSnapshot();
});
