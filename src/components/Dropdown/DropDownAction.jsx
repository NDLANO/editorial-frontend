/**
* Copyright (c) 2016-present, NDLA.
*
* This source code is licensed under the GPLv3 license found in the
* LICENSE file in the root directory of this source tree. *
*/

import React from 'react';
import { Button } from 'ndla-ui';
import { Cross, Arrow } from 'ndla-ui/icons';
import { downShiftPropTypes, dropDownClasses } from './DropDown';

const DropDownAction = ({
  clearSelection,
  isOpen,
  selectedItem,
  openMenu,
  closeMenu,
}) => {
  if (selectedItem) {
    return (
      <Button {...dropDownClasses('action')} onClick={clearSelection} stripped>
        <Cross />
      </Button>
    );
  }
  const direction = isOpen ? 'up' : 'down';
  return (
    <Button
      {...dropDownClasses('action')}
      onClick={isOpen ? closeMenu : openMenu}
      stripped>
      <Arrow direction={direction} />
    </Button>
  );
};

DropDownAction.propTypes = {
  ...downShiftPropTypes,
};

export default DropDownAction;
