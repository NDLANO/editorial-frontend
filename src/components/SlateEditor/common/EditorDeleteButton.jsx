/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { darken } from 'polished';
import { colors } from '@ndla/core';
import DeleteButton from '../../DeleteButton';

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
  <DeleteButton stripped css={deleteButtonStyle} tabIndex="-1" {...props} />
);

EditorDeleteButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};
