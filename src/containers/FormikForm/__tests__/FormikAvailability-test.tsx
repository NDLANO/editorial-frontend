/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { render } from 'enzyme';
import { FieldInputProps } from 'formik';
// @ts-ignore
import IntlWrapper from '../../../util/__tests__/IntlWrapper';
import AvailabilityForm from '../components/AvailabilityForm';

const mockField: FieldInputProps<string[]> = {
  name: 'asd',
  value: ['asd2'],
  onBlur: () => {},
  onChange: () => {},
};

describe('<AvailabilityForm />', () => {
  it('renders correctly and sets availability to Alle when everyone is passed as prop', () => {
    const wrapper = render(
      <IntlWrapper>
        <AvailabilityForm availability={'everyone'} field={mockField} />
      </IntlWrapper>,
    );

    const h1Text = wrapper.find('h1').text();
    const inputList = wrapper.find('input[aria-checked]');
    const labels = wrapper.find('label');

    expect(h1Text).toBe('Hvem er artikkelen ment for:');
    expect(inputList.length).toBe(3);
    expect(labels.length).toBe(3);
    expect(labels.text()).toBe('AlleLærereElever');
    expect(inputList.first().attr()['aria-checked']).toBe('true');
  });
});
