/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import { InputFileField, TextField } from '../../../components/Fields';
import { CommonFieldPropsShape } from '../../../shapes';
import AudioPlayer from './AudioPlayer';

const AudioContent = ({ t, commonFieldProps, model, audioInfo }) => (
  <Fragment>
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
    {model.id && <AudioPlayer audio={audioInfo} filepath={model.filepath} />}
  </Fragment>
);

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
