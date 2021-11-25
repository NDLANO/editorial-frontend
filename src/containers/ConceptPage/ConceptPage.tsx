/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router-dom';
import { OneColumn } from '@ndla/ui';
import loadable from '@loadable/component';
import Footer from '../App/components/Footer';
import { usePreviousLocation } from '../../util/routeHelpers';
const CreateConcept = loadable(() => import('./CreateConcept'));
const EditConcept = loadable(() => import('./EditConcept'));
const NotFoundPage = loadable(() => import('../NotFoundPage/NotFoundPage'));

const ConceptPage = () => {
  const previousLocation = usePreviousLocation();
  const { i18n } = useTranslation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <OneColumn>
        <Routes>
          <Route path={'new'} element={<CreateConcept locale={i18n.language} />} />
          <Route
            path={':conceptId/edit/:selectedLanguage'}
            element={<EditConcept isNewlyCreated={previousLocation === '/concept/new'} />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </OneColumn>
      <Footer showLocaleSelector={false} />
    </div>
  );
};

export default memo(ConceptPage);
