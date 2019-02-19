/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'react-emotion';
import Tooltip from '@ndla/tooltip';
import { spacing } from '@ndla/core';
import { EmbedShape } from '../../../../shapes';
import DeleteSectionButton from '../../../DeleteSectionButton';

const centerAdjustedStyle = css`
  right: -${spacing.xsmall};
`;

const rightAdjustedStyle = css`
  right: -${spacing.spacingUnit * 1.25}px;
`;

const leftAdjustedStyle = css`
  left: -${spacing.spacingUnit * 1.25}px;
`;

const StyledFigureButtons = styled('div')`
  position: absolute;
  ${p => p.align !== 'left' && p.align !== 'right' && centerAdjustedStyle}
  ${p => p.align === 'left' && leftAdjustedStyle}
  ${p => p.align === 'right' && rightAdjustedStyle}
`;

export const FigureButtons = ({ embed, tooltip, onRemoveClick }) => {
  return (
    <StyledFigureButtons align={embed.align}>
      <Tooltip tooltip={tooltip}>
        <DeleteSectionButton onClick={onRemoveClick} tabIndex={-1} />
      </Tooltip>
    </StyledFigureButtons>
  );
};

FigureButtons.propTypes = {
  onRemoveClick: PropTypes.func.isRequired,
  embed: EmbedShape.isRequired,
  tooltip: PropTypes.string.isRequired,
};

export default FigureButtons;
