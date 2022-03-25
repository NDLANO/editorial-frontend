/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { IAudioMetaInformation, IUpdatedAudioMetaInformation } from '@ndla/types-audio-api';
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
  const params = useParams<'id' | 'selectedLanguage'>();
  const [audio, setAudio] = useState<IAudioMetaInformation | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const { translating, translateToNN } = useTranslateApi(
    audio,
    (audio: IAudioMetaInformation) => setAudio(audio),
    ['id', 'manuscript.manuscript', 'title.title'],
  );
  const audioId = Number(params.id) || undefined;
  const audioLanguage = params.selectedLanguage!;

  useEffect(() => {
    (async () => {
      if (audioId) {
        setLoading(true);
        const apiAudio = await fetchAudio(audioId, audioLanguage);
        setAudio(apiAudio);
        setLoading(false);
      }
    })();
  }, [audioId, audioLanguage]);

  if (loading) {
    return <Spinner withWrapper />;
  }

  if (!audioId || !audio) {
    return <NotFoundPage />;
  }

  const onUpdate = async (
    newAudio: IUpdatedAudioMetaInformation,
    file: string | Blob | undefined,
  ): Promise<void> => {
    const formData = await createFormData(file, newAudio);
    const updatedAudio = await updateAudio(audioId, formData);
    setAudio(updatedAudio);
  };

  if (audio?.audioType === 'podcast') {
    return <Navigate replace to={toEditPodcast(audioId, audioLanguage)} />;
  }

  return (
    <AudioForm
      audio={audio}
      onUpdateAudio={onUpdate}
      audioLanguage={audioLanguage}
      isNewlyCreated={isNewlyCreated}
      translating={translating}
      translateToNN={translateToNN}
    />
  );
};

export default EditAudio;
