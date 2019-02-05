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
import darken from 'polished/lib/color/darken';
import Tooltip from '@ndla/tooltip';
import { injectT } from '@ndla/i18n';
import { colors } from '@ndla/core';
import { EmbedShape } from '../../../../shapes';
import CrossButton from '../../../CrossButton';

export const figureButtonsStyle = css`
  position: absolute;
  top: 0.1rem;
  right: 0.2rem;
  display: flex;
  flex-flow: column;
`;

const rightAdjustedStyle = css`
  right: -1rem;
  top: -0.4rem;
`;

const StyledFigureButtons = styled('div')`
  ${figureButtonsStyle} ${p => (p.isNotCentered ? rightAdjustedStyle : null)};
`;

export const colorFigureButtonsLinkStyle = color => css`
  text-decoration: none;
  line-height: 1.625;
  box-shadow: none;
  color: ${color};

  &:hover,
  &:focus {
    text-decoration: none;
    color: ${darken(0.1, color)};
  }
`;

const FigureButtons = ({ embed, t, onRemoveClick }) => {

  const isNotCentered =
    embed.align === 'left' ||
    embed.align === 'right' ||
    embed.size === 'small' ||
    embed.size === 'xsmall';
  return (
    <StyledFigureButtons isNotCentered={isNotCentered}>
      <Tooltip tooltip="Ta bort bilde">
        <CrossButton
          css={colorFigureButtonsLinkStyle(colors.support.red)}
          onClick={onRemoveClick}
          stripped
          tabIndex={-1}
        />
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
