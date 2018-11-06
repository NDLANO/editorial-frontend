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
import { colors } from 'ndla-core';
import Button from 'ndla-button';
import { Cross } from 'ndla-icons/action';

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

export const EditorDeleteButton = props => (
  <Button stripped className={deleteButtonStyle} {...props}>
    <Cross />
  </Button>
);

EditorDeleteButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};
