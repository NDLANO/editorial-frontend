/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';
import React from 'react';

import renderer from 'react-test-renderer';
import { render, wait } from 'react-testing-library';
import { MemoryRouter } from 'react-router-dom';
import { StructurePage } from '../StructurePage';
import {
  subjectsMock,
  resourceTypesMock,
  subjectTopicsMock,
} from '../../../util/__tests__/taxonomyMocks';
import IntlWrapper from '../../../util/__tests__/IntlWrapper';

const wrapper = () =>
  renderer.create(
    <MemoryRouter>
      <IntlWrapper>
        <StructurePage
          locale="nb"
          t={() => 'injected'}
          match={{ params: {} }}
        />
      </IntlWrapper>
    </MemoryRouter>,
  );

beforeEach(() => {
  nock('http://ndla-api')
    .get('/taxonomy/v1/resource-types/?language=nb')
    .reply(200, resourceTypesMock);

  nock('http://ndla-api')
    .get('/taxonomy/v1/subjects/?language=nb')
    .reply(200, subjectsMock);
});

test('fetches and renders a list of subjects and topics based on pathname', async () => {
  nock('http://ndla-api')
    .get(`/taxonomy/v1/subjects/${subjectsMock[0].id}/topics?recursive=true`)
    .reply(200, subjectTopicsMock);
  nock('http://ndla-api')
    .get(
      '/taxonomy/v1/topics/urn:topic:1:172650/resources/?language=nb&relevance=urn:relevance:core',
    )
    .reply(200, []);
  nock('http://ndla-api')
    .get(`/taxonomy/v1/subjects/${subjectsMock[0].id}/topics?recursive=true`)
    .reply(200, subjectTopicsMock);
  nock('http://ndla-api')
    .get(
      '/taxonomy/v1/topics/urn:topic:1:172650/resources/?language=nb&relevance=urn:relevance:supplementary',
    )
    .reply(200, []);
  const { container, getByText } = render(
    <MemoryRouter>
      <IntlWrapper>
        <StructurePage
          locale="nb"
          t={() => 'injected'}
          locale="nb"
          match={{
            params: {
              subject: 'subject:1',
              topic1: 'topic:1:186479',
              topic2: 'topic:1:172650',
            },
          }}
        />
      </IntlWrapper>
    </MemoryRouter>,
  );
  await wait();

  await wait(() => getByText('Fortelleteknikker og virkemidler'));
  expect(container.firstChild).toMatchSnapshot();

  expect(nock.isDone());
});

it('Adds posts new subject when writing and pressing enter', async () => {
  const component = wrapper();
  const { instance } = component.root.findByType(StructurePage);
  expect(instance.state.editStructureHidden).toBe(false);

  nock('http://ndla-api')
    .post('/taxonomy/v1/subjects', { name: 'Elefant' })
    .reply(201, '', {
      Location: 'newPath',
      'Content-Type': 'text/plain; charset=UTF-8',
    });
  nock('http://ndla-api')
    .get('/taxonomy/v1/subjects')
    .reply(200, subjectsMock);
  const component = wrapper();
  const { instance } = component.root.findByType(StructurePage);
  expect(instance.state.editStructureHidden).toBe(false);
  await instance.addSubject('Elefant');
  await wait();
  await wait();
  expect(nock.isDone());
});

it('updates name in state when changeName is called', async () => {
  nock('http://ndla-api')
    .put('/taxonomy/v1/subjects/urn:subject:12', { name: 'Lalaland' })
    .reply(204, '');
  nock('http://ndla-api')
    .get('/taxonomy/v1/subjects/?language=nb')
    .times(1)
    .reply(200, subjectsMock);

  const component = wrapper();

  const { instance } = component.root.findByType(StructurePage);
  await instance.onChangeSubjectName('urn:subject:12', 'Lalaland');
  await wait();
  await wait();
  expect(nock.isDone());
});
