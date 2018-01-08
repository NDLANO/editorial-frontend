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
import ToolTip from '../ToolTip';
import { dropDownClasses } from './DropDown';

const DropDownInput = ({
  multiSelect,
  onRemoveItem,
  onWrapperClick,
  inputWrapperRef,
  inputProps,
  tagProps,
  selectedItem,
  getInputProps,
  name,
  placeholder,
}) => {
  if (multiSelect) {
    const { handlePopupClick } = tagProps;

    return (
      // eslint-disable-next-line
      <div
        ref={inputWrapperRef}
        onClick={onWrapperClick}
        {...dropDownClasses('multiselect')}
        tabIndex="-1">
        {selectedItem.map(
          (tag, index) =>
            name === 'resourceTypes' ? (
              <ToolTip
                key={`${name}-tooptip-${tag.id}`}
                name={name}
                direction="bottom"
                onPopupClick={() => handlePopupClick(tag, name)}
                noPopup={tag === tagProps.primaryResourceType}
                messages={{ ariaLabel: 'tooltip' }}
                content="Velg som primærkoblet emne">
                <DropdownTag
                  key={`${name}-tag-${tag.id}`}
                  onRemoveItem={onRemoveItem}
                  {...{ tag, name, index, ...tagProps }}
                />
              </ToolTip>
            ) : (
              <DropdownTag
                key={`${name}-tag-${tag.id}`}
                onRemoveItem={onRemoveItem}
                {...{ tag, name, index, ...tagProps }}
              />
            ),
        )}
        <AutosizeInput
          key={name}
          {...getInputProps({ name, placeholder, ...inputProps })}
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
  return <input {...getInputProps({ name, placeholder })} />;
};
DropDownInput.propTypes = {
  ...Downshift.propTypes,
  multiSelect: PropTypes.bool,
  onRemoveItem: PropTypes.func,
  onWrapperClick: PropTypes.func,
  inputWrapperRef: PropTypes.func,
  selectedItem: PropTypes.arrayOf(PropTypes.shape),
  name: PropTypes.string,
  placeholder: PropTypes.string,
  inputProps: PropTypes.shape({
    value: PropTypes.string,
    ref: PropTypes.func,
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    onFocus: PropTypes.func,
  }),
  tagProps: PropTypes.shape({
    primaryResourceType: PropTypes.shape({}),
  }),
};

DropDownInput.defaultProps = {
  placeholder: 'Type',
};

export default DropDownInput;
