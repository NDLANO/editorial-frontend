/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import nock from 'nock';
import { render, fireEvent, cleanup, wait } from 'react-testing-library';
import { MemoryRouter } from 'react-router-dom';
import AddResourceModal from '../resourceComponents/AddResourceModal';
import IntlWrapper from '../../../util/__tests__/IntlWrapper';
import {
  resourcesByType,
  articleMock,
} from '../../../util/__tests__/taxonomyMocks';

afterEach(cleanup);

const resourceType = 'urn:resourcetype:reviewResource';
const ndlaUrl =
  'https://beta.ndla.no/subjects/subject:3/topic:1:179373/topic:1:170165/resource:1:168388/';
const resourceMock = {
  id: 'urn:resource:1:168388',
  name: 'Oppgaver til utforskeren',
  contentUri: 'urn:article:24',
  path: '/subject:9/topic:1:179373/topic:1:170165/resource:1:168388',
};
const resourceTypeMock = [
  {
    id: 'urn:resourcetype:tasksAndActivities',
    parentId: null,
    name: 'Oppgaver og aktiviteter',
    connectionId:
      'urn:resource-resourcetype:9414c99b-73c4-4222-8b94-58a84aba02cd',
  },
];

beforeEach(() => {
  nock('http://ndla-api')
    .get(`/search-api/v1/search/group/?query=&resource-types=${resourceType}`)
    .reply(200, resourcesByType);
});

const wrapper = props =>
  render(
    <IntlWrapper>
      <MemoryRouter>
        <AddResourceModal
          topicId="topicId2"
          allowPaste
          t={() => 'injected'}
          type={resourceType}
          onClose={() => {}}
          refreshResources={() => {}}
          {...props}
        />
      </MemoryRouter>
    </IntlWrapper>,
  );

test('Can select a resource from the list and it adds it to topic', async () => {
  nock('http://ndla-api')
    .get(`/article-api/v2/articles/356?language=nb&fallback=true`)
    .reply(200, articleMock);
  nock('http://ndla-api')
    .post(
      '/taxonomy/v1/topic-resources',
      JSON.stringify({
        resourceId: 'urn:resource:1:175733',
        topicid: 'urn:topicId2',
      }),
    )
    .reply(201);
  const { container, getByText, getByTestId } = wrapper();
  await wait(() => getByText(resourcesByType[0].results[0].title.title));

  expect(container.firstChild).toMatchSnapshot();
  fireEvent.click(getByText(resourcesByType[0].results[0].title.title));
  await wait(() => getByTestId('articlePreview'));

  expect(container.firstChild).toMatchSnapshot();
  fireEvent.click(getByTestId('taxonomyLightboxButton'));
  await wait();
  expect(nock.isDone());
});

test('Can paste a valid url and add it to topic', async () => {
  nock('http://ndla-api')
    .get(`/article-api/v2/articles/24?language=nb&fallback=true`)
    .reply(200, articleMock);
  nock('http://ndla-api')
    .get(`/taxonomy/v1/resources/urn:resource:1:168388?language=undefined`)
    .reply(200, resourceMock);
  nock('http://ndla-api')
    .get(
      `/taxonomy/v1/resources/urn:resource:1:168388/resource-types?language=undefined`,
    )
    .reply(200, resourceTypeMock);
  nock('http://ndla-api')
    .post(
      '/taxonomy/v1/topic-resources',
      JSON.stringify({
        resourceId: 'urn:resource:1:168388',
        topicid: 'urn:topicId2',
      }),
    )
    .reply(201);
  const { container, getByTestId } = wrapper();
  const input = getByTestId('addResourceUrlInput');
  input.value = ndlaUrl;
  fireEvent.change(input);

  await wait(() => getByTestId('articlePreview'));
  expect(container.firstChild).toMatchSnapshot();
  fireEvent.click(getByTestId('taxonomyLightboxButton'));
  await wait();

  expect(nock.isDone());
});
