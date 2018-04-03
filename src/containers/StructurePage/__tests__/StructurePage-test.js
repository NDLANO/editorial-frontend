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

const activeSubject = 'subject:11';
const wrapper = () =>
  renderer.create(
    <MemoryRouter>
      <StructurePage
        t={() => 'injected'}
        match={{ params: { subject: activeSubject } }}
      />
    </MemoryRouter>,
  );
beforeEach(() => {
  nock('http://ndla-api')
    .get('/taxonomy/v1/subjects')
    .reply(200, subjectsMock);

  nock('http://ndla-api')
    .get(`/taxonomy/v1/subjects/urn:${activeSubject}/topics?recursive=true`)
    .reply(200, []);
});

test('renders list of subjects, with active in url', async () => {
  const component = wrapper();
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
    .post('/taxonomy/v1/subjects', { name: 'Elefant' })
    .reply(201, '', {
      Location: 'newPath',
      'Content-Type': 'text/plain; charset=UTF-8',
    });
  const component = wrapper();
  const instance = component.root.findByType(StructurePage).instance;
  expect(instance.state.editStructureHidden).toBe(false);
  await instance.addSubject('Elefant');
  expect(
    instance.state.subjects.filter(
      it => it.path === 'newPath' && it.name === 'Elefant',
    ).length,
  ).toBe(1);
  expect(nock.isDone());
});

it('updates name in state when changeName is called', async () => {
  nock('http://ndla-api')
    .put('/taxonomy/v1/subjects/urn:subject:12', { name: 'Lalaland' })
    .reply(204, '');
  const component = wrapper();

  return new Promise(resolve => {
    setTimeout(async () => {
      const instance = component.root.findByType(StructurePage).instance;
      await instance.onChangeSubjectName('urn:subject:12', 'Lalaland');
      expect(
        instance.state.subjects.filter(
          it => it.id === 'urn:subject:12' && it.name === 'Lalaland',
        ).length,
      ).toBe(1);
      resolve();
    }, global.DEFAULT_TIMEOUT);
  });
});

it('toggles state toggles correctly', () => {
  const component = wrapper();
  const instance = component.root.findByType(StructurePage).instance;
  instance.toggleState('test');
  expect(instance.state.toggles.test).toBeDefined();
  instance.toggleState('test');
  expect(instance.state.toggles.test).toBe(false);
  instance.toggleState('test2');
  expect(instance.state.toggles.test).toBe(undefined);
});
