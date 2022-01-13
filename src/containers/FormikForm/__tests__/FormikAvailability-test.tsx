/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldInputProps } from 'formik';
import { act, fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlWrapper from '../../../util/__tests__/IntlWrapper';
import AvailabilityField from '../components/AvailabilityField';
import { AvailabilityType } from '../../../interfaces';

const mockField: FieldInputProps<AvailabilityType> = {
  name: 'asd',
  value: 'everyone',
  onBlur: () => {},
  onChange: () => {},
};

describe('<AvailabilityField />', () => {
  it('renders correctly and sets availability to Alle when everyone is passed as prop', () => {
    const { getAllByRole, getByRole } = render(
      <IntlWrapper>
        <AvailabilityField field={mockField} />
      </IntlWrapper>,
    );

    expect(getByRole('heading')).toHaveTextContent('Hvem er artikkelen ment for:');
    expect(getAllByRole('radio')).toHaveLength(3);
    expect(getByRole('radio', { name: 'Alle' })).toBeChecked();

    act(() => {
      fireEvent.click(getByRole('radio', { name: 'Elever' }));
    });

    expect(getByRole('radio', { name: 'Alle' })).not.toBeChecked();
    expect(getByRole('radio', { name: 'Elever' })).toBeChecked();
  });
});
