/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { MemoryRouter, useHistory } from 'react-router-dom';
import { StructureContainer } from '../StructureContainer';
import {
  subjectsMock,
  resourceTypesMock,
  subjectTopicsMock,
} from '../../../util/__tests__/taxonomyMocks';
import IntlWrapper from '../../../util/__tests__/IntlWrapper';
import { taxonomyApi } from '../../../config';
import { SessionProvider } from '../../Session/SessionProvider';

afterEach(cleanup);

const TestStructureContainer = () => {
  const history = useHistory();
  return (
    <StructureContainer
      history={history}
      match={{
        url: 'urn:subject:1/urn:topic:1:186479/urn:topic:1:172650',
        params: {
          subject: 'urn:subject:1',
          topic: 'urn:topic:1:186479',
          subtopics: 'urn:topic:1:172650',
        },
        isExact: false,
        path: 'urn:subject:1/urn:topic:1:186479/urn:topic:1:172650',
      }}
      location={{
        search: '',
        pathname: 'test',
        hash: '',
        state: '',
      }}
    />
  );
};

const wrapper = () =>
  render(
    <SessionProvider>
      <MemoryRouter>
        <IntlWrapper>
          <TestStructureContainer />
        </IntlWrapper>
      </MemoryRouter>
    </SessionProvider>,
  );

beforeEach(() => {
  nock('http://ndla-api')
    .persist()
    .get(`${taxonomyApi}/resource-types/?language=nb`)
    .reply(200, resourceTypesMock);

  nock('http://ndla-api')
    .get(`${taxonomyApi}/subjects?language=nb`)
    .reply(200, subjectsMock);
});

test('fetches and renders a list of subjects and topics based on pathname', async () => {
  const mockTopicArticle = articleId => {
    nock('http://ndla-api')
      .get(`/draft-api/v1/drafts/${articleId}`)
      .reply(200, { articleType: 'topic-article' });
  };

  [8617, 8517, 8285, 3592, 8625, 8619, 8618, 3273, 8620].map(id => mockTopicArticle(id));

  nock('http://ndla-api')
    .persist()
    .get(`${taxonomyApi}/subjects/${subjectsMock[0].id}/topics?recursive=true&language=nb`)
    .reply(200, subjectTopicsMock);
  nock('http://ndla-api')
    .get(`${taxonomyApi}/subjects/${subjectsMock[0].id}/filters`)
    .reply(200, []);
  nock('http://ndla-api')
    .persist()
    .get(
      `${taxonomyApi}/topics/urn:topic:1:172650/resources?language=nb&relevance=urn:relevance:core&filter=`,
    )
    .reply(200, []);
  nock('http://ndla-api')
    .persist()
    .get(`${taxonomyApi}/subjects/${subjectsMock[0].id}/topics?recursive=true`)
    .reply(200, subjectTopicsMock);
  nock('http://ndla-api')
    .persist()
    .get(
      `${taxonomyApi}/topics/urn:topic:1:172650/resources?language=nb&relevance=urn:relevance:supplementary&filter=`,
    )
    .reply(200, []);
  nock('http://ndla-api')
    .persist()
    .get('/article-api/v2/articles/3592')
    .reply(200, {});
  nock('http://ndla-api')
    .persist()
    .get(`${taxonomyApi}/filters/?language=nb`)
    .reply(200, []);
  nock('http://ndla-api')
    .persist()
    .get('/draft-api/v1/user-data')
    .reply(200, {});
  const { container, findByText } = wrapper();
  await findByText('Fortelleteknikker og virkemidler');
  expect(container.firstChild).toMatchSnapshot();

  expect(nock.isDone());
  nock.cleanAll();
});
