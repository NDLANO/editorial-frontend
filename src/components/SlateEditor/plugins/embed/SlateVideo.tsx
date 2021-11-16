/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useEffect, useState, MouseEvent } from 'react';
import { css } from '@emotion/core';
import { RenderElementProps } from 'slate-react';
import Button from '@ndla/button';
// @ts-ignore
import { Figure } from '@ndla/ui';
//@ts-ignore
import { parseMarkdown } from '@ndla/util';
import { useTranslation } from 'react-i18next';
import Tooltip from '@ndla/tooltip';
import SafeLink from '@ndla/safelink';
import FigureButtons from './FigureButtons';
import EditVideo from './EditVideo';
import IconButton from '../../../IconButton';
import * as visualElementApi from '../../../../containers/VisualElement/visualElementApi';
import {
  addBrightCoveTimeStampVideoid,
  getBrightCoveStartTime,
  getYoutubeEmbedUrl,
} from '../../../../util/videoUtil';
import { ExternalEmbed, BrightcoveEmbed } from '../../../../interfaces';

const videoStyle = css`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
`;

interface Props {
  attributes: RenderElementProps['attributes'];
  embed: BrightcoveEmbed | ExternalEmbed;
  figureClass: any;
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

const SlateVideo = ({
  attributes,
  embed,
  figureClass,
  language,
  onRemoveClick,
  saveEmbedUpdates,
  active,
  isSelectedForCopy,
  children,
}: Props) => {
  const { t } = useTranslation();
  const [editMode, setEditMode] = useState(false);
  const showCopyOutline = isSelectedForCopy && (!editMode || !active);
  const [showLinkedVideo, setShowLinkedVideo] = useState(false);

  const [linkedVideoId, setLinkedVideoId] = useState<string | undefined>();
  useEffect(() => {
    if (!isBrightcove(embed)) {
      return;
    }
    const idWithoutTimestamp = embed.videoid?.split('&')[0];
    visualElementApi
      .fetchBrightcoveVideo(idWithoutTimestamp)
      .then((v: { link?: { text: string } }) => {
        setLinkedVideoId(v.link?.text);
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
    <div className="c-figure" draggable="true" {...attributes}>
      <FigureButtons
        tooltip={t('form.video.remove')}
        onRemoveClick={onRemoveClick}
        embed={embed}
        figureType="video"
        language={language}>
        {linkedVideoId && (
          <Tooltip
            tooltip={
              showLinkedVideo ? t('form.video.fromLinkedVideo') : t('form.video.toLinkedVideo')
            }
            align="right">
            <IconButton as={SafeLink} onClick={switchEmbedSource}>
              {t('form.video.linkedVideoButton')}
            </IconButton>
          </Tooltip>
        )}
      </FigureButtons>
      {editMode ? (
        <EditVideo
          embed={embed}
          toggleEditModus={toggleEditModus}
          figureClass={figureClass}
          src={getUrl(false)}
          activeSrc={getUrl(showLinkedVideo)}
          saveEmbedUpdates={saveEmbedUpdates}
        />
      ) : (
        <div contentEditable={false}>
          <Figure
            draggable
            style={{ paddingTop: '57%' }}
            {...figureClass}
            id={'videoid' in embed ? embed.videoid : embed.url}
            resizeIframe
            css={
              showCopyOutline && {
                boxShadow: 'rgb(32, 88, 143) 0 0 0 2px;',
              }
            }>
            <iframe
              title={`Video: ${embed?.metaData?.name || ''}`}
              frameBorder="0"
              src={getUrl(showLinkedVideo)}
              allowFullScreen
              css={videoStyle}
            />
          </Figure>
          <Button stripped style={{ width: '100%' }} onClick={toggleEditModus}>
            <figcaption className="c-figure__caption">
              <div
                className="c-figure__info"
                css={css`
                  p {
                    margin: 0;
                  }
                `}>
                {parseMarkdown(embed.caption || '')}
              </div>
            </figcaption>
          </Button>
        </div>
      )}
      {children}
    </div>
  );
};

export default SlateVideo;
