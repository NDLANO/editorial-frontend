/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PageContent } from "@ndla/primitives";
import { NewSeriesDTO } from "@ndla/types-backend/audio-api";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { NynorskTranslateProvider } from "../../components/NynorskTranslateProvider";
import { postSeries } from "../../modules/audio/audioApi";
import { toEditPodcastSeries } from "../../util/routeHelpers";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import PodcastSeriesForm from "./components/PodcastSeriesForm";

export const Component = () => <PrivateRoute component={<CreatePodcastSeriesPage />} />;

export const CreatePodcastSeriesPage = () => {
  return (
    <NynorskTranslateProvider>
      <PageContent>
        <CreatePodcastSeries />
      </PageContent>
    </NynorskTranslateProvider>
  );
};

const CreatePodcastSeries = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const locale = i18n.language;

  const onUpdate = async (newSeries: NewSeriesDTO): Promise<void> => {
    const createdSeries = await postSeries(newSeries);
    navigate(toEditPodcastSeries(createdSeries.id, newSeries.language), { state: { isNewlyCreated: true } });
  };

  return <PodcastSeriesForm language={locale} onUpdate={onUpdate} translatedFieldsToNN={[]} />;
};
