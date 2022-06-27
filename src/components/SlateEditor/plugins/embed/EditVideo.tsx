/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createRef, useEffect, useState } from 'react';
import FocusTrapReact from 'focus-trap-react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { StyledButtonWrapper, TextArea } from '@ndla/forms';
import Button from '@ndla/button';
import { FormikValues } from 'formik';
import { Portal } from '../../../Portal';
import Overlay from '../../../Overlay';
import { StyledInputWrapper } from './FigureInput';
import EditVideoTime from './EditVideoTime';
import { BrightcoveEmbed, ExternalEmbed } from '../../../../interfaces';
import {
  addYoutubeTimeStamps,
  addBrightCoveTimeStampVideoid,
  addBrightCovetimeStampSrc,
  getBrightCoveStartTime,
  getStartTime,
  getStopTime,
} from '../../../../util/videoUtil';

const videoStyle = css`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
`;

interface Props {
  embed: BrightcoveEmbed | ExternalEmbed;
  saveEmbedUpdates: (change: { [x: string]: string }) => void;
  src: string;
  activeSrc: string;
  toggleEditModus: () => void;
}

const StyledFigure = styled.figure`
  position: relative;
  z-index: 1;
  padding-top: 56.25%;
`;

const EditVideo = ({ embed, saveEmbedUpdates, src, activeSrc, toggleEditModus }: Props) => {
  const [caption, setCaption] = useState(embed.caption || '');
  const [startTime, setStartTime] = useState(
    'videoid' in embed ? getBrightCoveStartTime(embed.videoid) : getStartTime(embed.url),
  );
  const [stopTime, setStopTime] = useState(
    embed.resource === 'external' ? getStopTime(embed.url) : '',
  );
  const { t } = useTranslation();
  let placeholderElement: any = createRef();
  let embedElement: any = createRef();

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

  const onCaptionChange = (e: FormikValues) => {
    setCaption(e.target.value);
  };

  const onSave = () => {
    saveEmbedUpdates({
      caption,
      ...(embed.resource === 'brightcove'
        ? {
            videoid: addBrightCoveTimeStampVideoid(embed.videoid, startTime),
          }
        : {}),
    });
    toggleEditModus();
  };

  const saveDisabled =
    (addBrightCovetimeStampSrc(src, startTime) === src ||
      addYoutubeTimeStamps(src, startTime, stopTime) === src) &&
    caption === embed.caption;

  return (
    <>
      <Overlay onExit={toggleEditModus} />
      <div
        ref={placeholderEl => {
          placeholderElement = placeholderEl;
        }}>
        <Portal isOpened>
          <FocusTrapReact
            focusTrapOptions={{
              onDeactivate: () => {
                toggleEditModus();
              },
              clickOutsideDeactivates: true,
              escapeDeactivates: true,
            }}>
            <div
              ref={embedEl => {
                embedElement = embedEl;
              }}>
              <StyledFigure>
                <iframe
                  title={`Video: ${embed.metaData ? embed.metaData.name : ''}`}
                  frameBorder="0"
                  src={activeSrc}
                  allowFullScreen
                  css={videoStyle}
                />
              </StyledFigure>
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
                  <>
                    <TextArea
                      name="caption"
                      label={t('form.video.caption.label')}
                      value={caption}
                      onChange={onCaptionChange}
                      type="text"
                      placeholder={t('form.video.caption.placeholder')}
                      white
                    />
                    <EditVideoTime name="url" startTime={startTime} setStartTime={setStartTime} />
                  </>
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
          </FocusTrapReact>
        </Portal>
      </div>
    </>
  );
};

export default EditVideo;
