/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { LocaleContext } from '../App/App';
import * as audioApi from '../../modules/audio/audioApi';
import { NewAudioMetaInformation } from '../../modules/audio/audioApiInterfaces';
import { createAudioFormData } from '../../util/formDataHelper';
import { toEditPodcast } from '../../util/routeHelpers';
import { License } from '../../interfaces';
import PodcastForm from './components/PodcastForm';

interface Props {
  history: RouteComponentProps['history'];
  licenses: License[];
}

const CreatePodcast = ({ licenses, history }: Props) => {
  const locale: string = useContext(LocaleContext);

  const onCreatePodcast = async (
    newPodcast: NewAudioMetaInformation,
    podcastFile: string | Blob,
  ) => {
    const formData = await createAudioFormData(podcastFile, newPodcast);
    const createdPodcast = await audioApi.postAudio(formData);
    if (!newPodcast.id) {
      history.push(toEditPodcast(createdPodcast.id, newPodcast.language));
    }
  };

  return (
    <PodcastForm
      audio={{ language: locale }}
      licenses={licenses}
      onUpdate={onCreatePodcast}
      isNewlyCreated={false}
    />
  );
};

export default CreatePodcast;
