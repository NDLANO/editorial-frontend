/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import darken from 'polished/lib/color/darken';
import { colors } from '@ndla/core';
import DeleteForeverButton from './DeleteForeverButton';

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
  <DeleteForeverButton
    data-cy="close-related-button"
    stripped
    css={[deleteButtonStyle, style]}
    {...rest}
  />
);

DeleteButton.propTypes = {
  style: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default DeleteButton;
