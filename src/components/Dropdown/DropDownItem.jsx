/**
* Copyright (c) 2016-present, NDLA.
*
* This source code is licensed under the GPLv3 license found in the
* LICENSE file in the root directory of this source tree. *
*/

import React from 'react';
import PropTypes from 'prop-types';
import { downShiftPropTypes, dropDownClasses } from './DropDown';

const DropDownItem = ({
  highlightedIndex,
  getItemProps,
  selectedItem,
  item,
  index,
  itemToString,
}) => {
  const isActive = highlightedIndex === index;
  const isSelected = selectedItem === item;
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
  ...downShiftPropTypes,
  item: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.number,
  ]).isRequired,
  index: PropTypes.number.isRequired,
  textField: PropTypes.string,
};

export default DropDownItem;
