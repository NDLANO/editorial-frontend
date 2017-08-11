/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Field } from '../../../components/Fields';

class AudioPlayer extends React.Component {
  componentWillReceiveProps(props) {
    if (this.props.audio.url !== props.audio.url) {
      this.audioPlayer.pause();
      this.audioPlayer.load();
    }
  }
  render() {
    const { audio, noBorder, bigText } = this.props;
    return (
      <Field noBorder={noBorder} bigText={bigText}>
        {
          // eslint-disable-next-line
          <audio
            controls
            ref={audioPlayer => {
              this.audioPlayer = audioPlayer;
            }}>
            <source src={audio.url} type={audio.mimeType} />
          </audio>
        }
      </Field>
    );
  }
}

AudioPlayer.propTypes = {
  audio: PropTypes.shape({
    fileSize: PropTypes.number.isRequired,
    language: PropTypes.string.isRequired,
    mimeType: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }),
  noBorder: PropTypes.bool,
  bigText: PropTypes.bool,
};

AudioPlayer.defaultProps = {
  bigText: false,
  noBorder: true,
};

export default AudioPlayer;
