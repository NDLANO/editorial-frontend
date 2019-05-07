/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import FormikFieldHelp from './FormikFieldHelp';
export const FormikRemainingCharacters = ({
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
