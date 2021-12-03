/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { Route, Routes } from 'react-router-dom';
import { OneColumn } from '@ndla/ui';
import { HelmetWithTracker } from '@ndla/tracker';
import { useTranslation } from 'react-i18next';
import loadable from '@loadable/component';
import { usePreviousLocation } from '../../util/routeHelpers';
const CreatePodcastSeries = loadable(() => import('./CreatePodcastSeries'));
const EditPodcastSeries = loadable(() => import('./EditPodcastSeries'));
const NotFoundPage = loadable(() => import('../NotFoundPage/NotFoundPage'));

const PodcastSeriesPage = () => {
  const { t } = useTranslation();
  const previousLocation = usePreviousLocation();

  return (
    <OneColumn>
      <HelmetWithTracker title={t('htmlTitles.podcastSeriesPage')} />
      <Routes>
        <Route path="new" element={<CreatePodcastSeries />} />
        <Route
          path=":seriesId/edit/:seriesLanguage"
          element={
            <EditPodcastSeries isNewlyCreated={previousLocation === '/media/podcast-series/new'} />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </OneColumn>
  );
};

export default PodcastSeriesPage;
