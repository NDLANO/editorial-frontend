/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { css } from '@emotion/core';
import { DeleteForever } from '@ndla/icons/editor';
import { colors, spacing } from '@ndla/core';

export const buttonStyle = css`
  margin: 0;
  padding: 0;
  background: 0;
  border: 0;
  color: ${colors.support.redLight};
  width: ${spacing.normal};
  height: ${spacing.normal};

  svg {
    width: 22px;
    height: 22px;
    position: relative;
    z-index: 1;
    pointer-events: none;
  }

  &::before {
    content: '';
    display: block;
    position: absolute;
    width: ${spacing.normal};
    height: ${spacing.normal};
    background: ${colors.support.redLight};
    border-radius: 100%;
    transform: scale(0.5);
    opacity: 0;
    transition: all 200ms ease;
  }

  &:hover,
  &:focus {
    color: ${colors.support.red};

    &::before {
      transform: scale(1.25);
      opacity: 1;
    }
  }
`;

export const DeleteSectionButton = ({ children, ...rest }) => (
  <button type="button" css={buttonStyle} {...rest}>
    <DeleteForever />
  </button>
);

export default DeleteSectionButton;
