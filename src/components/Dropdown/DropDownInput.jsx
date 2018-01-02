/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';

const DropDownInput = ({ getInputProps, onInputChange }) => (
  <input name="dropdown-search" {...getInputProps({ placeholder: 'Type', onChange: onInputChange})} />
);

DropDownInput.propTypes = {
  ...Downshift.propTypes,
  onInputChange: PropTypes.func.isRequired,
};

export default DropDownInput;
