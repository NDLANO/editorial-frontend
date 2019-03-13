/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Button from '@ndla/button';
import { css } from '@emotion/core';
import { colors } from '@ndla/core';

const MastheadButton = ({ children, color, minWidth, ...rest }) => {
  const buttonStyle = css`
    &,
    &:hover,
    &:focus {
      color: ${color};
      min-width: ${minWidth}rem;
      border: 1px solid #777;
      justify-content: space-between;
      border-radius: 1px;
      display: flex;
      background-color: white;
      padding: 0.2rem;
      height: 42px;
    }
  `;
  return (
    <Button {...rest} css={buttonStyle}>
      {children}
    </Button>
  );
};

MastheadButton.propTypes = {
  color: PropTypes.string,
  minWidth: PropTypes.number,
};

MastheadButton.defaultProps = {
  color: colors.brand.grey,
  minWidth: 0,
};

export default MastheadButton;
