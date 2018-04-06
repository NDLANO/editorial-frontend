/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { render, Simulate, wait } from 'react-testing-library';
import sinon from 'sinon';
import InlineEditField from '../components/InlineEditField';

it('Goes to edit mode, handles submit', async () => {
  const actionFunc = sinon.spy();
  const { getByTestId, container } = render(
    <InlineEditField
      title={'Test'}
      classes={() => {}}
      t={() => {}}
      onSubmit={actionFunc}
    />,
  );
  expect(container.firstChild).toMatchSnapshot();

  Simulate.click(getByTestId('inlineEditFieldButton'));
  const input = getByTestId('inlineEditInput');
  input.value = 'Elefant';
  Simulate.change(input);

  Simulate.keyDown(input, { key: 'Enter', keyCode: 13, which: 13 });
  await wait();
  expect(actionFunc.calledWith('Elefant')).toBe(true);
});

it('Goes to edit mode, handles submit and shows error', async () => {
  const actionFunc = () => Promise.reject();
  const { getByTestId } = render(
    <InlineEditField
      title={'Test'}
      classes={() => {}}
      t={() => 'Errormelding'}
      onSubmit={actionFunc}
    />,
  );

  Simulate.click(getByTestId('inlineEditFieldButton'));
  const input = getByTestId('inlineEditInput');
  input.value = 'Elefant';
  Simulate.change(input);

  Simulate.click(getByTestId('inlineEditSaveButton'));
  await wait(() => getByTestId('inlineEditErrorMessage'));
});
