/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import { InputFileField, TextField } from '../../../components/Fields';
import Accordion from '../../../components/Accordion';
import { CommonFieldPropsShape } from '../../../shapes';
import AudioPlayer from './AudioPlayer';

class AudioContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hiddenContent: false,
    };
    this.toggleContent = this.toggleContent.bind(this);
  }

  toggleContent() {
    this.setState(prevState => ({
      hiddenContent: !prevState.hiddenContent,
    }));
  }

  render() {
    const { t, commonFieldProps, model, audioInfo } = this.props;
    return (
      <Accordion
        handleToggle={this.toggleContent}
        header={t('form.contentSection')}
        hidden={this.state.hiddenContent}>
        <TextField
          label={t('form.title.label')}
          name="title"
          title
          noBorder
          placeholder={t('form.title.label')}
          {...commonFieldProps}
        />
        <InputFileField
          label={t('form.audio.file')}
          name="audioFile"
          {...commonFieldProps}
        />
        {model.id && (
          <AudioPlayer audio={audioInfo} filepath={model.filepath} />
        )}
      </Accordion>
    );
  }
}

AudioContent.propTypes = {
  commonFieldProps: CommonFieldPropsShape.isRequired,
  classes: PropTypes.func.isRequired,
  bindInput: PropTypes.func.isRequired,
  model: PropTypes.shape({
    id: PropTypes.number,
    audioFile: PropTypes.shape({
      fileSize: PropTypes.number,
      language: PropTypes.string,
      mimeType: PropTypes.string,
      url: PropTypes.string,
    }),
  }),
  audioInfo: PropTypes.shape({
    fileSize: PropTypes.number.isRequired,
    language: PropTypes.string.isRequired,
    mimeType: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }),
};

export default injectT(AudioContent);
