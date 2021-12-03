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
import loadable from '@loadable/component';
import { usePreviousLocation } from '../../util/routeHelpers';
const EditImage = loadable(() => import('./EditImage'));
const CreateImage = loadable(() => import('./CreateImage'));
const NotFoundPage = loadable(() => import('../NotFoundPage/NotFoundPage'));

const ImageUploaderPage = () => {
  const { t } = useTranslation();
  const prevLoc = usePreviousLocation();
  return (
    <OneColumn>
      <HelmetWithTracker title={t('htmlTitles.imageUploaderPage')} />
      <Routes>
        <Route path="new" element={<CreateImage />} />
        <Route
          path=":imageId/edit/:imageLanguage"
          element={<EditImage isNewlyCreated={prevLoc === '/media/image-upload/new'} />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </OneColumn>
  );
};

export default ImageUploaderPage;
