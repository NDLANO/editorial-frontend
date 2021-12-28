/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AudioForm from './components/AudioForm';
import * as audioApi from '../../modules/audio/audioApi';
import { createFormData } from '../../util/formDataHelper';
import { toEditAudio } from '../../util/routeHelpers';
import { AudioMetaInformationPost } from '../../modules/audio/audioApiInterfaces';

const CreateAudio = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const onCreateAudio = async (
    newAudio: AudioMetaInformationPost,
    file?: string | Blob,
  ): Promise<void> => {
    const formData = await createFormData(file, newAudio);
    const createdAudio = await audioApi.postAudio(formData);
    if (!newAudio.id) {
      navigate(toEditAudio(createdAudio.id, newAudio.language));
    }
  };

  return <AudioForm onUpdate={onCreateAudio} audioLanguage={i18n.language} />;
};

export default CreateAudio;
