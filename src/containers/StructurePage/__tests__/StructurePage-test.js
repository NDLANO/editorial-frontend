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
import { MemoryRouter } from 'react-router-dom';
import { StructurePage } from '../StructurePage';
import { subjectsMock } from '../../../util/__tests__/taxonomyMocks';

test('renders list of subjects, with active in url', async () => {
  nock('http://ndla-api')
    .get('/taxonomy/v1/subjects')
    .reply(200, subjectsMock);

  const component = renderer.create(
    <MemoryRouter>
      <StructurePage
        t={() => 'injected'}
        match={{ params: { subject: 'urn:subject:11' } }}
      />
    </MemoryRouter>,
  );
  expect(component.toJSON()).toMatchSnapshot();
  return new Promise(resolve => {
    setTimeout(() => {
      expect(component.toJSON()).toMatchSnapshot();
      resolve();
    }, global.DEFAULT_TIMEOUT);
  });
});

it('Adds posts new subject when writing and pressing enter', async () => {
  nock('http://ndla-api')
    .get('/taxonomy/v1/subjects')
    .reply(200, subjectsMock);
  nock('http://ndla-api')
    .post('/taxonomy/v1/subjects', { name: 'Elefant' })
    .reply(201, '', {
      Location: 'newPath',
      'Content-Type': 'text/plain; charset=UTF-8',
    });
  const component = renderer.create(
    <MemoryRouter>
      <StructurePage
        t={() => ''}
        match={{ params: { subject: 'urn:subject:11' } }}
      />
    </MemoryRouter>,
  );
  const { instance } = component.root.findByType(StructurePage);
  expect(instance.state.editStructureHidden).toBe(false);
  await instance.addSubject('Elefant');

  expect(
    instance.state.subjects.filter(
      it => it.path === 'newPath' && it.name === 'Elefant',
    ).length,
  ).toBe(1);
  expect(nock.isDone());
});
