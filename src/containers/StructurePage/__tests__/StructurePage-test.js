/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';
import React from 'react';
import { render, wait, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { StructureContainer } from '../StructureContainer';
import {
  subjectsMock,
  resourceTypesMock,
  subjectTopicsMock,
} from '../../../util/__tests__/taxonomyMocks';
import IntlWrapper from '../../../util/__tests__/IntlWrapper';

afterEach(cleanup);

const store = {
  getState: jest.fn(() => ({ locale: 'nb' })),
  dispatch: jest.fn(),
  subscribe: jest.fn(),
};

const wrapper = () =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <IntlWrapper>
          <StructureContainer
            t={() => 'injected'}
            locale="nb"
            match={{
              url: 'urn:subject:1/urn:topic:1:186479/urn:topic:1:172650',
              params: {
                subject: 'urn:subject:1',
                topic1: 'urn:topic:1:186479',
                topic2: 'urn:topic:1:172650',
              },
            }}
            location={{
              search: '',
              pathname: 'test',
              hash: '',
            }}
          />
        </IntlWrapper>
      </MemoryRouter>
    </Provider>,
  );

beforeEach(() => {
  nock('http://ndla-api')
    .persist()
    .get('/taxonomy/v1/resource-types/?language=nb')
    .reply(200, resourceTypesMock);

  nock('http://ndla-api')
    .get('/taxonomy/v1/subjects?includeMetadata=true&language=nb')
    .reply(200, subjectsMock);
});

test('fetches and renders a list of subjects and topics based on pathname', async () => {
  nock('http://ndla-api')
    .persist()
    .get(
      `/taxonomy/v1/subjects/${subjectsMock[0].id}/topics?includeMetadata=true&recursive=true&language=nb`,
    )
    .reply(200, subjectTopicsMock);
  nock('http://ndla-api')
    .get(`/taxonomy/v1/subjects/${subjectsMock[0].id}/filters`)
    .reply(200, []);
  nock('http://ndla-api')
    .persist()
    .get(
      '/taxonomy/v1/topics/urn:topic:1:172650/resources?includeMetadata=true&language=nb&relevance=urn:relevance:core&filter=',
    )
    .reply(200, []);
  nock('http://ndla-api')
    .persist()
    .get(
      `/taxonomy/v1/subjects/${subjectsMock[0].id}/topics?includeMetadata=true&recursive=true`,
    )
    .reply(200, subjectTopicsMock);
  nock('http://ndla-api')
    .persist()
    .get(
      '/taxonomy/v1/topics/urn:topic:1:172650/resources?includeMetadata=true&language=nb&relevance=urn:relevance:supplementary&filter=',
    )
    .reply(200, []);
  nock('http://ndla-api')
    .persist()
    .get('/article-api/v2/articles/3592')
    .reply(200, {});
  const { container, getByText } = wrapper();

  await wait(() => getByText('Fortelleteknikker og virkemidler'));
  expect(container.firstChild).toMatchSnapshot();

  expect(nock.isDone());
  nock.cleanAll();
});
