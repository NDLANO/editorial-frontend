/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import Button from '@ndla/button'; //checked
import { colors } from '@ndla/core';
import { css } from 'react-emotion';

export const dropdownActionButtonStyle = css`
  position: absolute;
  right: 0.8rem;
  top: 0.1rem;
  color: ${colors.brand.grey};

  &:hover,
  &:focus {
    outline: none;
    color: ${colors.brand.grey};
  }
`;

const DropdownActionButton = ({ children, ...rest }) => {
  return (
    <Button css={dropdownActionButtonStyle} {...rest}>
      {children}
    </Button>
  );
};

export default DropdownActionButton;
