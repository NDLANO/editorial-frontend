/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { PageContent } from "@ndla/primitives";
import { NewAudioMetaInformationDTO } from "@ndla/types-backend/audio-api";
import AudioForm from "./components/AudioForm";
import { NynorskTranslateProvider } from "../../components/NynorskTranslateProvider";
import { postAudio } from "../../modules/audio/audioApi";
import { toEditAudio } from "../../util/routeHelpers";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

export const Component = () => <PrivateRoute component={<CreateAudioPage />} />;

export const CreateAudioPage = () => {
  return (
    <NynorskTranslateProvider>
      <PageContent>
        <CreateAudio />
      </PageContent>
    </NynorskTranslateProvider>
  );
};

const CreateAudio = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const onCreateAudio = async (newAudio: NewAudioMetaInformationDTO, file?: string | Blob): Promise<void> => {
    if (file instanceof Blob) {
      const createdAudio = await postAudio(newAudio, file);
      navigate(toEditAudio(createdAudio.id, newAudio.language), { state: { isNewlyCreated: true } });
    }
  };

  return <AudioForm onCreateAudio={onCreateAudio} audioLanguage={i18n.language} translatedFieldsToNN={[]} />;
};
