/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IAudioMetaInformation, IUpdatedAudioMetaInformation } from '@ndla/types-audio-api';
import { updateAudio, fetchAudio } from '../../modules/audio/audioApi';
import { createFormData } from '../../util/formDataHelper';
import { toEditAudio } from '../../util/routeHelpers';
import PodcastForm from './components/PodcastForm';
import Spinner from '../../components/Spinner';
import { useTranslateApi } from '../FormikForm/translateFormHooks';

interface Props {
  isNewlyCreated?: boolean;
}

const EditPodcast = ({ isNewlyCreated }: Props) => {
  const params = useParams<'id' | 'selectedLanguage'>();
  const podcastId = Number(params.id);
  const podcastLanguage = params.selectedLanguage!;
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const [podcast, setPodcast] = useState<IAudioMetaInformation | undefined>(undefined);
  const [podcastChanged, setPodcastChanged] = useState(false);
  const setPodcastWithFlag = (podcast: IAudioMetaInformation | undefined, changed: boolean) => {
    setPodcast(podcast);
    setPodcastChanged(changed);
  };
  const [loading, setLoading] = useState<boolean>(false);
  const { translating, translateToNN } = useTranslateApi(
    podcast,
    (podcast: IAudioMetaInformation) => setPodcastWithFlag(podcast, true),
    [
      'id',
      'manuscript.manuscript',
      'title.title',
      'podcastMeta.introduction',
      'podcastMeta.coverPhoto.altText',
      'tags.tags',
    ],
  );

  const onUpdate = async (
    newPodcast: IUpdatedAudioMetaInformation,
    podcastFile: string | Blob | undefined,
  ) => {
    const formData = await createFormData(podcastFile, newPodcast);
    const updatedPodcast = await updateAudio(Number(podcastId!), formData);
    setPodcastWithFlag(updatedPodcast, false);
  };

  useEffect(() => {
    (async () => {
      if (podcastId) {
        setLoading(true);
        const apiPodcast = await fetchAudio(podcastId, podcastLanguage);
        setPodcastWithFlag(apiPodcast, false);
        setLoading(false);
      }
    })();
  }, [podcastId, podcastLanguage]);

  if (podcastId && !podcast?.id) {
    return null;
  }

  if (loading) {
    return <Spinner withWrapper />;
  }

  if (podcast?.audioType === 'standard') {
    return <Navigate replace to={toEditAudio(podcastId, podcastLanguage)} />;
  }
  const newLanguage = !podcast?.supportedLanguages.includes(podcastLanguage);
  const language = podcastLanguage || locale;
  return (
    <PodcastForm
      audio={podcast}
      language={language}
      podcastChanged={podcastChanged || newLanguage}
      onUpdatePodcast={onUpdate}
      isNewlyCreated={isNewlyCreated}
      translating={translating}
      translateToNN={translateToNN}
    />
  );
};

export default EditPodcast;
