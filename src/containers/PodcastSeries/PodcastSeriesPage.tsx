/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import loadable from '@loadable/component';
import { useSeries } from '../../modules/audio/audioQueries';
import ResourcePage from '../../components/ResourcePage';
const CreatePodcastSeries = loadable(() => import('./CreatePodcastSeries'));
const EditPodcastSeries = loadable(() => import('./EditPodcastSeries'));

const PodcastSeriesPage = () => (
  <ResourcePage
    CreateComponent={CreatePodcastSeries}
    EditComponent={EditPodcastSeries}
    useHook={useSeries}
    createUrl="/media/podcast-series/new"
    titleTranslationKey="htmlTitles.podcastSeriesPage"
  />
);

export default PodcastSeriesPage;
