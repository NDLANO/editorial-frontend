/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import CreatePodcastSeries from "./CreatePodcastSeries";
import EditPodcastSeries from "./EditPodcastSeries";
import ResourcePage from "../../components/ResourcePage";
import { useSeries } from "../../modules/audio/audioQueries";

const PodcastSeriesPage = () => (
  <ResourcePage
    CreateComponent={CreatePodcastSeries}
    EditComponent={EditPodcastSeries}
    useHook={useSeries}
    titleTranslationKey="htmlTitles.podcastSeriesPage"
  />
);

export default PodcastSeriesPage;
