/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { Input } from '@ndla/forms';
import { useTranslation } from 'react-i18next';

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
  startTime?: string;
  stopTime?: string;
  setStartTime?: (startTime: string) => void;
  setStopTime?: (stopTime: string) => void;
}

interface Event {
  preventDefault: Function;
  target: {
    value: string;
    name: string;
  };
}

const EditVideoTime = (props: Props) => {
  const { t } = useTranslation();
  const { name, startTime, stopTime, setStartTime, setStopTime } = props;
  return (
    <StyledInputTimeWrapper>
      <div>
        {setStartTime && (
          <Input
            name={name}
            label={t(`form.video.time.start`)}
            value={startTime}
            onChange={(e: Event) => {
              setStartTime(e.target.value);
            }}
            container="div"
            placeholder={t(`form.video.time.hms`)}
            white
            customCSS={hmsCSS}
          />
        )}
      </div>
      <div>
        {setStopTime && (
          <Input
            name={name}
            label={t(`form.video.time.stop`)}
            value={stopTime}
            onChange={(e: Event) => {
              setStopTime(e.target.value);
            }}
            container="div"
            placeholder={t(`form.video.time.hms`)}
            white
            customCSS={hmsCSS}
          />
        )}
      </div>
    </StyledInputTimeWrapper>
  );
};

export default EditVideoTime;
