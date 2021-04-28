/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import AudioForm from './components/AudioForm';
import * as audioApi from '../../modules/audio/audioApi';
import { createFormData } from '../../util/formDataHelper';
import { toEditAudio } from '../../util/routeHelpers';
import { NewAudioMetaInformation } from '../../modules/audio/audioApiInterfaces';
import { License } from '../../interfaces';
import { HistoryShape } from '../../shapes';

interface Props extends RouteComponentProps {
  licenses: License[];
  locale: string;
}

const CreateAudio = ({ history, licenses, locale, ...rest }: Props) => {
  const onCreateAudio = async (
    newAudio: NewAudioMetaInformation,
    file?: string | Blob,
  ): Promise<void> => {
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
      licenses={licenses}
      {...rest}
    />
  );
};

CreateAudio.propTypes = {
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string.isRequired,
      license: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  history: HistoryShape,
  locale: PropTypes.string.isRequired,
};

export default withRouter(CreateAudio);
