/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Tooltip from '@ndla/tooltip';
import { spacing } from '@ndla/core';
import { Link as LinkIcon } from '@ndla/icons/common';
import { DeleteForever } from '@ndla/icons/editor';
import { injectT, tType } from '@ndla/i18n';
import SafeLink from '@ndla/safelink';
import { Link } from 'react-router-dom';
import IconButton from '../../../IconButton';
import { Embed } from '../../../../interfaces';

const centerAdjustedStyle = css`
  right: -${spacing.xsmall};
`;

const rightAdjustedStyle = css`
  right: -${spacing.spacingUnit * 1.25}px;
`;

const leftAdjustedStyle = css`
  left: -${spacing.spacingUnit * 1.25}px;
`;

interface StyledFigureButtonsProps {
  align: string;
  withMargin: boolean | undefined;
}

const StyledFigureButtons = styled('div')`
  position: absolute;
  top: 0;
  z-index: 1;

  ${(p: StyledFigureButtonsProps) =>
    p.align !== 'left' && p.align !== 'right' && centerAdjustedStyle}
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

interface Props {
  embed: Embed;
  figureType: string;
  language: string;
  onEdit?: Function;
  onRemoveClick: Function;
  providerName?: string;
  tooltip: string;
  withMargin?: boolean;
}

interface embedProps {
  path: string;
  editTitle: string;
}

interface urlProps {
  [key: string]: embedProps;
}

const FigureButtons: React.FC<Props & tType> = ({
  t,
  embed,
  figureType,
  language,
  onEdit,
  onRemoveClick,
  providerName,
  tooltip,
  withMargin,
}) => {
  const url: urlProps = {
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
    <StyledFigureButtons align={embed.align} theme={{}} withMargin={withMargin}>
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
          <IconButton type="button" tabIndex={-1} onClick={onEdit}>
            <LinkIcon />
          </IconButton>
        </Tooltip>
      )}
      {figureType === 'video' && embed.resource === 'brightcove' && (
        <Tooltip tooltip={t('form.video.brightcove')} align="right">
          <IconButton
            as={SafeLink}
            to={`https://studio.brightcove.com/products/videocloud/media/videos/${embed.videoid}`}
            target="_blank"
            title={t('form.video.brightcove')}
            tabIndex={-1}>
            <LinkIcon />
          </IconButton>
        </Tooltip>
      )}
    </StyledFigureButtons>
  );
};

export default injectT(FigureButtons);
