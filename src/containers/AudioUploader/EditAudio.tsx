/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import {
  IAudioMetaInformation as AudioApiType,
  IUpdatedAudioMetaInformation,
} from '@ndla/types-audio-api';
import AudioForm from './components/AudioForm';
import { createFormData } from '../../util/formDataHelper';
import { toEditPodcast } from '../../util/routeHelpers';
import Spinner from '../../components/Spinner';
import { useTranslateApi } from '../FormikForm/translateFormHooks';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { fetchAudio, updateAudio } from '../../modules/audio/audioApi';

interface Props {
  isNewlyCreated?: boolean;
}

const EditAudio = ({ isNewlyCreated }: Props) => {
  const { id: audioId, selectedLanguage: audioLanguage } = useParams<'id' | 'selectedLanguage'>();
  const [audio, setAudio] = useState<AudioApiType | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const { translating, translateToNN } = useTranslateApi(
    audio,
    (audio: AudioApiType) => setAudio(audio),
    ['id', 'manuscript.manuscript', 'title.title'],
  );

  useEffect(() => {
    (async () => {
      if (audioId) {
        setLoading(true);
        const apiAudio = await fetchAudio(Number(audioId), audioLanguage);
        setAudio(apiAudio);
        setLoading(false);
      }
    })();
  }, [audioId, audioLanguage]);

  const onUpdate = async (
    newAudio: IUpdatedAudioMetaInformation,
    file: string | Blob | undefined,
  ): Promise<void> => {
    const formData = await createFormData(file, newAudio);
    const updatedAudio = await updateAudio(Number(audioId), formData);
    setAudio(updatedAudio);
  };

  if (loading) {
    return <Spinner withWrapper />;
  }

  if (audioId && !audio?.id) {
    return <NotFoundPage />;
  }

  if (audio?.audioType === 'podcast') {
    return <Navigate replace to={toEditPodcast(Number(audioId), audioLanguage!)} />;
  }

  const language = audioLanguage!;

  return (
    <AudioForm
      audio={audio}
      revision={audio?.revision}
      onUpdateAudio={onUpdate}
      audioLanguage={language}
      isNewlyCreated={isNewlyCreated}
      translating={translating}
      translateToNN={translateToNN}
    />
  );
};

export default EditAudio;
