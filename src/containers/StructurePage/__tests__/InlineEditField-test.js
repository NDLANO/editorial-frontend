/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { render, fireEvent, wait, cleanup } from 'react-testing-library';
import MenuItemEditField from '../folderComponents/menuOptions/MenuItemEditField';

afterEach(cleanup);

it('Goes to edit mode, handles submit', async () => {
  const actionFunc = jest.fn();
  const { getByTestId, container } = render(
    <MenuItemEditField
      title="Test"
      onClose={() => {}}
      t={() => {}}
      onSubmit={actionFunc}
    />,
  );
  expect(container.firstChild).toMatchSnapshot();

  const input = getByTestId('inlineEditInput');
  input.value = 'Elefant';
  fireEvent.change(input);

  fireEvent.keyDown(input, { key: 'Enter', keyCode: 13, which: 13 });
  await wait();
  expect(actionFunc).toHaveBeenCalledWith('Elefant');
});

it('Goes to edit mode, handles submit and shows error', async () => {
  const actionFunc = () => Promise.reject(new Error('Test error'));
  const { getByTestId } = render(
    <MenuItemEditField
      title="Test"
      t={() => 'Errormelding'}
      onSubmit={actionFunc}
    />,
  );

  const input = getByTestId('inlineEditInput');
  input.value = 'Elefant';
  fireEvent.change(input);

  fireEvent.click(getByTestId('inlineEditSaveButton'));
  await wait(() => getByTestId('inlineEditErrorMessage'));
});
