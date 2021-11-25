/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import AudioForm from './components/AudioForm';
import * as audioApi from '../../modules/audio/audioApi';
import { createFormData } from '../../util/formDataHelper';
import { toEditPodcast } from '../../util/routeHelpers';
import Spinner from '../../components/Spinner';
import { useTranslateApi } from '../FormikForm/translateFormHooks';
import { LocaleType } from '../../interfaces';
import { AudioApiType, AudioMetaInformationPut } from '../../modules/audio/audioApiInterfaces';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

interface Props {
  locale: LocaleType;
  isNewlyCreated?: boolean;
}

const EditAudio = ({ locale, isNewlyCreated, ...rest }: Props) => {
  const { audioId, audioLanguage } = useParams<'audioId' | 'audioLanguage'>();
  const [audio, setAudio] = useState<AudioApiType | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const { translating, translateToNN } = useTranslateApi(
    audio,
    (audio: AudioApiType) => setAudio(audio),
    ['id', 'manuscript.manuscript', 'title.title'],
  );

  useEffect(() => {
    async function fetchAudio() {
      if (audioId) {
        setLoading(true);
        const apiAudio = await audioApi.fetchAudio(Number(audioId), audioLanguage!);
        setAudio(apiAudio);
        setLoading(false);
      }
    }

    fetchAudio();
  }, [audioId, audioLanguage]);

  const onUpdate = async (
    newAudio: AudioMetaInformationPut,
    file: string | Blob | undefined,
  ): Promise<void> => {
    const formData = await createFormData(file, newAudio);
    const updatedAudio = await audioApi.updateAudio(Number(audioId), formData);
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

  const language = audioLanguage || locale;
  return (
    <AudioForm
      audio={audio}
      revision={audio && audio.revision}
      onUpdate={onUpdate}
      audioLanguage={language}
      isNewlyCreated={isNewlyCreated}
      translating={translating}
      translateToNN={translateToNN}
      {...rest}
    />
  );
};

export default EditAudio;
