/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import Button from '@ndla/button';
import AutosizeInput from 'react-input-autosize';
import { Search } from '@ndla/icons/common';
import { css } from 'react-emotion';
import { dropDownClasses } from '.';

const autosizeStyle = {
  border: 'none',
  outline: 'none',
  cursor: 'inherit',
  backgroundColor: 'transparent',
  fontSize: '18px',
};

const searchIconStyle = css`
  position: absolute;
  top: 2px;
  right: 3px;
  color: #4d4d4d;
`;

const DropdownInput = props => {
  const {
    multiSelect,
    inputProps,
    name,
    getInputProps,
    testid,
    className,
    onToggleMenu,
  } = props;
  if (multiSelect) {
    return (
      <AutosizeInput
        key={name}
        placeholderIsMinWidth
        inputStyle={autosizeStyle}
        {...getInputProps({ name, ...inputProps })}
        {...dropDownClasses('multiselect')}
      />
    );
  }

  return (
    <React.Fragment>
      <input
        {...getInputProps({ name, ...inputProps })}
        {...dropDownClasses('single')}
        data-testid={testid}
        className={className}
      />
      <Button stripped css={searchIconStyle} onClick={onToggleMenu}>
        <Search className="c-icon--medium" />
      </Button>
    </React.Fragment>
  );
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
