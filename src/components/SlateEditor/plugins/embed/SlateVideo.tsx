/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React, { Fragment, useEffect, useState } from 'react';
import Button from '@ndla/button';
// @ts-ignore
import { Figure } from '@ndla/ui';
import { injectT, tType } from '@ndla/i18n';
import FigureButtons from './FigureButtons';
import EditVideo from './EditVideo';
import { getYoutubeEmbedUrl, getStartTime, getStopTime } from '../../../../util/videoUtil';
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
  onRemoveClick: Function;
  saveEmbedUpdates: (change: { [x: string]: string }) => void;
}

const SlateVideo: React.FC<Props & tType> = ({
  t,
  attributes,
  embed,
  figureClass,
  language,
  onRemoveClick,
  saveEmbedUpdates,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [src, setSrc] = useState('');
  const [startTime, setStartTime] = useState('');
  const [stopTime, setStopTime] = useState('');
  const [caption, setCaption] = useState(embed.caption);

  useEffect(() => {
    const { resource, account, videoid, url, player = 'default' } = embed;
    if (resource === 'brightcove') {
      if (isBrightcoveUrl(url)) {
        setSrc(url);
      } else {
        setSrc(
          `https://players.brightcove.net/${account}/${player}_default/index.html?videoId=${videoid}`,
        );
      }
    } else {
      const tempUrl = url.includes('embed') ? url : getYoutubeEmbedUrl(url);
      setSrc(tempUrl);
      setStartTime(getStartTime(url));
      setStopTime(getStopTime(url));
    }
  }, [embed]);

  const toggleEditModus = () => {
    setEditMode(!editMode);
  };

  return (
    <div className="c-figure" draggable="true" {...attributes}>
      <FigureButtons
        tooltip={t('form.video.remove')}
        onRemoveClick={onRemoveClick}
        embed={embed}
        figureType="video"
        language={language}
      />
      {editMode ? (
        <EditVideo
          embed={embed}
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
            id={embed.videoid || embed.url}
            resizeIframe>
            <iframe
              title={`Video: ${embed?.metaData?.name || ''}`}
              frameBorder="0"
              src={src}
              allowFullScreen
              css={videoStyle}
            />
          </Figure>
          <Button stripped style={{ width: '100%' }} onClick={toggleEditModus}>
            <figcaption className="c-figure__caption">
              <div className="c-figure__info">{embed.caption}</div>
            </figcaption>
          </Button>
        </Fragment>
      )}
    </div>
  );
};

export default injectT(SlateVideo);
