/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import AudioForm from './components/AudioForm';
import * as audioApi from '../../modules/audio/audioApi';
import { createFormData } from '../../util/formDataHelper';
import { toEditAudio } from '../../util/routeHelpers';

const CreateAudio = ({ history, locale, ...rest }) => {
  const onCreateAudio = async (newAudio, file) => {
    const formData = await createFormData(file, newAudio);
    const createdAudio = await audioApi.postAudio(formData);
    if (!newAudio.id) {
      history.push(toEditAudio(createdAudio.id, newAudio.language));
    }
  };

  return (
    <AudioForm
      audio={{ language: locale }}
      onUpdate={onCreateAudio}
      audioLanguage={locale}
      locale={locale}
      {...rest}
    />
  );
};

CreateAudio.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  locale: PropTypes.string.isRequired,
};

export default withRouter(CreateAudio);
