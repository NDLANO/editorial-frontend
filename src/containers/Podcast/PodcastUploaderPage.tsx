/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import CreatePodcast from "./CreatePodcast";
import EditPodcast from "./EditPodcast";
import ResourcePage from "../../components/ResourcePage";
import { useAudio } from "../../modules/audio/audioQueries";

const PodcastUploderPage = () => (
  <ResourcePage
    CreateComponent={CreatePodcast}
    EditComponent={EditPodcast}
    useHook={useAudio}
    titleTranslationKey="htmlTitles.podcastUploaderPage"
  />
);

export default PodcastUploderPage;
