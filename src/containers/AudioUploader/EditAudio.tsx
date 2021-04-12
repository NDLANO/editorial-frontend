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
import { License, LocaleType } from '../../interfaces';
import {
  AudioApiType,
  FlattenedAudioApiType,
  UpdatedAudioMetaInformation,
} from '../../modules/audio/audioApiInterfaces';

const transformAudio = (
  audio: AudioApiType,
  language: string,
): FlattenedAudioApiType | undefined => {
  const audioLanguage =
    audio && audio.supportedLanguages && audio.supportedLanguages.includes(language)
      ? language
      : undefined;

  const title = convertFieldWithFallback<'title'>(audio, 'title', '', audioLanguage);
  const tags = convertFieldWithFallback<'tags', string[]>(audio, 'tags', [], audioLanguage);

  return audio
    ? {
        ...audio,
        title,
        tags,
      }
    : undefined;
};

interface Props {
  locale: LocaleType;
  audioId: number;
  audioLanguage: string;
  isNewlyCreated?: boolean;
  licenses: License[];
}

const EditAudio = ({
  locale,
  audioId,
  audioLanguage,
  isNewlyCreated,
  licenses,
  ...rest
}: Props) => {
  const [audio, setAudio] = useState<FlattenedAudioApiType | undefined>(undefined);

  const fetchAudio = async () => {
    if (audioId) {
      const apiAudio = await audioApi.fetchAudio(audioId, audioLanguage);
      setAudio(transformAudio(apiAudio, audioLanguage));
    }
  };

  const onUpdate = async (
    newAudio: UpdatedAudioMetaInformation,
    file: string | Blob,
  ): Promise<void> => {
    const formData = await createFormData(file, newAudio);
    const updatedAudio = await audioApi.updateAudio(audioId, formData);
    const transformedAudio = transformAudio(updatedAudio, audioLanguage);
    setAudio(transformedAudio);
  };

  useEffect(() => {
    fetchAudio();
  }, [audioId, audioLanguage]); // eslint-disable-line react-hooks/exhaustive-deps

  if (audioId && !audio?.id) {
    return null;
  }

  const language = audioLanguage || locale;
  return (
    <AudioForm
      audio={{ ...audio, language }}
      revision={audio && audio.revision}
      onUpdate={onUpdate}
      audioLanguage={audioLanguage}
      isNewlyCreated={isNewlyCreated}
      licenses={licenses}
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
  isNewlyCreated: PropTypes.bool,
};

export default EditAudio;
