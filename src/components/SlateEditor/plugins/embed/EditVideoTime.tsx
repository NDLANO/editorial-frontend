/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { Input } from '@ndla/forms';
import { injectT } from '@ndla/i18n';
import { TranslateType } from '../../../../interfaces';
import { addYoutubeTimeStamps } from '../../../../util/videoUtil';

const StyledInputTimeWrapper = styled.div`
  display: flex;
  flex-flow: row;
  width: 80%;
  margin-top: 6.5px;
`;

const hmsCSS = css`
  width: 120px;
  margin-right: 13px;
`;

interface Props {
  name: string;
  src: string;
  onFigureInputChange: (e: Event) => void;
  t: TranslateType;
  startTime: string;
  stopTime: string;
  setStartTime: (startTime: string) => void;
  setStopTime: (stopTime: string) => void;
}

interface Event {
  preventDefault: Function;
  target: {
    value: string;
    name: string;
  };
}

const EditVideoTime = (props: Props) => {
  const {
    src,
    onFigureInputChange,
    name,
    t,
    startTime,
    stopTime,
    setStartTime,
    setStopTime,
  } = props;

  return (
    <StyledInputTimeWrapper>
      <div>
        <Input
          name={name}
          label={t(`form.video.time.start`)}
          value={startTime}
          onChange={(e: Event) => {
            setStartTime(e.target.value);
            const event = {
              preventDefault: e.preventDefault,
              target: {
                value: addYoutubeTimeStamps(src, e.target.value, stopTime),
                name: e.target.name,
              },
            };
            onFigureInputChange(event);
          }}
          container="div"
          placeholder={t(`form.video.time.hms`)}
          white
          customCSS={hmsCSS}
        />
      </div>
      <div>
        <Input
          name={name}
          label={t(`form.video.time.stop`)}
          value={stopTime}
          onChange={(e: Event) => {
            setStopTime(e.target.value);
            const event = {
              preventDefault: e.preventDefault,
              target: {
                value: addYoutubeTimeStamps(src, startTime, e.target.value),
                name: e.target.name,
              },
            };
            onFigureInputChange(event);
          }}
          container="div"
          placeholder={t(`form.video.time.hms`)}
          white
          customCSS={hmsCSS}
        />
      </div>
    </StyledInputTimeWrapper>
  );
};

export default injectT(EditVideoTime);
