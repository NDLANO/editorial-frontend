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
import { injectT, tType } from '@ndla/i18n';
import FigureButtons from './FigureButtons';
import EditVideo from './EditVideo';
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
  onRemoveClick: Function;
  saveEmbedUpdates: (change: { [x: string]: string }) => void;
  active: boolean;
  isSelectedForCopy: boolean;
  children: ReactNode;
}

const SlateVideo = ({
  t,
  attributes,
  embed,
  figureClass,
  language,
  onRemoveClick,
  saveEmbedUpdates,
  active,
  isSelectedForCopy,
  children,
}: Props & tType) => {
  const [editMode, setEditMode] = useState(false);
  const [src, setSrc] = useState('');
  const [startTime, setStartTime] = useState('');
  const [stopTime, setStopTime] = useState('');
  const [caption, setCaption] = useState(embed.caption || '');
  const showCopyOutline = isSelectedForCopy && (!editMode || !active);

  useEffect(() => {
    if (embed.resource === 'brightcove') {
      const { account, videoid, url, player = 'default' } = embed;
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
        </div>
      )}
      {children}
    </div>
  );
};

export default injectT(SlateVideo);
