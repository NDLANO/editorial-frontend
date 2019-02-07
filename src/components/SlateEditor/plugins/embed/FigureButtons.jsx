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
import { injectT } from '@ndla/i18n';
import { EmbedShape } from '../../../../shapes';
import DeleteSectionButton from '../../../DeleteSectionButton';

export const figureButtonsStyle = css`
  position: absolute;
  top: 0;
  right: -${spacing.small};
`;

const rightAdjustedStyle = css`
  right: -1rem;
  top: -0.4rem;
`;

const StyledFigureButtons = styled('div')`
  ${figureButtonsStyle} ${p => (p.isNotCentered ? rightAdjustedStyle : null)}
`;

export const FigureButtons = ({ embed, t, onRemoveClick }) => {
  const isNotCentered =
    embed.align === 'left' ||
    embed.align === 'right' ||
    embed.size === 'small' ||
    embed.size === 'xsmall';
  return (
    <StyledFigureButtons isNotCentered={isNotCentered}>
      <Tooltip tooltip="Ta bort bilde">
        <DeleteSectionButton onClick={onRemoveClick} tabIndex={-1} />
      </Tooltip>
    </StyledFigureButtons>
  );
};

FigureButtons.propTypes = {
  onRemoveClick: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  embed: EmbedShape.isRequired,
  figureType: PropTypes.string.isRequired,
};

export default injectT(FigureButtons);
