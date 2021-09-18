/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ReactNode, useEffect, useState } from 'react';
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
  getYoutubeEmbedUrl,
  getStartTime,
  getStopTime,
  getBrightCoveStartTime,
} from '../../../../util/videoUtil';
import { isBrightcoveUrl } from '../../../../util/htmlHelpers';
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
  onRemoveClick: (event: React.MouseEvent) => void;
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
  const [activeEmbed, setActiveEmbed] = useState(embed);
  const isOriginalEmbed =
    isBrightcove(activeEmbed) && isBrightcove(embed) && activeEmbed.videoid === embed.videoid;
  const [src, setSrc] = useState('');
  const [startTime, setStartTime] = useState('');
  const [stopTime, setStopTime] = useState('');
  const showCopyOutline = isSelectedForCopy && (!editMode || !active);
  const [caption, setCaption] = useState(activeEmbed.caption || '');

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

  useEffect(() => {
    const { resource, url } = activeEmbed;
    if (resource === 'brightcove') {
      const { account, videoid, player = 'default' } = activeEmbed;
      if (url && isBrightcoveUrl(url)) {
        setSrc(url);
      } else {
        setSrc(
          `https://players.brightcove.net/${account}/${player}_default/index.html?videoId=${videoid}`,
        );
      }
      setStartTime(getBrightCoveStartTime(videoid));
    } else if (embed.resource === 'external') {
      const { url } = embed;
      const tempUrl = url.includes('embed') ? url : getYoutubeEmbedUrl(url);
      setSrc(tempUrl);
      setStartTime(getStartTime(url));
      setStopTime(getStopTime(url));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeEmbed]);

  const toggleEditModus = () => {
    setEditMode(!editMode);
  };

  const switchEmbedSource = () => {
    if (!isBrightcove(embed)) {
      return;
    }
    const newEmbed = isOriginalEmbed && linkedVideoId ? linkedVideoId : embed.videoid;
    setActiveEmbed({ ...embed, videoid: newEmbed });
  };

  return (
    <div className="c-figure" draggable="true" {...attributes}>
      <FigureButtons
        tooltip={t('form.video.remove')}
        onRemoveClick={onRemoveClick}
        embed={activeEmbed}
        figureType="video"
        language={language}>
        <Tooltip
          tooltip={
            isOriginalEmbed ? t('form.video.toLinkedVideo') : t('form.video.fromLinkedVideo')
          }
          align="right">
          {linkedVideoId && (
            <IconButton as={SafeLink} onClick={switchEmbedSource}>
              {t('form.video.linkedVideoButton')}
            </IconButton>
          )}
        </Tooltip>
      </FigureButtons>
      {editMode ? (
        <EditVideo
          embed={activeEmbed}
          toggleEditModus={toggleEditModus}
          figureClass={figureClass}
          src={src}
          startTime={startTime}
          stopTime={stopTime}
          setStartTime={setStartTime}
          setStopTime={setStopTime}
          caption={caption}
          setCaption={setCaption}
          saveEmbedUpdates={saveEmbedUpdates}
        />
      ) : (
        <div contentEditable={false}>
          <Figure
            draggable
            style={{ paddingTop: '57%' }}
            {...figureClass}
            id={'brightcove' === embed.resource ? embed.videoid || embed.url : embed.url}
            resizeIframe
            css={
              showCopyOutline && {
                boxShadow: 'rgb(32, 88, 143) 0 0 0 2px;',
              }
            }>
            <iframe
              title={`Video: ${activeEmbed?.metaData?.name || ''}`}
              frameBorder="0"
              src={src}
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
                {parseMarkdown(activeEmbed.caption || '')}
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
