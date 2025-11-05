/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router";
import { PageContent } from "@ndla/primitives";
import { AudioMetaInformationDTO, UpdatedAudioMetaInformationDTO } from "@ndla/types-backend/audio-api";
import PodcastForm from "./components/PodcastForm";
import { NynorskTranslateProvider, TranslateType, useTranslateToNN } from "../../components/NynorskTranslateProvider";
import { PageSpinner } from "../../components/PageSpinner";
import { updateAudio, fetchAudio } from "../../modules/audio/audioApi";
import { toEditAudio } from "../../util/routeHelpers";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

const translateFields: TranslateType[] = [
  {
    field: "manuscript.manuscript",
    type: "html",
  },
  {
    field: "title.title",
    type: "text",
  },
  {
    field: "podcastMeta.introduction",
    type: "text",
  },
  {
    field: "podcastMeta.coverPhoto.altText",
    type: "text",
  },
  {
    field: "tags.tags",
    type: "text",
  },
];

export const Component = () => <PrivateRoute component={<EditPodcastPage />} />;

export const EditPodcastPage = () => {
  return (
    <NynorskTranslateProvider>
      <PageContent>
        <EditPodcast />
      </PageContent>
    </NynorskTranslateProvider>
  );
};

const EditPodcast = () => {
  const params = useParams<"id" | "selectedLanguage">();
  const podcastId = Number(params.id);
  const podcastLanguage = params.selectedLanguage!;
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const [podcast, setPodcast] = useState<AudioMetaInformationDTO | undefined>(undefined);
  const [podcastChanged, setPodcastChanged] = useState(false);
  const setPodcastWithFlag = (podcast: AudioMetaInformationDTO | undefined, changed: boolean) => {
    setPodcast(podcast);
    setPodcastChanged(changed);
  };
  const [loading, setLoading] = useState<boolean>(false);
  const { shouldTranslate, translate, translating, translatedFields } = useTranslateToNN();

  useEffect(() => {
    (async () => {
      if (podcastId) {
        setLoading(true);
        const apiPodcast = await fetchAudio(podcastId, podcastLanguage);
        setPodcastWithFlag(apiPodcast, false);
        setLoading(false);
      }
    })();
  }, [podcastId, podcastLanguage]);

  useEffect(() => {
    (async () => {
      if (shouldTranslate && podcast) {
        await translate(podcast, translateFields, (podcast) => setPodcastWithFlag(podcast, true));
      }
    })();
  }, [podcast, shouldTranslate, translate]);

  const onUpdate = async (newPodcast: UpdatedAudioMetaInformationDTO, podcastFile: string | Blob | undefined) => {
    if (typeof podcastFile === "string") return;
    const updatedPodcast = await updateAudio(Number(podcastId!), newPodcast, podcastFile);
    setPodcastWithFlag(updatedPodcast, false);
  };

  if (podcastId && !podcast?.id) {
    return null;
  }

  if (loading) {
    return <PageSpinner />;
  }

  if (!podcastId || !podcast) {
    return <NotFoundPage />;
  }

  if (podcast.audioType === "standard") {
    return <Navigate replace to={toEditAudio(podcastId, podcastLanguage)} />;
  }
  const newLanguage = !podcast.supportedLanguages.includes(podcastLanguage);
  const language = podcastLanguage || locale;
  return (
    <PodcastForm
      audio={podcast}
      language={language}
      podcastChanged={podcastChanged || newLanguage}
      onUpdatePodcast={onUpdate}
      translating={translating}
      translatedFieldsToNN={translatedFields}
    />
  );
};
