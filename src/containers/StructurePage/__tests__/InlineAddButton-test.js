/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { render, Simulate } from 'react-testing-library';
import sinon from 'sinon';
import InlineAddButton from '../components/InlineAddButton';

it('Goes to edit mode, handles input and calls action prop', async () => {
  const actionFunc = sinon.spy();
  const { getByTestId, container } = render(
    <InlineAddButton title={'Test'} action={actionFunc} />,
  );
  expect(container.firstChild).toMatchSnapshot();

  Simulate.click(getByTestId('AddSubjectButton'));
  const input = getByTestId('addSubjectInputField');
  input.value = 'Elefant';
  Simulate.change(input);
  expect(container.firstChild).toMatchSnapshot();

  Simulate.keyDown(input, { key: 'Enter', keyCode: 13, which: 13 });
  expect(container.firstChild).toMatchSnapshot();
  expect(actionFunc.calledOnce).toBe(true);
});
