/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import PropTypes from 'prop-types';
import FormFieldHelp from './FormFieldHelp';

interface Props {
  value: string;
  maxLength: number;
  getRemainingLabel: (maxLength: number, remaining: number) => ReactNode;
}

export const FormRemainingCharacters = ({ value, maxLength, getRemainingLabel }: Props) => {
  const currentLength = value ? value.length : 0;
  return (
    <FormFieldHelp float="right">
      {getRemainingLabel(maxLength, maxLength - currentLength)}
    </FormFieldHelp>
  );
};

FormRemainingCharacters.propTypes = {
  value: PropTypes.string.isRequired,
  maxLength: PropTypes.number.isRequired,
  getRemainingLabel: PropTypes.func.isRequired,
};

export default FormRemainingCharacters;
