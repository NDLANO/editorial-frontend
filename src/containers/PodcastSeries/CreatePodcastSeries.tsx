/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { INewSeriesDTO } from "@ndla/types-backend/audio-api";
import PodcastSeriesForm from "./components/PodcastSeriesForm";
import { postSeries } from "../../modules/audio/audioApi";
import { toEditPodcastSeries } from "../../util/routeHelpers";

const CreatePodcastSeries = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const locale = i18n.language;

  const onUpdate = async (newSeries: INewSeriesDTO): Promise<void> => {
    const createdSeries = await postSeries(newSeries);
    navigate(toEditPodcastSeries(createdSeries.id, newSeries.language));
  };

  return <PodcastSeriesForm language={locale} onUpdate={onUpdate} isNewlyCreated={false} translatedFieldsToNN={[]} />;
};

export default CreatePodcastSeries;
