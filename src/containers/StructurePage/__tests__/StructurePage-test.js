/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';
import React from 'react';
import { render, flushPromises, Simulate } from 'react-testing-library';
import { MemoryRouter } from 'react-router-dom';
import StructurePage from '../StructurePage';
/* import FolderItem from '../components/FolderItem'; */
import { subjectsMock } from '../../../util/__tests__/taxonomyMocks';

test('renders list of subjects, with active in url', async () => {
  nock('http://ndla-api')
    .get('/taxonomy/v1/subjects')
    .reply(200, subjectsMock);

  const { container } = render(
    <MemoryRouter>
      <StructurePage match={{ params: { subject: 'subject:11' } }} />
    </MemoryRouter>,
  );
  expect(container.firstChild).toMatchSnapshot();
  await flushPromises();
  render(
    <MemoryRouter>
      <StructurePage match={{ params: { subject: 'subject:11' } }} />
    </MemoryRouter>,
    { container },
  );
  expect(container.firstChild).toMatchSnapshot();
});
it('Adds posts new subject when writing and pressing enter', async () => {
  nock('http://ndla-api')
    .get('/taxonomy/v1/subjects')
    .reply(200, subjectsMock);

  const postSubjectCall = nock('http://ndla-api')
    .post('/taxonomy/v1/subjects', { name: 'Elefant' })
    .reply(201);

  const { getByTestId, container } = render(
    <MemoryRouter>
      <StructurePage match={{ params: { subject: 'subject:11' } }} />
    </MemoryRouter>,
  );
  Simulate.click(getByTestId('AddSubjectButton'));

  const input = getByTestId('addSubjectInputField');
  input.value = 'Elefant';
  Simulate.change(input);
  expect(container.firstChild).toMatchSnapshot();

  Simulate.keyDown(input, { key: 'Enter', keyCode: 13, which: 13 });
  await flushPromises();
  expect(postSubjectCall.isDone());
});
