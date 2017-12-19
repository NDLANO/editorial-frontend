/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import { dropDownClasses } from './DropDown';

const DropDownItem = ({
  highlightedIndex,
  getItemProps,
  selectedItem,
  item,
  index,
  itemToString,
  multiSelect,
}) => {
  const isActive = highlightedIndex === index;
  const isSelected = multiSelect
    ? selectedItem.indexOf(item) > -1
    : selectedItem === item;
  const text = itemToString(item);
  return (
    <div
      {...dropDownClasses('item', isActive ? 'active' : '')}
      {...getItemProps({
        item,
      })}>
      {isSelected ? <strong>{text}</strong> : text}
    </div>
  );
};

DropDownItem.propTypes = {
  ...Downshift.propTypes,
  item: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.number,
  ]).isRequired,
  index: PropTypes.number.isRequired,
  textField: PropTypes.string,
  multiSelect: PropTypes.bool,
};

DropDownItem.defaultProps = {
  multiSelect: false,
};

export default DropDownItem;
