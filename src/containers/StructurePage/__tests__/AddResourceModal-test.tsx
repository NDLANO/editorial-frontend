/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import nock from 'nock';
import { render, fireEvent, cleanup, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AddResourceModal from '../resourceComponents/AddResourceModal';
import IntlWrapper from '../../../util/__tests__/IntlWrapper';
import { resourcesByType, articleMock } from '../../../util/__tests__/taxonomyMocks';
import { taxonomyApi } from '../../../config';

afterEach(cleanup);

const resourceType = 'urn:resourcetype:reviewResource';
const ndlaUrl = 'https://beta.ndla.no/subject:3/topic:1:179373/topic:1:170165/resource:1:168388/';
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
    connectionId: 'urn:resource-resourcetype:9414c99b-73c4-4222-8b94-58a84aba02cd',
  },
];

beforeEach(() => {
  nock('http://ndla-api')
    .get(
      `/search-api/v1/search/group/?fallback=true&language=nb&page=1&query=&resource-types=${encodeURIComponent(
        resourceType,
      )}`,
    )
    .reply(200, resourcesByType);
});

const wrapper = (existingResourceIds: string[] = []) =>
  render(
    <IntlWrapper>
      <MemoryRouter>
        <AddResourceModal
          data-testid="addResourceModal"
          topicId="topicId2"
          allowPaste
          type={resourceType}
          onClose={() => {}}
          refreshResources={() => {}}
          locale="nb"
          existingResourceIds={existingResourceIds}
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
      `${taxonomyApi}/topic-resources`,
      JSON.stringify({
        resourceId: 'urn:resource:1:175733',
        topicid: 'urn:topicId2',
      }),
    )
    .reply(201, undefined, { Location: 'urn' });
  const { container, getByText, getByTestId, findByText, findByTestId } = wrapper();
  await findByText('Hva kan du om geologiske prosesser?');
  // await wait(() => getByText(resourcesByType[0].results[0].title.title));

  expect(container.firstChild).toMatchSnapshot();
  act(() => {
    fireEvent.click(getByText('Hva kan du om geologiske prosesser?'));
  });
  await findByTestId('articlePreview');

  expect(container.firstChild).toMatchSnapshot();
  act(() => {
    fireEvent.click(getByTestId('taxonomyLightboxButton'));
  });
  expect(nock.isDone());
});

const location = 'Location';

test('Can paste a valid url and add it to topic', async () => {
  nock('http://ndla-api')
    .get(`/article-api/v2/articles/24?language=nb&fallback=true`)
    .reply(200, articleMock);
  nock('http://ndla-api')
    .get(`${taxonomyApi}/resources/urn:resource:1:168388`)
    .reply(200, resourceMock);
  nock('http://ndla-api')
    .get(`${taxonomyApi}/resources/urn:resource:1:168388/resource-types/`)
    .reply(200, resourceTypeMock);
  nock('http://ndla-api')
    .post(
      `${taxonomyApi}/topic-resources`,
      JSON.stringify({
        resourceId: 'urn:resource:1:168388',
        topicid: 'topicId2',
      }),
    )
    .reply(201, {}, { [location]: 'urn' });
  const { container, getByTestId, findByTestId, findByText } = wrapper();
  await findByText('Hva kan du om geologiske prosesser?');
  const input = getByTestId('addResourceUrlInput');
  act(() => {
    fireEvent.change(input, { target: { value: ndlaUrl } });
  });
  await findByTestId('articlePreview');

  expect(container.firstChild).toMatchSnapshot();
  act(() => {
    fireEvent.click(getByTestId('taxonomyLightboxButton'));
  });

  expect((await findByTestId('taxonomyLightboxButton')).firstElementChild).toBeNull();

  expect(nock.isDone());
});
