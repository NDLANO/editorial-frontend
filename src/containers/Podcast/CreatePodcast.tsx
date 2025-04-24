/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { INewAudioMetaInformationDTO } from "@ndla/types-backend/audio-api";
import PodcastForm from "./components/PodcastForm";
import { postAudio } from "../../modules/audio/audioApi";
import { toEditPodcast } from "../../util/routeHelpers";

const CreatePodcast = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const navigate = useNavigate();

  const onCreatePodcast = async (newPodcast: INewAudioMetaInformationDTO, podcastFile: string | Blob | undefined) => {
    if (podcastFile instanceof Blob) {
      const createdPodcast = await postAudio(newPodcast, podcastFile);
      navigate(toEditPodcast(createdPodcast.id, newPodcast.language));
    }
  };

  return (
    <PodcastForm
      onCreatePodcast={onCreatePodcast}
      supportedLanguages={[locale]}
      isNewlyCreated={false}
      language={locale}
      translatedFieldsToNN={[]}
    />
  );
};

export default CreatePodcast;
