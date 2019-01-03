/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import Button from '@ndla/button'; //checked
import { spacing } from '@ndla/core';
import { css } from 'react-emotion';

const menuItemStyle = css`
  display: flex;
  align-items: center;
  margin: calc(${spacing.small} / 2);
`;

const MenuItemButton = ({ children, ...rest }) => {
  return (
    <Button css={menuItemStyle} {...rest}>
      {children}
    </Button>
  );
};

export default MenuItemButton;
