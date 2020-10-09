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
import { Input } from '@ndla/forms';
import { Portal } from '../../../Portal';
import Overlay from '../../../Overlay';
import { StyledInputWrapper } from './FigureInput';
import EditVideoTime from './EditVideoTime';
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
  changes?: { [x: string]: string };
  embed: Embed;
  figureClass: any;
  onFigureInputChange: (e: Event) => void;
  src: string;
  startTime: string;
  stopTime: string;
  setStartTime: (startTime: string) => void;
  setStopTime: (stopTime: string) => void;
  toggleEditModus: Function;
}

interface Event {
  preventDefault: Function;
  target: {
    value: string;
    name: string;
  };
}

const EditVideo: React.FC<Props & tType> = ({
  t,
  changes,
  embed,
  figureClass,
  onFigureInputChange,
  src,
  startTime,
  stopTime,
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
  }, []);

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
                  src={src}
                  onFigureInputChange={onFigureInputChange}
                  startTime={startTime}
                  stopTime={stopTime}
                  setStartTime={setStartTime}
                  setStopTime={setStopTime}
                />
              ) : (
                <Input
                  name="caption"
                  label={t('form.video.caption.label')}
                  value={changes?.caption || embed.caption}
                  onChange={onFigureInputChange}
                  container="div"
                  type="text"
                  autoExpand
                  placeholder={t('form.video.caption.placeholder')}
                  white
                />
              )}
            </StyledInputWrapper>
          </div>
        </Portal>
      </div>
    </Fragment>
  );
};

export default injectT(EditVideo);
