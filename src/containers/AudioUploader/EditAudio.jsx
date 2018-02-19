/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AudioForm, { getInitialModel } from './components/AudioForm';
import { actions, getAudio } from '../../modules/audio/audio';
import { AudioShape } from '../../shapes';

class EditAudio extends Component {
  componentWillMount() {
    const { audioId: id, fetchAudio, audioLanguage } = this.props;
    if (id) fetchAudio({ id, language: audioLanguage });
  }

  componentWillReceiveProps(nextProps) {
    const { audioId: id, fetchAudio, audioLanguage, audio } = nextProps;

    if (
      (audio && audio.language !== audioLanguage) ||
      id !== this.props.audioId
    ) {
      fetchAudio({ id, language: audioLanguage });
    }
  }

  render() {
    const {
      history,
      audio: audioData,
      updateAudio,
      locale,
      ...rest
    } = this.props;

    return (
      <AudioForm
        initialModel={getInitialModel(audioData || { language: locale })}
        revision={audioData && audioData.revision}
        audioInfo={audioData && audioData.audioFile}
        onUpdate={(audio, file) => updateAudio({ audio, file, history })}
        {...rest}
      />
    );
  }
}

EditAudio.propTypes = {
  audioId: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  fetchAudio: PropTypes.func.isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  audio: AudioShape,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  locale: PropTypes.string.isRequired,
  updateAudio: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
  audioLanguage: PropTypes.string.isRequired,
};

const mapDispatchToProps = {
  fetchAudio: actions.fetchAudio,
  updateAudio: actions.updateAudio,
};

const mapStateToProps = (state, props) => {
  const { audioId } = props;
  const getAudioSelector = getAudio(audioId, true);
  return {
    audio: getAudioSelector(state),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EditAudio),
);
