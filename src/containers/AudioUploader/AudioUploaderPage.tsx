/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { Route, Routes } from 'react-router-dom';
import { OneColumn } from '@ndla/ui';
import { HelmetWithTracker } from '@ndla/tracker';
import { useTranslation } from 'react-i18next';
import CreateAudio from './CreateAudio';
import EditAudio from './EditAudio';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { usePreviousLocation } from '../../util/routeHelpers';

const AudioUploaderPage = () => {
  const { t, i18n } = useTranslation();
  const previousLocation = usePreviousLocation();

  return (
    <div>
      <OneColumn>
        <HelmetWithTracker title={t('htmlTitles.audioUploaderPage')} />
        <Routes>
          <Route path="new" element={<CreateAudio locale={i18n.language} />} />
          <Route
            path=":audioId/edit/:audioLanguage"
            element={
              <EditAudio
                isNewlyCreated={previousLocation === '/media/audio-upload/new'}
                locale={i18n.language}
              />
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </OneColumn>
    </div>
  );
};

export default AudioUploaderPage;
