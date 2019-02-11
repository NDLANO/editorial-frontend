/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import AudioPlayer from './AudioPlayer';
import FormikField from '../../../components/FormikField';

const AudioContent = ({ t,values, audioInfo }) => (
  <Fragment>
    <FormikField
      label={t('form.title.label')}
      name="title"
      title
      noBorder
      placeholder={t('form.title.label')}
    />
    {!values.id && (
      <FormikField id="file" type="file" name="audioFile" label={t('form.audio.file')} />
    )}
    {values.id && <AudioPlayer audio={audioInfo} filepath={values.filepath} />}
  </Fragment>
);

AudioContent.propTypes = {
  classes: PropTypes.func.isRequired,
  audioInfo: PropTypes.shape({
    fileSize: PropTypes.number.isRequired,
    language: PropTypes.string.isRequired,
    mimeType: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }),
  values: PropTypes.shape({
    id: PropTypes.number,
    audioFile: PropTypes.shape({
      fileSize: PropTypes.number,
      language: PropTypes.string,
      mimeType: PropTypes.string,
      url: PropTypes.string,
    }),
  }),
};

export default injectT(AudioContent);
