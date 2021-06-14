/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import Field from '../../../components/Field';

interface Props {
  audio: {
    src: string;
    mimeType: string;
  };
  noBorder?: boolean;
}

const AudioPlayer = ({ audio, noBorder = true }: Props) => {
  const audioPlayerRef = createRef<HTMLAudioElement>();
  return (
    <Field noBorder={noBorder}>
      {
        <audio controls ref={audioPlayerRef}>
          <source src={audio.src} type={audio.mimeType} />
        </audio>
      }
    </Field>
  );
};

AudioPlayer.propTypes = {
  audio: PropTypes.shape({
    mimeType: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
  }),
  noBorder: PropTypes.bool,
};

export default AudioPlayer;
