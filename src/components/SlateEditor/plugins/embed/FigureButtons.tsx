/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, MouseEvent, useMemo } from 'react';
import styled from '@emotion/styled';
import Tooltip from '@ndla/tooltip';
import { spacing } from '@ndla/core';
import { Link as LinkIcon } from '@ndla/icons/common';
import { Pencil } from '@ndla/icons/action';
import { DeleteForever } from '@ndla/icons/editor';
import { useTranslation } from 'react-i18next';
import { SafeLinkIconButton } from '@ndla/safelink';
import { IconButtonV2 } from '@ndla/button';
import { Embed } from '../../../../interfaces';

const StyledFigureButtons = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: flex-end;
  position: absolute;
  top: -${spacing.large};
  right: ${spacing.small};

  > * {
    margin-bottom: ${spacing.xsmall};
  }
  &[data-margin='true'] {
    margin: ${spacing.small};
  }
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
  const url = useMemo(
    () => ({
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
    }),
    [t],
  );

  return (
    <StyledFigureButtons data-margin={withMargin} contentEditable={false}>
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
    </StyledFigureButtons>
  );
};

export default FigureButtons;
