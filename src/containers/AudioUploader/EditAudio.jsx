/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AudioForm from './components/AudioForm';
import * as audioApi from '../../modules/audio/audioApi';
import { convertFieldWithFallback } from '../../util/convertFieldWithFallback';
import { createFormData } from '../../util/formDataHelper';

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

const EditAudio = ({ locale, audioId, audioLanguage, ...rest }) => {
  console.log('locale: ', locale);
  const [audio, setAudio] = useState({});

  const fetchAudio = async () => {
    if (audioId) {
      const apiAudio = await audioApi.fetchAudio(audioId, audioLanguage);
      setAudio(transformAudio(apiAudio));
    }
  };

  const onUpdate = async (newAudio, file) => {
    const formData = await createFormData(file, newAudio);
    const updatedAudio = await audioApi.updateAudio(newAudio.id, formData);
    const transformedAudio = transformAudio(updatedAudio);
    setAudio(transformedAudio);
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
      onUpdate={onUpdate}
      audioLanguage={audioLanguage}
      locale={locale}
      {...rest}
    />
  );
};

EditAudio.propTypes = {
  audioId: PropTypes.string.isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  locale: PropTypes.string.isRequired,
  audioLanguage: PropTypes.string.isRequired,
};

export default EditAudio;
