/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import Downshift from 'downshift';

const DropDownInput = ({ getInputProps, name, placeholder }) => (
  <input name={name} {...getInputProps({ placeholder })} />
);

DropDownInput.propTypes = {
  ...Downshift.propTypes,
};

DropDownInput.defaultProps = {
  placeholder: 'Type',
};

export default DropDownInput;
