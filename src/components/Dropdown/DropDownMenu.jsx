/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import DropDownItem from './DropDownItem';
import { dropDownClasses } from './DropDown';
import {
  valueFieldForItem,
  downShifhtSorter,
} from '../../util/downShifhtHelpers';

const DropDownMenu = props => {
  const { isOpen, items, valueField, inputValue, textField } = props;
  const values = inputValue
    ? downShifhtSorter(items, inputValue, textField)
    : items;
  return !isOpen ? null : (
    <div {...dropDownClasses('items')}>
      {values.map((item, index) => (
        <DropDownItem
          key={valueFieldForItem(item, valueField)}
          {...props}
          item={item}
          index={index}
        />
      ))}
    </div>
  );
};

DropDownMenu.propTypes = {
  ...Downshift.propTypes,
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.number]),
  ).isRequired,
  textField: PropTypes.string,
};

export default DropDownMenu;
