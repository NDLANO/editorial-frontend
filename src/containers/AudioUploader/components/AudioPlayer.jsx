/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, createRef } from 'react';
import PropTypes from 'prop-types';
import Field from '../../../components/Field';

const AudioPlayer = ({ audio, noBorder, filepath }) => {
  const audioPlayerRef = createRef();
  useEffect(() => {
    //audioPlayerRef.pause();
    //audioPlayerRef.load();
  }, [filepath]);
  return (
    <Field noBorder={noBorder}>
      {
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <audio controls ref={audioPlayerRef}>
          <source src={filepath || audio.url} type={audio.mimeType} />
        </audio>
      }
    </Field>
  );
};

AudioPlayer.propTypes = {
  audio: PropTypes.shape({
    fileSize: PropTypes.number.isRequired,
    language: PropTypes.string.isRequired,
    mimeType: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }),
  filepath: PropTypes.string,
  noBorder: PropTypes.bool,
};

AudioPlayer.defaultProps = {
  noBorder: true,
  audio: {},
};

export default AudioPlayer;
