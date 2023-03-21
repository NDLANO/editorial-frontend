/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, MouseEvent } from 'react';

import styled from '@emotion/styled';
import { css } from '@emotion/react';
import Tooltip from '@ndla/tooltip';
import { spacing, spacingUnit } from '@ndla/core';
import { Link as LinkIcon } from '@ndla/icons/common';
import { Pencil } from '@ndla/icons/action';
import { DeleteForever } from '@ndla/icons/editor';
import { useTranslation } from 'react-i18next';
import { SafeLinkIconButton } from '@ndla/safelink';
import { IconButtonV2 } from '@ndla/button';
import { Embed } from '../../../../interfaces';

const rightAdjustedStyle = css`
  right: -${spacingUnit * 1.2}px;
`;

const leftAdjustedStyle = css`
  left: -${spacingUnit * 1.2}px;
`;

interface StyledFigureButtonsProps {
  align: string;
  withMargin: boolean | undefined;
}

const StyledFigureButtons = styled('div')`
  position: absolute;
  top: 0;

  ${(p: StyledFigureButtonsProps) =>
    p.align !== 'left' && p.align !== 'right' && rightAdjustedStyle}
  ${p => p.align === 'right' && rightAdjustedStyle}
  ${p => p.align === 'left' && leftAdjustedStyle}
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
      contentEditable={false}
    >
      <Tooltip tooltip={tooltip}>
        <IconButtonV2
          aria-label={tooltip}
          colorTheme="danger"
          variant="ghost"
          onClick={onRemoveClick}
          data-cy="remove-element"
        >
          <DeleteForever />
        </IconButtonV2>
      </Tooltip>
      {(figureType === 'image' || figureType === 'audio' || figureType === 'podcast') &&
        (embed.resource === 'image' || embed.resource === 'audio') && (
          <Tooltip tooltip={url[figureType].editTitle}>
            <SafeLinkIconButton
              variant="ghost"
              colorTheme="light"
              to={`${url[figureType].path}/${embed.resource_id}/edit/${language}`}
              target="_blank"
              title={url[figureType].editTitle}
              tabIndex={-1}
            >
              <LinkIcon />
            </SafeLinkIconButton>
          </Tooltip>
        )}
      {figureType === 'external' && onEdit && (
        <Tooltip
          tooltip={t('form.external.edit', {
            type: providerName || t('form.external.title'),
          })}
        >
          <IconButtonV2
            aria-label={t('form.external.edit', { type: providerName || t('form.external.title') })}
            variant="ghost"
            colorTheme="light"
            onClick={onEdit}
          >
            <LinkIcon />
          </IconButtonV2>
        </Tooltip>
      )}
      {figureType === 'video' && embed.resource === 'brightcove' && (
        <>
          <Tooltip tooltip={t('form.video.brightcove')}>
            <SafeLinkIconButton
              aria-label={t('form.video.brightcove')}
              variant="ghost"
              colorTheme="light"
              to={`https://studio.brightcove.com/products/videocloud/media/videos/${
                embed.videoid.split('&t=')[0]
              }`}
              target="_blank"
            >
              <LinkIcon />
            </SafeLinkIconButton>
          </Tooltip>
          {children}
        </>
      )}
      {(figureType === 'video' || figureType === 'image') && (
        <Tooltip
          tooltip={figureType === 'video' ? t('form.video.editVideo') : t('form.image.editImage')}
        >
          <IconButtonV2
            aria-label={
              figureType === 'video' ? t('form.video.editVideo') : t('form.image.editImage')
            }
            variant="ghost"
            colorTheme="light"
            onClick={onEdit}
          >
            <Pencil />
          </IconButtonV2>
        </Tooltip>
      )}
    </StyledFigureButtons>
  );
};

export default FigureButtons;
