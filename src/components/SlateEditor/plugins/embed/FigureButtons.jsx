/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled, { css } from 'react-emotion';
import darken from 'polished/lib/color/darken';
import { injectT } from '@ndla/i18n';
import { colors } from '@ndla/core';
import { Pencil, Plus } from '@ndla/icons/action';
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

const FigureButtons = ({ embed, locale, figureType, t, onRemoveClick }) => {
  const url = {
    audio: {
      path: '/media/audio-upload',
      newTitle: t('form.addNewAudio'),
      editTitle: t('form.editAudio'),
    },
    image: {
      path: '/media/image-upload',
      newTitle: t('form.addNewImage'),
      editTitle: t('form.editImage'),
    },
  };

  const isNotCentered =
    embed.align === 'left' ||
    embed.align === 'right' ||
    embed.size === 'small' ||
    embed.size === 'xsmall';
  return (
    <StyledFigureButtons isNotCentered={isNotCentered}>
      <CrossButton
        css={colorFigureButtonsLinkStyle(colors.support.red)}
        onClick={onRemoveClick}
        stripped
      />
      <Link
        css={colorFigureButtonsLinkStyle(colors.brand.primary)}
        to={`${url[figureType].path}/new`}
        target="_blank"
        title={url[figureType].newTitle}>
        <Plus />
      </Link>
      <Link
        to={`${url[figureType].path}/${embed.resource_id}/edit/${locale}`}
        target="_blank"
        css={colorFigureButtonsLinkStyle(colors.support.green)}
        title={url[figureType].editTitle}>
        <Pencil />
      </Link>
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
