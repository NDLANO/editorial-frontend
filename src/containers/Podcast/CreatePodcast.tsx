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
import { NewPodcastMetaInformation } from '../../modules/audio/audioApiInterfaces';
import { createFormData } from '../../util/formDataHelper';
import { toEditPodcast } from '../../util/routeHelpers';
import { License } from '../../interfaces';
import PodcastForm from './components/PodcastForm';

interface Props extends RouteComponentProps {
  licenses: License[];
}

const CreatePodcast = ({ licenses, history }: Props) => {
  const locale: string = useContext(LocaleContext);

  const onCreatePodcast = async (
    newPodcast: NewPodcastMetaInformation,
    podcastFile: string | Blob | undefined,
  ) => {
    const formData = await createFormData(podcastFile, newPodcast);
    const createdPodcast = await audioApi.postAudio(formData);
    if (!newPodcast.id) {
      history.push(toEditPodcast(createdPodcast.id, newPodcast.language));
    }
  };

  return (
    <PodcastForm
      licenses={licenses}
      onUpdate={onCreatePodcast}
      isNewlyCreated={false}
      language={locale}
    />
  );
};

export default CreatePodcast;
