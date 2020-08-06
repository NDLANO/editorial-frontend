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
  start: string;
  stop: string;
  setStart: (e: string) => void;
  setStop: (e: string) => void;
  t: TranslateType;
}

interface Event {
  target: {
    value: string;
  }
}

const EditVideoTime = ({ start, stop, setStart, setStop, t} : Props) => {
  return (
    <StyledInputTimeWrapper>
      <div>
        <Input
          name="start"
          label={t(`form.video.time.start`)}
          value={start}
          onChange={(e: Event) => setStart(e.target.value)}
          container="div"
          placeholder={t(`form.video.time.hms`)}
          white
          customCSS={hmsCSS}
        />
      </div>
      <div>
        <Input
          name="stop"
          label={t(`form.video.time.stop`)}
          value={stop}
          onChange={(e: Event) => setStop(e.target.value)}
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