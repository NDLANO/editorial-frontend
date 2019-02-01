/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'react-emotion';
import darken from 'polished/lib/color/darken';
import { colors } from '@ndla/core';
import CrossButton from './CrossButton';

const deleteButtonStyle = css`
  position: absolute;
  top: 0.1rem;
  right: 0.2rem;
  color: ${colors.support.red};

  &:hover,
  &:focus {
    color: ${darken(0.2, colors.support.red)};
  }
`;

export const DeleteButton = ({ children, style, ...rest }) => (
  <CrossButton stripped css={[deleteButtonStyle, style]} {...rest} />
);

DeleteButton.propTypes = {
  style: PropTypes.object,
};

export default DeleteButton;
