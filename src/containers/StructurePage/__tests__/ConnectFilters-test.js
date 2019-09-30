/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import nock from 'nock';
import { render, fireEvent, cleanup, wait } from '@testing-library/react';
import IntlWrapper from '../../../util/__tests__/IntlWrapper';
import ConnectFilters from '../folderComponents/ConnectFilters';

afterEach(cleanup);

const filterMock = [
  { id: 'urn:filter:f102710e-973e-4999-9daf-f1536d41188a', name: 'blabla 1' },
  { id: 'urn:filter:fc0a6fc5-4ed3-4aec-ade7-381ac51c446e', name: 'blabla hei' },
  { id: 'urn:filter:fd6893b9-c02a-4016-b64e-1b6533ff9ba2', name: 'blabla 2' },
  { id: 'urn:filter:a583772c-4c71-401c-807d-6cb676dcf523', name: 'Test test' },
];

const topicFilterMock = [
  {
    connectionId: 'urn:topic-filter:6ad6cc85-29b5-4c75-8f45-43ecf2068bc5',
    id: 'urn:filter:fd6893b9-c02a-4016-b64e-1b6533ff9ba2',
    name: 'blabla topic',
    relevanceId: 'urn:relevance:core',
  },
  {
    connectionId: 'urn:topic-filter:317d0461-137b-4309-be00-d8a4ae18b533',
    id: 'urn:filter:fc0a6fc5-4ed3-4aec-ade7-381ac51c446e',
    name: 'blabla hei',
    relevanceId: 'urn:relevance:supplementary',
  },
];

const wrapper = () =>
  render(
    <IntlWrapper>
      <ConnectFilters
        id="topicId"
        path="/subjectId/topicId"
        classes={() => {}}
        refreshTopics={() => {}}
        subjectFilters={filterMock}
        topicFilters={topicFilterMock}
      />
    </IntlWrapper>,
  );

it('maps out filters', async () => {
  const { container } = wrapper();
  await wait();
  await wait();
  expect(container.firstChild).toMatchSnapshot();
});
