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
import Button, { IconButtonV2 } from '@ndla/button';
import { Figure } from '@ndla/ui';
import { breakpoints, parseMarkdown } from '@ndla/util';
import { useTranslation } from 'react-i18next';
import Tooltip from '@ndla/tooltip';
import { colors, spacing, fonts, mq } from '@ndla/core';
import Modal from '@ndla/modal';
import { isNumeric } from '../../../validators';
import FigureButtons from './FigureButtons';
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
  border-color: ${p =>
    p.showOutline ? colors.brand.primary : p.hasError ? colors.support.red : 'transparent'};
`;

interface Props {
  attributes: RenderElementProps['attributes'];
  embed: BrightcoveEmbed | ExternalEmbed;
  language: string;
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

const StyledFigcaption = styled.figcaption`
  background-color: ${colors.white};
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
  language,
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

    fetchBrightcoveVideo(idWithoutTimestamp).then(v => {
      if (isNumeric(v.link?.text)) {
        setLinkedVideoId(v.link?.text);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [(embed as BrightcoveEmbed).videoid]);

  const getUrl = (getLinkedVideo: boolean) => {
    if (embed.resource === 'brightcove') {
      const { account, videoid, player = 'default' } = embed;

      const startTime = getBrightCoveStartTime(videoid);
      const id =
        getLinkedVideo && linkedVideoId
          ? addBrightCoveTimeStampVideoid(linkedVideoId, startTime)
          : videoid;
      return `https://players.brightcove.net/${account}/${player}_default/index.html?videoId=${id}`;
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
      setShowLinkedVideo(prev => !prev);
    } else {
      setShowLinkedVideo(false);
    }
  };

  return (
    <>
      <Modal
        controllable
        backgroundColor="white"
        isOpen={editMode}
        labelledBy={'editVideoEmbed'}
        onClose={() => setEditMode(false)}>
        {close => (
          <EditVideo
            embed={embed}
            close={close}
            activeSrc={getUrl(showLinkedVideo)}
            saveEmbedUpdates={saveEmbedUpdates}
            setHasError={setHasError}
          />
        )}
      </Modal>
      <div draggable {...attributes}>
        <Figure id={'videoid' in embed ? embed.videoid : embed.url}>
          <FigureButtons
            tooltip={t('form.video.remove')}
            onRemoveClick={onRemoveClick}
            embed={embed}
            onEdit={toggleEditModus}
            figureType="video"
            language={language}>
            {linkedVideoId && (
              <Tooltip tooltip={linkedVideoTooltip}>
                <IconButtonV2
                  aria-label={linkedVideoTooltip}
                  variant="ghost"
                  colorTheme="light"
                  onClick={switchEmbedSource}>
                  <StyledText>{t('form.video.linkedVideoButton')}</StyledText>
                </IconButtonV2>
              </Tooltip>
            )}
          </FigureButtons>
          <SlateVideoWrapper
            hasError={hasError}
            showOutline={showCopyOutline}
            contentEditable={false}
            role="button"
            draggable
            className="c-placeholder-editomode"
            tabIndex={0}
            onClick={toggleEditModus}>
            <StyledVideo
              title={`Video: ${embed?.metaData?.name || ''}`}
              frameBorder="0"
              src={getUrl(showLinkedVideo)}
              allowFullScreen
            />
          </SlateVideoWrapper>
          <Button stripped width="full" onClick={toggleEditModus}>
            <StyledFigcaption>
              <FigureInfo>{parseMarkdown(embed.caption ?? '')}</FigureInfo>
            </StyledFigcaption>
          </Button>
        </Figure>
        {children}
      </div>
    </>
  );
};

export default SlateVideo;
