/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import Downshift from 'downshift';
import { Search } from 'ndla-icons/common';
import { Cross } from 'ndla-icons/action';
import { dropDownClasses } from './dropDownClasses';

const DropdownSearchAction = ({
  multiSelect,
  onToggleMenu,
  clearSelection,
  getButtonProps,
  selectedItem,
}) => {
  if (selectedItem && !multiSelect) {
    return (
      <Button
        {...dropDownClasses('action')}
        {...getButtonProps()}
        onClick={clearSelection}
        stripped>
        <Cross className="c-icon--medium" />
      </Button>
    );
  }

  return (
    <Button
      {...dropDownClasses('action')}
      {...getButtonProps()}
      onClick={onToggleMenu}
      stripped>
      <Search className="c-icon--medium" />
    </Button>
  );
};

DropdownSearchAction.propTypes = {
  ...Downshift.propTypes,
  multiSelect: PropTypes.bool,
  onToggleMenu: PropTypes.func,
};

DropdownSearchAction.defaultProps = {
  multiSelect: false,
  onToggleMenu: undefined,
};

export default DropdownSearchAction;
