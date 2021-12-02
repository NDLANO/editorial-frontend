/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';
import { render, fireEvent, cleanup, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import AddResourceModal from '../resourceComponents/AddResourceModal';
import IntlWrapper from '../../../util/__tests__/IntlWrapper';
import { resourcesByType, articleMock } from '../../../util/__tests__/taxonomyMocks';
import { taxonomyApi } from '../../../config';

afterEach(cleanup);

const resourceType = 'urn:resourcetype:tasksAndActivities';
const ndlaUrl = 'https://beta.ndla.no/subject:3/topic:1:179373/topic:1:170165/resource:1:168388/';
const resourceMock = {
  id: 'urn:resource:1:168388',
  name: 'Oppgaver til utforskeren',
  contentUri: 'urn:article:24',
  path: '/subject:9/topic:1:179373/topic:1:170165/resource:1:168388',
  resourceTypes: [
    {
      id: 'urn:resourcetype:task',
      parentId: 'urn:resourcetype:tasksAndActivities',
      name: 'Oppgave',
      connectionId: 'urn:resource-resourcetype:9115ed35-3a9b-41e8-9f7a-0717d2ee8146',
    },
    {
      id: 'urn:resourcetype:tasksAndActivities',
      parentId: null,
      name: 'Oppgaver og aktiviteter',
      connectionId: 'urn:resource-resourcetype:0e1ac7ac-fc7d-44db-b217-ebf262ede263',
    },
  ],
};

beforeEach(() => {
  nock('http://ndla-api')
    .get(
      `/search-api/v1/search/group/?fallback=true&language=nb&page=1&query=&resource-types=${encodeURIComponent(
        resourceType,
      )}`,
    )
    .reply(200, resourcesByType);
});

const qc = new QueryClient();

const wrapper = (existingResourceIds: string[] = []) =>
  render(
    <IntlWrapper>
      <MemoryRouter>
        <QueryClientProvider client={qc}>
          <AddResourceModal
            data-testid="addResourceModal"
            nodeId="topicId2"
            allowPaste
            type={resourceType}
            onClose={() => {}}
            existingResourceIds={existingResourceIds}
          />
        </QueryClientProvider>
      </MemoryRouter>
    </IntlWrapper>,
  );

test('Can select a resource from the list and it adds it to topic', async () => {
  nock('http://ndla-api')
    .get(`/article-api/v2/articles/356?language=nb&fallback=true`)
    .reply(200, articleMock);
  nock('http://ndla-api')
    .post(
      `${taxonomyApi}/node-resources`,
      JSON.stringify({
        resourceId: 'urn:resource:1:175733',
        nodeId: 'topicId2',
      }),
    )
    .reply(201, undefined, { Location: 'urn' });
  const { container, getByText, getByTestId, findByText, findByTestId } = wrapper();
  await findByText('Hva kan du om geologiske prosesser?');

  expect(container.firstChild).toMatchSnapshot();
  act(() => {
    fireEvent.click(getByText('Hva kan du om geologiske prosesser?'));
  });
  await findByTestId('articlePreview');

  expect(container.firstChild).toMatchSnapshot();
  act(() => {
    fireEvent.click(getByTestId('taxonomyLightboxButton'));
  });
  await findByText('Lagre');
  expect(nock.isDone());
});

test('Can paste a valid url and add it to topic', async () => {
  nock('http://ndla-api')
    .get(`/article-api/v2/articles/24?language=nb&fallback=true`)
    .reply(200, articleMock);
  nock('http://ndla-api')
    .get(`${taxonomyApi}/resources/urn:resource:1:168388`)
    .reply(200, resourceMock);
  nock('http://ndla-api')
    .post(
      `${taxonomyApi}/node-resources`,
      JSON.stringify({
        resourceId: 'urn:resource:1:168388',
        nodeId: 'topicId2',
      }),
    )
    .reply(201, {}, { Location: 'urn' });
  const {
    container,
    getByTestId,
    findByTestId,
    findByText,
    getByPlaceholderText,
    queryByPlaceholderText,
  } = wrapper();
  await findByText('Hva kan du om geologiske prosesser?');
  const input = getByPlaceholderText('Lim inn lenke fra ndla.no');
  fireEvent.change(input, { target: { value: ndlaUrl } });
  await findByTestId('articlePreview');
  expect(queryByPlaceholderText('Søk på tittel')).not.toBeInTheDocument();
  await findByText(articleMock.title.title);

  expect(container.firstChild).toMatchSnapshot();
  act(() => {
    fireEvent.click(getByTestId('taxonomyLightboxButton'));
  });

  expect((await findByTestId('taxonomyLightboxButton')).firstElementChild).toBeNull();

  expect(nock.isDone());
});
