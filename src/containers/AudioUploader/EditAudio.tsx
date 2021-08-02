/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import AudioForm from './components/AudioForm';
import * as audioApi from '../../modules/audio/audioApi';
import { transformAudio } from '../../util/audioHelpers';
import { createFormData } from '../../util/formDataHelper';
import { toEditPodcast } from '../../util/routeHelpers';
import Spinner from '../../components/Spinner';
import { License, LocaleType } from '../../interfaces';
import {
  FlattenedAudioApiType,
  UpdatedAudioMetaInformation,
} from '../../modules/audio/audioApiInterfaces';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

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
  const [loading, setLoading] = useState<boolean>(false);

  const onUpdate = async (
    newAudio: UpdatedAudioMetaInformation,
    file: string | Blob | undefined,
  ): Promise<void> => {
    const formData = await createFormData(file, newAudio);
    const updatedAudio = await audioApi.updateAudio(audioId, formData);
    const transformedAudio = transformAudio(updatedAudio, audioLanguage);
    setAudio(transformedAudio);
  };

  useEffect(() => {
    async function fetchAudio() {
      if (audioId) {
        setLoading(true);
        const apiAudio = await audioApi.fetchAudio(audioId, audioLanguage);
        setAudio(transformAudio(apiAudio, audioLanguage));
        setLoading(false);
      }
    }

    fetchAudio();
  }, [audioId, audioLanguage]);

  if (loading) {
    return <Spinner withWrapper />;
  }

  if (audioId && !audio?.id) {
    return <NotFoundPage />;
  }

  if (audio?.audioType === 'podcast') {
    return <Redirect to={toEditPodcast(audioId, audioLanguage)} />;
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
