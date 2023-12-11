/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';
import { IAudioMetaInformation, IUpdatedAudioMetaInformation } from '@ndla/types-backend/audio-api';
import PodcastForm from './components/PodcastForm';
import { TranslateType, useTranslateToNN } from '../../components/NynorskTranslateProvider';
import Spinner from '../../components/Spinner';
import { updateAudio, fetchAudio } from '../../modules/audio/audioApi';
import { createFormData } from '../../util/formDataHelper';
import { toEditAudio } from '../../util/routeHelpers';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

interface Props {
  isNewlyCreated?: boolean;
}

const translateFields: TranslateType[] = [
  {
    field: 'manuscript.manuscript',
    type: 'text',
  },
  {
    field: 'title.title',
    type: 'text',
  },
  {
    field: 'podcastMeta.introduction',
    type: 'text',
  },
  {
    field: 'podcastMeta.coverPhoto.altText',
    type: 'text',
  },
  {
    field: 'tags.tags',
    type: 'text',
  },
];

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
  const { shouldTranslate, translate, translating } = useTranslateToNN();

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

  useEffect(() => {
    (async () => {
      if (shouldTranslate && podcast) {
        await translate(podcast, translateFields, (podcast) => setPodcastWithFlag(podcast, true));
      }
    })();
  }, [podcast, shouldTranslate, translate]);

  const onUpdate = async (
    newPodcast: IUpdatedAudioMetaInformation,
    podcastFile: string | Blob | undefined,
  ) => {
    const formData = await createFormData(podcastFile, newPodcast);
    const updatedPodcast = await updateAudio(Number(podcastId!), formData);
    setPodcastWithFlag(updatedPodcast, false);
  };

  if (podcastId && !podcast?.id) {
    return null;
  }

  if (loading) {
    return <Spinner withWrapper />;
  }

  if (!podcastId || !podcast) {
    return <NotFoundPage />;
  }

  if (podcast.audioType === 'standard') {
    return <Navigate replace to={toEditAudio(podcastId, podcastLanguage)} />;
  }
  const newLanguage = !podcast.supportedLanguages.includes(podcastLanguage);
  const language = podcastLanguage || locale;
  return (
    <PodcastForm
      supportedLanguages={podcast.supportedLanguages}
      audio={podcast}
      language={language}
      podcastChanged={podcastChanged || newLanguage}
      onUpdatePodcast={onUpdate}
      isNewlyCreated={isNewlyCreated}
      translating={translating}
    />
  );
};

export default EditPodcast;
