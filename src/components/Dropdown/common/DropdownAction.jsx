/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Button from 'ndla-button';
import Downshift from 'downshift';
import { Cross, ExpandLess, ExpandMore } from '@ndla/icons/action';
import { dropDownClasses } from './dropDownClasses';

const DropdownAction = ({
  multiSelect,
  onToggleMenu,
  clearSelection,
  isOpen,
  selectedItem,
  openMenu,
  closeMenu,
}) => {
  if (selectedItem && !multiSelect) {
    return (
      <Button {...dropDownClasses('action')} onClick={clearSelection} stripped>
        <Cross className="c-icon--medium" />
      </Button>
    );
  }
  let onClick;
  if (onToggleMenu) {
    onClick = onToggleMenu;
  } else {
    onClick = isOpen ? closeMenu : openMenu;
  }
  return (
    <Button {...dropDownClasses('action')} onClick={onClick} stripped>
      {isOpen ? (
        <ExpandLess className="c-icon--medium" />
      ) : (
        <ExpandMore className="c-icon--medium" />
      )}
    </Button>
  );
};

DropdownAction.propTypes = {
  ...Downshift.propTypes,
  multiSelect: PropTypes.bool,
  onToggleMenu: PropTypes.func,
};

DropdownAction.defaultProps = {
  multiSelect: false,
  onToggleMenu: undefined,
};

export default DropdownAction;
