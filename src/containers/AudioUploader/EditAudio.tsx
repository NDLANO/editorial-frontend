/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { IAudioMetaInformationDTO, IUpdatedAudioMetaInformationDTO } from "@ndla/types-backend/audio-api";
import AudioForm from "./components/AudioForm";
import { TranslateType, useTranslateToNN } from "../../components/NynorskTranslateProvider";
import { PageSpinner } from "../../components/PageSpinner";
import { fetchAudio, updateAudio } from "../../modules/audio/audioApi";
import { createFormData } from "../../util/formDataHelper";
import { toEditPodcast } from "../../util/routeHelpers";
import NotFoundPage from "../NotFoundPage/NotFoundPage";

interface Props {
  isNewlyCreated?: boolean;
}

const translateFields: TranslateType[] = [
  { field: "manuscript.manuscript", type: "text" },
  { field: "title.title", type: "text" },
  { field: "tags.tags", type: "text" },
];

const EditAudio = ({ isNewlyCreated }: Props) => {
  const params = useParams<"id" | "selectedLanguage">();
  const [audio, setAudio] = useState<IAudioMetaInformationDTO | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const { shouldTranslate, translate, translating } = useTranslateToNN();
  const audioId = Number(params.id) || undefined;
  const audioLanguage = params.selectedLanguage!;

  useEffect(() => {
    (async () => {
      if (audioId) {
        setLoading(true);
        const apiAudio = await fetchAudio(audioId, audioLanguage);
        setAudio(apiAudio);
        setLoading(false);
      }
    })();
  }, [audioId, audioLanguage]);

  useEffect(() => {
    (async () => {
      if (shouldTranslate && !loading) {
        setLoading(true);
      }
      if (audio && !loading && shouldTranslate) {
        await translate(audio, translateFields, setAudio);
        setLoading(false);
      }
    })();
  }, [shouldTranslate, translate, audio, loading]);

  if (loading || translating) {
    return <PageSpinner />;
  }

  if (!audioId || !audio) {
    return <NotFoundPage />;
  }

  const onUpdate = async (
    newAudio: IUpdatedAudioMetaInformationDTO,
    file: string | Blob | undefined,
  ): Promise<void> => {
    const formData = createFormData(file, newAudio);
    const updatedAudio = await updateAudio(audioId, formData);
    setAudio(updatedAudio);
  };

  if (audio?.audioType === "podcast") {
    return <Navigate replace to={toEditPodcast(audioId, audioLanguage)} />;
  }

  const isNewLanguage = !!audioLanguage && !audio.supportedLanguages.includes(audioLanguage);

  return (
    <AudioForm
      audio={audio}
      onUpdateAudio={onUpdate}
      audioLanguage={audioLanguage}
      isNewlyCreated={isNewlyCreated}
      isNewLanguage={isNewLanguage}
      supportedLanguages={audio.supportedLanguages}
    />
  );
};

export default EditAudio;
