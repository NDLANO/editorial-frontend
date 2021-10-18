/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import nock from 'nock';
import { render, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import ResourceItems from '../resourceComponents/ResourceItems';
import {
  supplementaryResourcesMock,
  coreResourcesMock,
} from '../../../util/__tests__/taxonomyMocks';
import IntlWrapper from '../../../util/__tests__/IntlWrapper';

afterEach(cleanup);

const qc = new QueryClient();

const wrapper = () =>
  render(
    <MemoryRouter>
      <IntlWrapper>
        <QueryClientProvider client={qc}>
          <ResourceItems
            resources={[...supplementaryResourcesMock, ...coreResourcesMock]}
            contentType="topic-article"
            locale="nb"
            refreshResources={() => {}}
          />
        </QueryClientProvider>
      </IntlWrapper>
    </MemoryRouter>,
  );

test('matches snapshot', () => {
  nock('http://ndla-api')
    .persist()
    .get('/learningpath-api/v2/learningpaths/401?language=nb&fallback=true')
    .reply(200, {});

  nock('http://ndla-api')
    .persist()
    .get('/learningpath-api/v2/learningpaths/508?language=nb&fallback=true')
    .reply(200, {});

  nock('http://ndla-api')
    .persist()
    .get('/learningpath-api/v2/learningpaths/813?language=nb&fallback=true')
    .reply(200, {});

  nock('http://ndla-api')
    .persist()
    .get('/learningpath-api/v2/learningpaths/78?language=nb&fallback=true')
    .reply(200, {});

  nock('http://ndla-api')
    .persist()
    .get('/learningpath-api/v2/learningpaths/89?language=nb&fallback=true')
    .reply(200, {});

  const { container } = wrapper();
  expect(container.firstChild).toMatchSnapshot();
});
