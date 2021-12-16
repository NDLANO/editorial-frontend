/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as audioApi from '../../modules/audio/audioApi';
import { PodcastMetaInformationPost } from '../../modules/audio/audioApiInterfaces';
import { createFormData } from '../../util/formDataHelper';
import { toEditPodcast } from '../../util/routeHelpers';
import PodcastForm from './components/PodcastForm';

const CreatePodcast = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const navigate = useNavigate();

  const onCreatePodcast = async (
    newPodcast: PodcastMetaInformationPost,
    podcastFile: string | Blob | undefined,
  ) => {
    const formData = await createFormData(podcastFile, newPodcast);
    const createdPodcast = await audioApi.postAudio(formData);
    if (!newPodcast.id) {
      navigate(toEditPodcast(createdPodcast.id, newPodcast.language));
    }
  };

  return <PodcastForm onUpdate={onCreatePodcast} isNewlyCreated={false} language={locale} />;
};

export default CreatePodcast;
