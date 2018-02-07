/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import AutosizeInput from 'react-input-autosize';

const autosizeStyle = {
  border: 'none',
  outline: 'none',
  cursor: 'inherit',
  backgroundColor: 'transparent',
  fontSize: '18px',
};

const DropdownInput = props => {
  const { multiSelect, inputProps, name, getInputProps } = props;
  if (multiSelect) {
    return (
      <AutosizeInput
        key={name}
        placeholderIsMinWidth
        inputStyle={autosizeStyle}
        {...getInputProps({ name, ...inputProps })}
      />
    );
  }
  return <input {...getInputProps({ name, ...inputProps })} />;
};

DropdownInput.propTypes = {
  ...Downshift.propTypes,
  multiSelect: PropTypes.bool,
  getInputProps: PropTypes.func,
  name: PropTypes.string,
  inputProps: PropTypes.shape({
    value: PropTypes.string,
    ref: PropTypes.func,
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    onFocus: PropTypes.func,
  }),
};

export default DropdownInput;
