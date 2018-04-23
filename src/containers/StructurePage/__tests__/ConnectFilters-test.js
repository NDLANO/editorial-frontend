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
import IntlWrapper from '../../../util/__tests__/IntlWrapper';
import ConnectFilters from '../components/ConnectFilters';

const filterMock = [
  { id: 'urn:filter:f102710e-973e-4999-9daf-f1536d41188a', name: 'blabla' },
  { id: 'urn:filter:fc0a6fc5-4ed3-4aec-ade7-381ac51c446e', name: 'blabla hei' },
  { id: 'urn:filter:fd6893b9-c02a-4016-b64e-1b6533ff9ba2', name: 'blabla' },
  { id: 'urn:filter:a583772c-4c71-401c-807d-6cb676dcf523', name: 'Test test' },
];

const topicFilterMock = [
  {
    connectionId: 'urn:topic-filter:6ad6cc85-29b5-4c75-8f45-43ecf2068bc5',
    id: 'urn:filter:fd6893b9-c02a-4016-b64e-1b6533ff9ba2',
    name: 'blabla',
    relevanceId: 'urn:relevance:core',
  },
  {
    connectionId: 'urn:topic-filter:317d0461-137b-4309-be00-d8a4ae18b533',
    id: 'urn:filter:fc0a6fc5-4ed3-4aec-ade7-381ac51c446e',
    name: 'blabla hei',
    relevanceId: 'urn:relevance:supplementary',
  },
];

beforeEach(() => {
  nock('http://ndla-api')
    .get('/taxonomy/v1/subjects/urn:subjectId/filters')
    .reply(200, filterMock);
  nock('http://ndla-api')
    .get('/taxonomy/v1/topics/topicId/filters')
    .reply(200, topicFilterMock);
});
const wrapper = () =>
  render(
    <IntlWrapper>
      <ConnectFilters
        id="topicId"
        path="/subjectId/topicId"
        classes={() => {}}
      />
    </IntlWrapper>,
  );

it('maps out filters', async () => {
  const { container } = wrapper();
  await wait();
  await wait();
  expect(container.firstChild).toMatchSnapshot();
});

it('calls add filter, update filter, and delete filter', async () => {
  nock('http://ndla-api')
    .post(
      '/taxonomy/v1/topic-filters',
      JSON.stringify({
        topicId: 'topicId',
        filterId: filterMock[0].id,
        relevanceId: 'urn:relevance:core',
      }),
    )
    .reply(201);
  nock('http://ndla-api')
    .put(
      '/taxonomy/v1/topic-filters/topicId',
      JSON.stringify({
        relevanceId: 'urn:relevance:core',
      }),
    )
    .reply(201);
  nock('http://ndla-api')
    .delete('/taxonomy/v1/topic-filters/topicId')
    .reply(201);
  nock('http://ndla-api')
    .get('/taxonomy/v1/topics/topicId/filters')
    .reply(200, topicFilterMock);

  const { getByTestId, getByLabelText, container } = wrapper();
  await wait();
  await wait();
  Simulate.click(getByLabelText(filterMock[0].name));
  Simulate.click(getByLabelText(filterMock[1].name));
  Simulate.click(getByTestId(`${filterMock[3].id}-relevance`));
  Simulate.click(getByTestId('submitConnectFilters'));
  await wait();
  await wait();
  expect(nock.isDone());
  expect(container.firstChild).toMatchSnapshot();
});
