/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { OneColumn } from '@ndla/ui';
import { HelmetWithTracker } from '@ndla/tracker';
import { useTranslation } from 'react-i18next';
import loadable from '@loadable/component';
const NotFoundPage = loadable(() => import('../NotFoundPage/NotFoundPage'));
const CreatePodcast = loadable(() => import('./CreatePodcast'));
const EditPodcast = loadable(() => import('./EditPodcast'));

const PodcastUploderPage = () => {
  const { t } = useTranslation();
  const [previousLocation, setPreviousLocation] = useState('');
  const [isNewlyCreated, setNewlyCreated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    /\/podcast-upload\/(.*)\/new/.test(location.pathname)
      ? setNewlyCreated(true)
      : setNewlyCreated(false);
    if (previousLocation !== location.pathname) {
      setPreviousLocation(location.pathname);
    }
  }, [location.pathname, previousLocation]);

  return (
    <OneColumn>
      <HelmetWithTracker title={t('htmlTitles.podcastUploaderPage')} />
      <Routes>
        <Route path="new" element={<CreatePodcast />} />
        <Route
          path=":podcastId/edit/:audioLanguage"
          element={<EditPodcast isNewlyCreated={isNewlyCreated} />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </OneColumn>
  );
};

export default PodcastUploderPage;
