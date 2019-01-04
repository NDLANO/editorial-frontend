/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'react-emotion';
import { colors } from '@ndla/core';
import Button from '@ndla/button'; //checked

const activeButtonStyle = css`
  color: ${colors.brand.primary};

  &:focus,
  &:hover {
    color: ${colors.brand.primary};
  }
`;

const ImageEditorButton = ({ isActive, children, ...rest }) => {
  return (
    <Button css={isActive ? activeButtonStyle : null} {...rest}>
      {children}
    </Button>
  );
};
ImageEditorButton.propTypes = {
  isActive: PropTypes.bool,
};

ImageEditorButton.defaultProps = {
  isActive: false,
};

export default ImageEditorButton;
