/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { Route, Routes } from 'react-router-dom';
import { OneColumn } from '@ndla/ui';
import EditResourceRedirect from './EditResourceRedirect';
import CreateLearningResource from './CreateLearningResource';
import NotFoundPage from '../../NotFoundPage/NotFoundPage';
import { usePreviousLocation } from '../../../util/routeHelpers';

const LearningResourcePage = () => {
  const previousLocation = usePreviousLocation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <OneColumn>
        <Routes>
          <Route path={'new'} element={<CreateLearningResource />} />
          <Route
            path={'/:articleId/edit/*'}
            element={
              <EditResourceRedirect
                isNewlyCreated={previousLocation === '/subject-matter/learning-resource/new'}
              />
            }
          />
          <Route element={<NotFoundPage />} />
        </Routes>
      </OneColumn>
    </div>
  );
};

export default LearningResourcePage;
