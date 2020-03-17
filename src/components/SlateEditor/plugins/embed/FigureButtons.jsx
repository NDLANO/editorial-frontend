/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Tooltip from '@ndla/tooltip';
import { spacing } from '@ndla/core';
import { Link as LinkIcon } from '@ndla/icons/common';
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
  z-index: 1;

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

const FigureButtons = ({
  t,
  embed,
  language,
  tooltip,
  figureType,
  onRemoveClick,
  withMargin,
  providerName,
  onEdit,
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
          tabIndex={-1}
          data-cy="remove-element">
          <DeleteForever />
        </IconButton>
      </Tooltip>
      {(figureType === 'image' || figureType === 'audio') && (
        <Tooltip tooltip={url[figureType].editTitle} align="right">
          <IconButton
            as={Link}
            to={`${url[figureType].path}/${embed.resource_id}/edit/${language}`}
            target="_blank"
            title={url[figureType].editTitle}
            tabIndex={-1}>
            <LinkIcon />
          </IconButton>
        </Tooltip>
      )}
      {figureType === 'external' && onEdit && (
        <Tooltip
          tooltip={t('form.external.edit', {
            type: providerName || t('form.external.title'),
          })}
          align="right">
          <IconButton tabIndex={-1} onClick={onEdit}>
            <LinkIcon />
          </IconButton>
        </Tooltip>
      )}
    </StyledFigureButtons>
  );
};

FigureButtons.propTypes = {
  onRemoveClick: PropTypes.func.isRequired,
  embed: EmbedShape.isRequired,
  tooltip: PropTypes.string.isRequired,
  figureType: PropTypes.string.isRequired,
  language: PropTypes.string,
  withMargin: PropTypes.bool,
  onEdit: PropTypes.func,
  providerName: PropTypes.string,
};

export default FigureButtons;
