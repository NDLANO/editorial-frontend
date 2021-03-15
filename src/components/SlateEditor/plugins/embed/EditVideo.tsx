/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { injectT, tType } from '@ndla/i18n';
import React, { Fragment, useEffect } from 'react';
import { Input, StyledButtonWrapper } from '@ndla/forms';
import Button from '@ndla/button';
import { Portal } from '../../../Portal';
import Overlay from '../../../Overlay';
import { StyledInputWrapper } from './FigureInput';
import EditVideoTime from './EditVideoTime';
import { Embed, FormikInputEvent } from '../../../../interfaces';
import { addYoutubeTimeStamps } from '../../../../util/videoUtil';

const videoStyle = css`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
`;

interface Props {
  caption: string;
  embed: Embed;
  figureClass: any;
  saveEmbedUpdates: (change: { [x: string]: string }) => void;
  setCaption: (caption: string) => void;
  src: string;
  startTime: string;
  stopTime: string;
  setStartTime: (startTime: string) => void;
  setStopTime: (stopTime: string) => void;
  toggleEditModus: Function;
}

const EditVideo: React.FC<Props & tType> = ({
  t,
  caption,
  embed,
  figureClass,
  saveEmbedUpdates,
  src,
  startTime,
  stopTime,
  setCaption,
  setStartTime,
  setStopTime,
  toggleEditModus,
}) => {
  let placeholderElement: any = React.createRef();
  let embedElement: any = React.createRef();

  useEffect(() => {
    const bodyRect = document.body.getBoundingClientRect();
    const placeholderRect = placeholderElement.getBoundingClientRect();

    // Placing embed within placeholder div on mount
    embedElement.style.position = 'absolute';
    embedElement.style.top = `${placeholderRect.top - bodyRect.top}px`;
    embedElement.style.left = `${placeholderRect.left}px`;
    embedElement.style.width = `${placeholderRect.width}px`;

    const embedRect = embedElement.getBoundingClientRect();

    placeholderElement.style.height = `${embedRect.height}px`;
  }, [embedElement, placeholderElement]);

  const onCaptionChange = (e: FormikInputEvent) => {
    setCaption(e.target.value);
  };

  const onSave = () => {
    saveEmbedUpdates({
      caption,
      url: embed.resource === 'brightcove' ? src : addYoutubeTimeStamps(src, startTime, stopTime),
    });
    toggleEditModus();
  };

  const saveDisabled =
    (embed.resource === 'brightcove' ||
      embed.url === addYoutubeTimeStamps(src, startTime, stopTime)) &&
    embed.caption === caption;

  return (
    <Fragment>
      <Overlay onExit={toggleEditModus} />
      <div
        ref={placeholderEl => {
          placeholderElement = placeholderEl;
        }}>
        <Portal isOpened>
          <div
            ref={embedEl => {
              embedElement = embedEl;
            }}>
            <figure
              css={css`
                padding-top: 56.25%;
              `}
              {...figureClass}>
              <iframe
                title={`Video: ${embed.metaData ? embed.metaData.name : ''}`}
                frameBorder="0"
                src={src}
                allowFullScreen
                css={videoStyle}
              />
            </figure>
            <StyledInputWrapper>
              {embed.resource === 'external' ? (
                <EditVideoTime
                  name="url"
                  startTime={startTime}
                  stopTime={stopTime}
                  setStartTime={setStartTime}
                  setStopTime={setStopTime}
                />
              ) : (
                <Input
                  name="caption"
                  label={t('form.video.caption.label')}
                  value={caption}
                  onChange={onCaptionChange}
                  container="div"
                  type="text"
                  autoExpand
                  placeholder={t('form.video.caption.placeholder')}
                  white
                />
              )}
              <StyledButtonWrapper paddingLeft>
                <Button onClick={toggleEditModus} outline>
                  {t('form.abort')}
                </Button>
                <Button disabled={saveDisabled} onClick={onSave}>
                  {t('form.video.save')}
                </Button>
              </StyledButtonWrapper>
            </StyledInputWrapper>
          </div>
        </Portal>
      </div>
    </Fragment>
  );
};

export default injectT(EditVideo);
