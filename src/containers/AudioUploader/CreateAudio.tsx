/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { INewAudioMetaInformationDTO } from "@ndla/types-backend/audio-api";
import AudioForm from "./components/AudioForm";
import { postAudio } from "../../modules/audio/audioApi";
import { toEditAudio } from "../../util/routeHelpers";

const CreateAudio = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const onCreateAudio = async (newAudio: INewAudioMetaInformationDTO, file?: string | Blob): Promise<void> => {
    if (file instanceof Blob) {
      const createdAudio = await postAudio(newAudio, file);
      navigate(toEditAudio(createdAudio.id, newAudio.language), { state: { isNewlyCreated: true } });
    }
  };

  return <AudioForm onCreateAudio={onCreateAudio} audioLanguage={i18n.language} translatedFieldsToNN={[]} />;
};

export default CreateAudio;
