/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import loadable from '@loadable/component';
import { useAudio } from '../../modules/audio/audioQueries';
import ResourcePage from '../../components/ResourcePage';
const CreatePodcast = loadable(() => import('./CreatePodcast'));
const EditPodcast = loadable(() => import('./EditPodcast'));

const PodcastUploderPage = () => (
  <ResourcePage
    CreateComponent={CreatePodcast}
    EditComponent={EditPodcast}
    useHook={useAudio}
    createUrl="/media/podcast-upload/new"
    titleTranslationKey="htmlTitles.podcastUploaderPage"
  />
);

export default PodcastUploderPage;
