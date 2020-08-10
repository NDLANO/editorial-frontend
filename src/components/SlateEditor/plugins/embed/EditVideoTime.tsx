/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { Input } from '@ndla/forms';
import { injectT } from '@ndla/i18n';
import { TranslateType } from '../../../../interfaces';
import { addYoutubeTimeStamps, getStartTime, getStopTime } from '../../../../util/videoUtil';

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
}

interface Event {
  target: {
    value: string;
  }
}

const EditVideoTime = ({ src, onFigureInputChange, name, t} : Props) => {
  const [start, setStart] = useState(getStartTime(src));
  const [stop, setStop] = useState(getStopTime(src));

  return (
    <StyledInputTimeWrapper>
      <div>
        <Input
          name={name}
          label={t(`form.video.time.start`)}
          value={start}
          onChange={(e: Event) => {
            setStart(e.target.value);
            e.target.value = addYoutubeTimeStamps(src, e.target.value, stop);
            onFigureInputChange(e);
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
          value={stop}
          onChange={(e: Event) => {
            setStop(e.target.value);
            e.target.value = addYoutubeTimeStamps(src, start, e.target.value);
            onFigureInputChange(e);
          }}
          container="div"
          placeholder={t(`form.video.time.hms`)}
          white
          customCSS={hmsCSS}
        />
      </div>
    </StyledInputTimeWrapper>
  )
}

export default injectT(EditVideoTime);