/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { INewAudioMetaInformation } from '@ndla/types-audio-api';
import AudioForm from './components/AudioForm';
import { postAudio } from '../../modules/audio/audioApi';
import { createFormData } from '../../util/formDataHelper';
import { toEditAudio } from '../../util/routeHelpers';

const CreateAudio = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const onCreateAudio = async (
    newAudio: INewAudioMetaInformation,
    file?: string | Blob,
    id?: number,
  ): Promise<void> => {
    const formData = await createFormData(file, newAudio);
    const createdAudio = await postAudio(formData);
    if (!id) {
      navigate(toEditAudio(createdAudio.id, newAudio.language));
    }
  };

  return <AudioForm onSubmitFunc={onCreateAudio} audioLanguage={i18n.language} />;
};

export default CreateAudio;
