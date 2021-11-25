/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { OneColumn } from '@ndla/ui';
import { Route, Routes } from 'react-router-dom';
import EditArticleRedirect from './EditArticleRedirect';
import CreateTopicArticle from './CreateTopicArticle';
import NotFoundPage from '../../NotFoundPage/NotFoundPage';
import { usePreviousLocation } from '../../../util/routeHelpers';

const TopicArticlePage = () => {
  const previousLocation = usePreviousLocation();

  return (
    <OneColumn>
      <Routes>
        <Route path={'new'} element={<CreateTopicArticle />} />
        <Route
          path={':articleId/edit/*'}
          element={
            <EditArticleRedirect
              isNewlyCreated={previousLocation === '/subject-matter/topic-article/new'}
            />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </OneColumn>
  );
};

export default TopicArticlePage;
