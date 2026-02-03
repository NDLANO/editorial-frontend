/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PageContent } from "@ndla/primitives";
import { NewAudioMetaInformationDTO } from "@ndla/types-backend/audio-api";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { NynorskTranslateProvider } from "../../components/NynorskTranslateProvider";
import { postAudio } from "../../modules/audio/audioApi";
import { toEditPodcast } from "../../util/routeHelpers";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import PodcastForm from "./components/PodcastForm";

export const Component = () => <PrivateRoute component={<CreatePodcastPage />} />;

export const CreatePodcastPage = () => {
  return (
    <NynorskTranslateProvider>
      <PageContent>
        <CreatePodcast />
      </PageContent>
    </NynorskTranslateProvider>
  );
};

const CreatePodcast = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const navigate = useNavigate();

  const onCreatePodcast = async (newPodcast: NewAudioMetaInformationDTO, podcastFile: string | Blob | undefined) => {
    if (podcastFile instanceof Blob) {
      const createdPodcast = await postAudio(newPodcast, podcastFile);
      navigate(toEditPodcast(createdPodcast.id, newPodcast.language), { state: { isNewlyCreated: true } });
    }
  };

  return <PodcastForm onCreatePodcast={onCreatePodcast} language={locale} translatedFieldsToNN={[]} />;
};
