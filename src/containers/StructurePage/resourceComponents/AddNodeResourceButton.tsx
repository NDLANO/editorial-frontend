/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { css } from '@emotion/core';
import { colors, spacing } from '@ndla/core';
import Button from '@ndla/button';

const addButtonStyle = css`
  &,
  &:disabled,
  &:hover,
  &:focus {
    white-space: nowrap;
    color: ${colors.brand.grey};
    font-size: 1.2rem;
    border-left: 1px solid #eaeaea;
    border-right: 1px solid #eaeaea;
    background: linear-gradient(180deg, white, #e9eff2 50%, #e9eff2 100%);
    padding: 0 ${spacing.small};
    height: 100%;
  }
`;

interface Props {
  onClick: () => void;
  stripped?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

const AddNodeResourceButton = ({ children, ...rest }: Props) => (
  <Button type="button" css={addButtonStyle} {...rest}>
    {children}
  </Button>
);

export default AddNodeResourceButton;
