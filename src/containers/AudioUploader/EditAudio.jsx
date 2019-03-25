/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import AudioForm from './components/AudioForm';
import * as audioApi from '../../modules/audio/audioApi';
import { convertFieldWithFallback } from '../../util/convertFieldWithFallback';
import { createFormData } from '../../util/formDataHelper';
import { toEditAudio } from '../../util/routeHelpers';

const transformAudio = audio => {
  const audioLanguage =
    audio &&
    audio.supportedLanguages &&
    audio.supportedLanguages.includes(audio.language)
      ? audio.language
      : undefined;

  return audio
    ? {
        ...audio,
        title: convertFieldWithFallback(audio, 'title', '', audioLanguage),
        tags: convertFieldWithFallback(audio, 'tags', [], audioLanguage),
      }
    : undefined;
};

const EditAudio = props => {
  const { history, locale, audioId, audioLanguage, ...rest } = props;
  const [audio, setAudio] = useState({});

  const fetchAudio = async () => {
    if (audioId) {
      const article = await audioApi.fetchAudio(audioId, locale);
      setAudio(transformAudio(article));
    }
  };

  const upsertAudio = async (newAudio, file) => {
    const formData = await createFormData(file, newAudio);
    const updatedAudio = newAudio.id
      ? await audioApi.updateAudio(formData)
      : await audioApi.postAudio(formData);
    const transformedAudio = transformAudio(updatedAudio);
    setAudio(transformedAudio);
    if (!newAudio.id) {
      history.push(toEditAudio(updatedAudio.id, newAudio.language));
    }
  };

  useEffect(() => {
    fetchAudio();
  }, [audioId, audioLanguage]);

  if (audioId && !audio.id) {
    return null;
  }

  const language = audioLanguage || locale;
  return (
    <AudioForm
      audio={{ ...audio, language }}
      revision={audio && audio.revision}
      onUpdate={upsertAudio}
      audioLanguage={audioLanguage}
      {...rest}
    />
  );
};

EditAudio.propTypes = {
  audioId: PropTypes.string,
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
  isSaving: PropTypes.bool.isRequired,
  audioLanguage: PropTypes.string,
};

export default withRouter(EditAudio);
