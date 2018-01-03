/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import isEmpty from 'lodash/fp/isEmpty';
import DropDownItem from './DropdownItem';
import { dropDownClasses } from './dropDownClasses';
import {
  valueFieldForItem,
  downShiftSorter,
} from '../../../util/downShiftHelpers';

const DropdownMenu = props => {
  const {
    isOpen,
    multiSelect,
    asyncSelect,
    items,
    messages,
    valueField,
    inputValue,
    textField,
  } = props;

  const values = inputValue && !asyncSelect
    ? downShiftSorter(items, inputValue, textField)
    : items;

  return !isOpen ? null : (
    <div {...dropDownClasses('items')}>
      {!isEmpty(values) ? (
        values.map((item, index) => (
          <DropDownItem
            key={valueFieldForItem(item, valueField)}
            {...props}
            item={item}
            index={index}
            multiSelect={multiSelect}
          />
        ))
      ) : (
        <div {...dropDownClasses('empty')}>
          {isEmpty(items) ? messages.emptyList : messages.emptyFilter}
        </div>
      )}
    </div>
  );
};

DropdownMenu.propTypes = {
  ...Downshift.propTypes,
  multiSelect: PropTypes.bool,
  asyncSelect: PropTypes.bool,
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.number]),
  ).isRequired,
  textField: PropTypes.string,
};

export default DropdownMenu;
