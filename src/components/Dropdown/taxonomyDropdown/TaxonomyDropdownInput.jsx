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
import { dropDownClasses } from '../common/dropDownClasses';
import { InputItems } from './';

const autosizeStyle = {
  border: 'none',
  outline: 'none',
  cursor: 'inherit',
  backgroundColor: 'transparent',
  fontSize: '18px',
};

const TaxonomyDropdownInput = props => {
  const {
    onRemoveItem,
    onWrapperClick,
    inputWrapperRef,
    inputProps,
    tagProps,
    name,
    getInputProps,
    selectedItem,
    messages,
  } = props;
  return (
    <div
      ref={inputWrapperRef}
      role="button"
      onClick={onWrapperClick}
      {...dropDownClasses('multiselect')}
      tabIndex="-1">
      <InputItems
        onRemoveItem={onRemoveItem}
        tagProps={tagProps}
        name={name}
        selectedItem={selectedItem}
        messages={messages}
      />
      <AutosizeInput
        key={name}
        placeholderIsMinWidth
        inputStyle={autosizeStyle}
        {...getInputProps({ name, ...inputProps })}
      />
    </div>
  );
};

TaxonomyDropdownInput.propTypes = {
  ...Downshift.propTypes,
  multiSelect: PropTypes.bool,
  getInputProps: PropTypes.func,
  onRemoveItem: PropTypes.func,
  onWrapperClick: PropTypes.func,
  inputWrapperRef: PropTypes.func,
  selectedItem: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  name: PropTypes.string,
  inputProps: PropTypes.shape({
    value: PropTypes.string,
    ref: PropTypes.func,
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    onFocus: PropTypes.func,
  }),
  tagProps: PropTypes.shape({
    handlePopupClick: PropTypes.func.isRequired,
  }),
  messages: PropTypes.shape({}),
};

export default TaxonomyDropdownInput;
