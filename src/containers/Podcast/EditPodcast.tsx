/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as audioApi from '../../modules/audio/audioApi';
import { createFormData } from '../../util/formDataHelper';
import { toEditAudio } from '../../util/routeHelpers';
import PodcastForm from './components/PodcastForm';
import Spinner from '../../components/Spinner';
import { useTranslateApi } from '../FormikForm/translateFormHooks';
import { PodcastMetaInformationPut, AudioApiType } from '../../modules/audio/audioApiInterfaces';

interface Props {
  podcastId: number;
  podcastLanguage: string;
  isNewlyCreated: boolean;
}

const EditPodcast = ({ podcastId, podcastLanguage, isNewlyCreated }: Props) => {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const [podcast, setPodcast] = useState<AudioApiType | undefined>(undefined);
  const [podcastChanged, setPodcastChanged] = useState(false);
  const setPodcastWithFlag = (podcast: AudioApiType | undefined, changed: boolean) => {
    setPodcast(podcast);
    setPodcastChanged(changed);
  };
  const [loading, setLoading] = useState<boolean>(false);
  const { translating, translateToNN } = useTranslateApi(
    podcast,
    (podcast: AudioApiType) => setPodcastWithFlag(podcast, true),
    [
      'id',
      'manuscript.manuscript',
      'title.title',
      'podcastMeta.introduction',
      'podcastMeta.coverPhoto.altText',
    ],
  );

  const onUpdate = async (
    newPodcast: PodcastMetaInformationPut,
    podcastFile: string | Blob | undefined,
  ) => {
    const formData = await createFormData(podcastFile, newPodcast);
    const updatedPodcast = await audioApi.updateAudio(podcastId, formData);
    setPodcastWithFlag(updatedPodcast, false);
  };

  useEffect(() => {
    async function fetchPodcast() {
      if (podcastId) {
        setLoading(true);
        const apiPodcast = await audioApi.fetchAudio(podcastId, podcastLanguage);
        setPodcastWithFlag(apiPodcast, false);
        setLoading(false);
      }
    }

    fetchPodcast();
  }, [podcastId, podcastLanguage]);

  if (podcastId && !podcast?.id) {
    return null;
  }

  if (loading) {
    return <Spinner withWrapper />;
  }

  if (podcast?.audioType === 'standard') {
    return <Redirect to={toEditAudio(podcastId, podcastLanguage)} />;
  }

  const language = podcastLanguage || locale;
  return (
    <PodcastForm
      audio={podcast}
      language={language}
      podcastChanged={podcastChanged}
      onUpdate={onUpdate}
      isNewlyCreated={isNewlyCreated}
      translating={translating}
      translateToNN={translateToNN}
    />
  );
};

export default EditPodcast;
