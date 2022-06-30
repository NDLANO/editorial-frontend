/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, MouseEvent } from 'react';

import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Tooltip from '@ndla/tooltip';
import { spacing, spacingUnit } from '@ndla/core';
import { Link as LinkIcon } from '@ndla/icons/common';
import { Pencil } from '@ndla/icons/action';
import { DeleteForever } from '@ndla/icons/editor';
import { useTranslation } from 'react-i18next';
import SafeLink from '@ndla/safelink';
import { Link } from 'react-router-dom';
import IconButton from '../../../IconButton';
import { Embed } from '../../../../interfaces';

const centerAdjustedStyle = css`
  right: -${spacing.xsmall};
`;

const rightAdjustedStyle = css`
  right: -${spacingUnit * 1.25}px;
`;

const leftAdjustedStyle = css`
  left: -${spacingUnit * 1.25}px;
`;

interface StyledFigureButtonsProps {
  align: string;
  withMargin: boolean | undefined;
}

const StyledFigureButtons = styled('div')`
  position: absolute;
  top: 0;

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
  onEdit?: (event: MouseEvent) => void;
  onRemoveClick: (event: MouseEvent) => void;
  providerName?: string;
  tooltip: string;
  withMargin?: boolean;
  children?: ReactNode;
}

interface embedProps {
  path: string;
  editTitle: string;
}

interface urlProps {
  [key: string]: embedProps;
}

const FigureButtons = ({
  embed,
  figureType,
  language,
  onEdit,
  onRemoveClick,
  providerName,
  tooltip,
  withMargin,
  children,
}: Props) => {
  const { t } = useTranslation();
  const url: urlProps = {
    audio: {
      path: '/media/audio-upload',
      editTitle: t('form.editAudio'),
    },
    podcast: {
      path: '/media/podcast-upload',
      editTitle: t('form.editPodcast'),
    },
    image: {
      path: '/media/image-upload',
      editTitle: t('form.editOriginalImage'),
    },
  };

  return (
    <StyledFigureButtons
      align={'align' in embed && !!embed.align ? embed.align : ''}
      theme={{}}
      withMargin={withMargin}
      contentEditable={false}>
      <Tooltip tooltip={tooltip}>
        <IconButton
          color="red"
          type="button"
          onClick={onRemoveClick}
          tabIndex={-1}
          data-cy="remove-element">
          <DeleteForever />
        </IconButton>
      </Tooltip>
      {(figureType === 'image' || figureType === 'audio' || figureType === 'podcast') &&
        (embed.resource === 'image' || embed.resource === 'audio') && (
          <Tooltip tooltip={url[figureType].editTitle}>
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
          })}>
          <IconButton type="button" tabIndex={-1} onClick={onEdit}>
            <LinkIcon />
          </IconButton>
        </Tooltip>
      )}
      {figureType === 'video' && embed.resource === 'brightcove' && (
        <>
          <Tooltip tooltip={t('form.video.brightcove')}>
            <IconButton
              as={SafeLink}
              to={`https://studio.brightcove.com/products/videocloud/media/videos/${
                embed.videoid.split('&t=')[0]
              }`}
              target="_blank"
              title={t('form.video.brightcove')}
              tabIndex={-1}>
              <LinkIcon />
            </IconButton>
          </Tooltip>
          {children}
        </>
      )}
      {(figureType === 'video' || figureType === 'image') && (
        <Tooltip
          tooltip={figureType === 'video' ? t('form.video.editVideo') : t('form.image.editImage')}>
          <IconButton type="button" tabIndex={-1} onClick={onEdit}>
            <Pencil />
          </IconButton>
        </Tooltip>
      )}
    </StyledFigureButtons>
  );
};

export default FigureButtons;
