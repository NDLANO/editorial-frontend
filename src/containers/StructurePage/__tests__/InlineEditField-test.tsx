/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { render, fireEvent, cleanup, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MenuItemEditField from '../folderComponents/menuOptions/components/MenuItemEditField';

afterEach(cleanup);

it('Goes to edit mode, handles submit', async () => {
  const actionFunc = jest.fn();
  const { getByTestId, container, findByTestId, findByDisplayValue } = render(
    <MenuItemEditField onClose={() => {}} onSubmit={actionFunc} />,
  );
  expect(container.firstChild).toMatchSnapshot();

  const input = getByTestId('inlineEditInput');
  act(() => {
    fireEvent.change(input, { target: { value: 'Elefant' } });
  });
  await findByDisplayValue('Elefant').then(_ => {});

  act(() => {
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13, which: 13 });
  });
  expect(await findByTestId('inlineEditSpinner')).not.toBeInTheDocument();
  expect(actionFunc).toHaveBeenCalledWith('Elefant');
});

it('Goes to edit mode, handles submit and shows error', async () => {
  const actionFunc = () => Promise.reject(new Error('Test error'));
  const { getByTestId, findByDisplayValue, findByTestId } = render(
    <MenuItemEditField onClose={() => {}} onSubmit={actionFunc} />,
  );

  const input = getByTestId('inlineEditInput');
  act(() => {
    fireEvent.change(input, { target: { value: 'Elefant' } });
  });
  await findByDisplayValue('Elefant');

  act(() => {
    fireEvent.click(getByTestId('inlineEditSaveButton'));
  });
  await findByTestId('inlineEditErrorMessage');
});
