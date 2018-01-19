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
import DropdownTag from './DropdownTag';
import { dropDownClasses } from './dropDownClasses';

const DropdownInput = props => {
  const {
    multiSelect,
    onRemoveItem,
    onWrapperClick,
    inputWrapperRef,
    inputProps,
    name,
    getInputProps,
    selectedItem,
  } = props;
  if (multiSelect) {
    return (
      // eslint-disable-next-line
      <div
        ref={inputWrapperRef}
        onClick={onWrapperClick}
        {...dropDownClasses('multiselect')}
        tabIndex="-1">
        {selectedItem.map(tag => (
          <DropdownTag
            key={`${name}-tag-${tag.id}`}
            onRemoveItem={onRemoveItem}
            {...{ tag, name }}
          />
        ))}
        <AutosizeInput
          key={name}
          {...getInputProps({ name, ...inputProps })}
          placeholderIsMinWidth
          inputStyle={{
            border: 'none',
            outline: 'none',
            cursor: 'inherit',
            backgroundColor: 'transparent',
            fontSize: '18px',
          }}
        />
      </div>
    );
  }
  return <input {...getInputProps({ name, ...inputProps })} />;
};

DropdownInput.propTypes = {
  ...Downshift.propTypes,
  multiSelect: PropTypes.bool,
  onRemoveItem: PropTypes.func,
  onWrapperClick: PropTypes.func,
  inputWrapperRef: PropTypes.func,
  selectedItem: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  name: PropTypes.string,
  placeholder: PropTypes.string,
};

DropdownInput.defaultProps = {
  placeholder: 'Type',
};

export default DropdownInput;
