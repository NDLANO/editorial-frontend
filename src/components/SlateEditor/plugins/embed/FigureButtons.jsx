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
import { injectT } from '@ndla/i18n';
import Tooltip from '@ndla/tooltip';
import { spacing } from '@ndla/core';
import { Pencil } from '@ndla/icons/action';
import { DeleteForever } from '@ndla/icons/editor';
import { Link } from 'react-router-dom';
import { EmbedShape } from '../../../../shapes';
import IconButton from '../../../IconButton';

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
  top: 0;
  ${p => p.align !== 'left' && p.align !== 'right' && centerAdjustedStyle}
  ${p => p.align === 'left' && leftAdjustedStyle}
  ${p => p.align === 'right' && rightAdjustedStyle}
  > * {
    margin-bottom: ${spacing.xsmall};
  }
  ${p =>
    p.withMargin &&
    css`
      margin: ${spacing.small};
    `}
`;

export const FigureButtons = ({
  t,
  embed,
  locale,
  tooltip,
  figureType,
  onRemoveClick,
  withMargin,
}) => {
  const url = {
    audio: {
      path: '/media/audio-upload',
      editTitle: t('form.editAudio'),
    },
    image: {
      path: '/media/image-upload',
      editTitle: t('form.editOriginalImage'),
    },
  };

  return (
    <StyledFigureButtons align={embed.align} withMargin={withMargin}>
      <Tooltip tooltip={tooltip} align="right">
        <IconButton
          color="red"
          type="button"
          onClick={onRemoveClick}
          tabIndex={-1}>
          <DeleteForever />
        </IconButton>
      </Tooltip>
      <Tooltip tooltip={url[figureType].editTitle} align="right">
        <IconButton
          tag={Link}
          to={`${url[figureType].path}/${embed.resource_id}/edit/${locale}`}
          target="_blank"
          title={url[figureType].editTitle}
          color="green"
          tabIndex={-1}>
          <Pencil />
        </IconButton>
      </Tooltip>
    </StyledFigureButtons>
  );
};

FigureButtons.propTypes = {
  onRemoveClick: PropTypes.func.isRequired,
  embed: EmbedShape.isRequired,
  tooltip: PropTypes.string.isRequired,
  figureType: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  withMargin: PropTypes.bool,
};

export default injectT(FigureButtons);
