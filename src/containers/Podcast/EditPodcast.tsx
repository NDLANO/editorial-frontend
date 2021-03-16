/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { FC, useContext, useEffect, useState } from 'react';
import { LocaleContext } from '../App/App';
import * as audioApi from '../../modules/audio/audioApi';
import { createAudioFormData } from '../../util/formDataHelper';
import transformAudio from '../AudioUploader/EditAudio';
import PodcastForm from './components/PodcastForm';
import { NewAudioMetaInformation } from '../../modules/audio/audioApiInterfaces';
import { License } from '../../interfaces';

interface Props {
  licenses: License[];
  podcastId: string;
  podcastLanguage: string;
  isNewlyCreated: boolean;
}

const EditPodcast: FC<Props> = ({ licenses, podcastId, podcastLanguage, isNewlyCreated }) => {
  const locale: string = useContext(LocaleContext);
  const [podcast, setPodcast] = useState<any>({}); // TODO type!!

  const onUpdate = async (newPodcast: NewAudioMetaInformation, podcastFile: string | Blob) => {
    const formData = await createAudioFormData(podcastFile, newPodcast);
    const updatedPodcast = await audioApi.updateAudio(newPodcast.id, formData);
    const transformedPodcast = transformAudio(updatedPodcast);
    setPodcast(transformedPodcast);
  };

  const fetchPodcast = async () => {
    if (podcastId) {
      const apiAudio = await audioApi.fetchAudio(podcastId, podcastLanguage);
      console.log('hva er apiAudio?', apiAudio);
      setPodcast(transformAudio(apiAudio));
    }
  };

  useEffect(() => {
    fetchPodcast();
  }, [podcastId, podcastLanguage]);

  if (podcastId && !podcast.id) {
    return null;
  }

  const language = podcastLanguage || locale;
  return (
    <PodcastForm
      audio={{ language: language }}
      licenses={licenses}
      onUpdate={onUpdate}
      isNewlyCreated={isNewlyCreated}
    />
  );
};

export default EditPodcast;
