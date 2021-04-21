/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useContext, useEffect, useState } from 'react';
import { LocaleContext } from '../App/App';
import * as audioApi from '../../modules/audio/audioApi';
import { createFormData } from '../../util/formDataHelper';
import { transformAudio } from '../../util/audioHelpers';
import PodcastForm, { PodcastPropType } from './components/PodcastForm';
import {
  NewPodcastMetaInformation,
  UpdatedPodcastMetaInformation,
} from '../../modules/audio/audioApiInterfaces';
import { License } from '../../interfaces';

interface Props {
  licenses: License[];
  podcastId: string;
  podcastLanguage: string;
  isNewlyCreated: boolean;
}

const EditPodcast = ({ licenses, podcastId, podcastLanguage, isNewlyCreated }: Props) => {
  const locale: string = useContext(LocaleContext);
  const [podcast, setPodcast] = useState<PodcastPropType | undefined>(undefined);

  const onUpdate = async (
    newPodcast: NewPodcastMetaInformation | UpdatedPodcastMetaInformation,
    podcastFile: string | Blob,
  ) => {
    const formData = await createFormData(podcastFile, newPodcast);
    const updatedPodcast = await audioApi.updateAudio(newPodcast.id, formData);
    // ^^^^^^ TODO: podcastMeta not updating
    const transformedPodcast = transformAudio(updatedPodcast);
    setPodcast(transformedPodcast);
  };

  useEffect(() => {
    async function fetchPodcast() {
      if (podcastId) {
        const apiPodcast = await audioApi.fetchAudio(podcastId, podcastLanguage);
        setPodcast(transformAudio(apiPodcast));
      }
    }

    fetchPodcast();
  }, [podcastId, podcastLanguage]);

  if (podcastId && !podcast?.id) {
    return null;
  }

  const language = podcastLanguage || locale;
  return (
    <PodcastForm
      audio={{ ...podcast, language }}
      licenses={licenses}
      onUpdate={onUpdate}
      isNewlyCreated={isNewlyCreated}
    />
  );
};

export default EditPodcast;
