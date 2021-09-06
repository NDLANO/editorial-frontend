/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { css } from '@emotion/core';
import React, { Fragment, useEffect, useState } from 'react';
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
import { Embed } from '../../../../interfaces';

const videoStyle = css`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
`;

interface Props {
  attributes?: {
    'data-key': string;
    'data-slate-object': string;
  };
  embed: Embed;
  figureClass: any;
  language: string;
  onRemoveClick: (event: React.MouseEvent) => void;
  saveEmbedUpdates: (change: { [x: string]: string }) => void;
}

const SlateVideo = ({
  attributes,
  embed,
  figureClass,
  language,
  onRemoveClick,
  saveEmbedUpdates,
}: Props) => {
  const { t } = useTranslation();
  const [editMode, setEditMode] = useState(false);
  const [tEmbed, setEmbed] = useState(embed);
  const isOriginalEmbed = tEmbed.videoid === embed.videoid;
  const [src, setSrc] = useState('');
  const [startTime, setStartTime] = useState('');
  const [stopTime, setStopTime] = useState('');
  const [caption, setCaption] = useState(tEmbed.caption);

  const [linkedVideoId, setLinkedVideoId] = useState<string | undefined>();
  useEffect(() => {
    const idWithoutTimestamp = embed.videoid?.split('&')[0];
    visualElementApi
      .fetchBrightcoveVideo(idWithoutTimestamp)
      .then((v: { link?: { text: string } }) => {
        setLinkedVideoId(v.link?.text);
      });
  }, [embed.videoid]);

  useEffect(() => {
    const { resource, account, videoid, url, player = 'default' } = tEmbed;
    if (resource === 'brightcove') {
      if (isBrightcoveUrl(url)) {
        setSrc(url);
      } else {
        setSrc(
          `https://players.brightcove.net/${account}/${player}_default/index.html?videoId=${videoid}`,
        );
      }
      setStartTime(getBrightCoveStartTime(videoid));
    } else {
      const tempUrl = url.includes('embed') ? url : getYoutubeEmbedUrl(url);
      setSrc(tempUrl);
      setStartTime(getStartTime(url));
      setStopTime(getStopTime(url));
    }
  }, [tEmbed]);

  const toggleEditModus = () => {
    setEditMode(!editMode);
  };

  const switchEmbedSource = () => {
    const newEmbed = isOriginalEmbed && linkedVideoId ? linkedVideoId : embed.videoid;
    setEmbed(embed => ({ ...embed, videoid: newEmbed }));
  };

  return (
    <div className="c-figure" draggable="true" {...attributes}>
      <FigureButtons
        tooltip={t('form.video.remove')}
        onRemoveClick={onRemoveClick}
        embed={tEmbed}
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
          embed={tEmbed}
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
        <Fragment>
          <Figure
            draggable
            style={{ paddingTop: '57%' }}
            {...figureClass}
            id={tEmbed.videoid || tEmbed.url}
            resizeIframe>
            <iframe
              title={`Video: ${tEmbed?.metaData?.name || ''}`}
              frameBorder="0"
              src={src}
              allowFullScreen
              css={videoStyle}
            />
          </Figure>
          <Button stripped style={{ width: '100%' }} onClick={toggleEditModus}>
            <figcaption className="c-figure__caption">
              <div className="c-figure__info">{parseMarkdown(tEmbed.caption)}</div>
            </figcaption>
          </Button>
        </Fragment>
      )}
    </div>
  );
};

export default SlateVideo;
