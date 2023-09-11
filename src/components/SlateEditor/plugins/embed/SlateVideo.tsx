/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useEffect, useState, MouseEvent, useCallback } from 'react';
import styled from '@emotion/styled';
import { RenderElementProps } from 'slate-react';
import { ButtonV2, IconButtonV2 } from '@ndla/button';
import { Figure } from '@ndla/ui';
import { breakpoints, parseMarkdown } from '@ndla/util';
import { useTranslation } from 'react-i18next';
import Tooltip from '@ndla/tooltip';
import { colors, spacing, fonts, mq } from '@ndla/core';
import { Modal, ModalContent, ModalTrigger } from '@ndla/modal';
import { Pencil } from '@ndla/icons/action';
import { SafeLinkIconButton } from '@ndla/safelink';
import { Link } from '@ndla/icons/common';
import { DeleteForever } from '@ndla/icons/editor';
import config from '../../../../config';
import { isNumeric } from '../../../validators';
import { StyledDeleteEmbedButton, StyledFigureButtons } from './FigureButtons';
import EditVideo, { toVideoEmbedFormValues, brightcoveEmbedFormRules } from './EditVideo';
import { fetchBrightcoveVideo } from '../../../../modules/video/brightcoveApi';
import {
  addBrightCoveTimeStampVideoid,
  getBrightCoveStartTime,
  getYoutubeEmbedUrl,
} from '../../../../util/videoUtil';
import { ExternalEmbed, BrightcoveEmbed } from '../../../../interfaces';
import validateFormik from '../../../formikValidationSchema';

export const StyledVideo = styled.iframe`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  border: 0px;
`;

interface SlateVideoWrapperProps {
  showOutline?: boolean;
  hasError?: boolean;
}

const shouldForwardProp = (prop: string) => prop !== 'showOutline' && prop !== 'hasError';

export const SlateVideoWrapper = styled('div', { shouldForwardProp })<SlateVideoWrapperProps>`
  position: relative;
  display: block;
  height: 0;
  padding: 0;
  overflow: hidden;
  padding-bottom: 56.25%;
  border-style: solid;
  border-width: 2px;
  border-color: ${(p) =>
    p.showOutline ? colors.brand.primary : p.hasError ? colors.support.red : 'transparent'};
`;

interface Props {
  attributes: RenderElementProps['attributes'];
  embed: BrightcoveEmbed | ExternalEmbed;
  onRemoveClick: (event: MouseEvent) => void;
  saveEmbedUpdates: (change: { [x: string]: string }) => void;
  active: boolean;
  isSelectedForCopy: boolean;
  children: ReactNode;
}

const isBrightcove = (
  embed: BrightcoveEmbed | ExternalEmbed | undefined,
): embed is BrightcoveEmbed => {
  return !!embed && 'videoid' in embed;
};

const FigureInfo = styled.div`
  max-width: 650px;
  margin-bottom: ${spacing.small};
  font-family: ${fonts.sans};
  color: ${colors.text.primary};
  ${fonts.sizes('16px', '24px')};
  white-space: normal;
  ${mq.range({ from: breakpoints.tablet })} {
    flex: 2;
    margin-bottom: ${spacing.small};
  }
  p {
    margin: 0;
  }
`;

const CaptionButton = styled(ButtonV2)`
  width: 100%;
`;

const StyledFigcaption = styled.figcaption`
  background-color: ${colors.white};
  width: 100%;
  padding: ${spacing.small};
  display: block;
  border-bottom: 1px solid ${colors.brand.greyLight};
`;

const StyledText = styled.p`
  width: 26px;
  height: 26px;
  ${fonts.sizes('20px', '26px')};
  margin: 0;
  padding: 0;
  text-align: center;
`;

const SlateVideo = ({
  attributes,
  embed,
  onRemoveClick,
  saveEmbedUpdates,
  active,
  isSelectedForCopy,
  children,
}: Props) => {
  const { t } = useTranslation();
  const [hasError, _setHasError] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const showCopyOutline = isSelectedForCopy && (!editMode || !active);
  const [showLinkedVideo, setShowLinkedVideo] = useState(false);
  const linkedVideoTooltip = showLinkedVideo
    ? t('form.video.fromLinkedVideo')
    : t('form.video.toLinkedVideo');

  const setHasError = useCallback((hasError: boolean) => _setHasError(hasError), []);

  const [linkedVideoId, setLinkedVideoId] = useState<string | undefined>();

  useEffect(() => {
    if (!editMode && embed.resource === 'brightcove') {
      _setHasError(
        !!Object.keys(validateFormik(toVideoEmbedFormValues(embed), brightcoveEmbedFormRules, t))
          .length,
      );
    }
  }, [editMode, embed, t]);

  useEffect(() => {
    if (!isBrightcove(embed)) {
      return;
    }
    const idWithoutTimestamp = embed.videoid?.split('&')[0];

    fetchBrightcoveVideo(idWithoutTimestamp).then((v) => {
      if (isNumeric(v.link?.text.trim())) {
        setLinkedVideoId(v.link?.text);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [(embed as BrightcoveEmbed).videoid]);

  const getUrl = (getLinkedVideo: boolean) => {
    if (embed.resource === 'brightcove') {
      const { account, videoid } = embed;

      const startTime = getBrightCoveStartTime(videoid);
      const id =
        getLinkedVideo && linkedVideoId
          ? addBrightCoveTimeStampVideoid(linkedVideoId, startTime)
          : videoid;
      return `https://players.brightcove.net/${account}/${config.brightcoveEdPlayerId}_default/index.html?videoId=${id}`;
    } else if (embed.resource === 'external') {
      const { url } = embed;
      return url.includes('embed') ? url : getYoutubeEmbedUrl(url);
    }
    return '';
  };

  const toggleEditModus = () => {
    setEditMode(!editMode);
  };

  const switchEmbedSource = () => {
    if (!isBrightcove(embed)) {
      return;
    } else if (linkedVideoId) {
      setShowLinkedVideo((prev) => !prev);
    } else {
      setShowLinkedVideo(false);
    }
  };

  return (
    <div draggable {...attributes} contentEditable={false}>
      <Figure id={'videoid' in embed ? embed.videoid : embed.url}>
        <StyledFigureButtons data-white={true}>
          <Modal open={editMode} onOpenChange={setEditMode}>
            <ModalTrigger>
              <IconButtonV2
                aria-label={t('form.video.editVideo')}
                title={t('form.video.editVideo')}
                colorTheme="light"
              >
                <Pencil />
              </IconButtonV2>
            </ModalTrigger>
            <ModalContent>
              <EditVideo
                embed={embed}
                close={toggleEditModus}
                activeSrc={getUrl(showLinkedVideo)}
                saveEmbedUpdates={saveEmbedUpdates}
                setHasError={setHasError}
              />
            </ModalContent>
          </Modal>
          {embed.resource === 'brightcove' && (
            <>
              <SafeLinkIconButton
                title={t('form.video.brightcove')}
                aria-label={t('form.video.brightcove')}
                colorTheme="light"
                to={`https://studio.brightcove.com/products/videocloud/media/videos/${
                  embed.videoid.split('&t=')[0]
                }`}
              >
                <Link />
              </SafeLinkIconButton>
              {linkedVideoId && (
                <Tooltip tooltip={linkedVideoTooltip}>
                  <IconButtonV2
                    aria-label={linkedVideoTooltip}
                    colorTheme="light"
                    onClick={switchEmbedSource}
                  >
                    <StyledText>{t('form.video.linkedVideoButton')}</StyledText>
                  </IconButtonV2>
                </Tooltip>
              )}
            </>
          )}
          <StyledDeleteEmbedButton
            title={t('form.video.remove')}
            aria-label={t('form.video.remove')}
            colorTheme="danger"
            onClick={onRemoveClick}
            data-cy="remove-element"
          >
            <DeleteForever />
          </StyledDeleteEmbedButton>
        </StyledFigureButtons>
        <SlateVideoWrapper
          hasError={hasError}
          showOutline={showCopyOutline}
          contentEditable={false}
          role="button"
          draggable
          className="c-placeholder-editomode"
          tabIndex={0}
          onClick={toggleEditModus}
        >
          <StyledVideo
            title={`Video: ${embed?.metaData?.name || ''}`}
            frameBorder="0"
            src={getUrl(showLinkedVideo)}
            allowFullScreen
          />
        </SlateVideoWrapper>
        <CaptionButton variant="stripped" onClick={toggleEditModus}>
          <StyledFigcaption>
            <FigureInfo>{parseMarkdown(embed.caption ?? '')}</FigureInfo>
          </StyledFigcaption>
        </CaptionButton>
      </Figure>
      {children}
    </div>
  );
};

export default SlateVideo;
