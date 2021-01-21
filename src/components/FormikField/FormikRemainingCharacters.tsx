/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import FormikFieldHelp from './FormikFieldHelp';

interface Props {
  value: string;
  maxLength: number;
  getRemainingLabel: (maxLength: number, remaining: number) => ReactNode;
}

export const FormikRemainingCharacters: FC<Props> = ({
  value,
  maxLength,
  getRemainingLabel,
}) => {
  const currentLength = value ? value.length : 0;
  return (
    <FormikFieldHelp float="right">
      {getRemainingLabel(maxLength, maxLength - currentLength)}
    </FormikFieldHelp>
  );
};

FormikRemainingCharacters.propTypes = {
  value: PropTypes.string.isRequired,
  maxLength: PropTypes.number.isRequired,
  getRemainingLabel: PropTypes.func.isRequired,
};

export default FormikRemainingCharacters;
