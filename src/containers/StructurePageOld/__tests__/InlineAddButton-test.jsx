/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { render, fireEvent, cleanup } from '@testing-library/react';
import { InlineAddButton } from '../../../components/InlineAddButton';

afterEach(cleanup);

it('Goes to edit mode, handles input and calls action prop', async () => {
  const actionFunc = jest.fn();
  const { getByTestId, container } = render(<InlineAddButton title="Test" action={actionFunc} />);
  expect(container.firstChild).toMatchSnapshot();

  fireEvent.click(getByTestId('AddSubjectButton'));
  const input = getByTestId('addSubjectInputField');
  fireEvent.change(input, { target: { value: 'Elefant' } });
  expect(container.firstChild).toMatchSnapshot();

  fireEvent.keyDown(input, { key: 'Enter', keyCode: 13, which: 13 });
  expect(container.firstChild).toMatchSnapshot();
  expect(actionFunc).toHaveBeenCalledTimes(1);
});
