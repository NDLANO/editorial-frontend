/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { Route, Routes } from 'react-router-dom';
import loadable from '@loadable/component';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import Footer from './components/Footer';
const NotFoundPage = loadable(() => import('../NotFoundPage/NotFoundPage'));
const TopicArticlePage = loadable(() => import('../ArticlePage/TopicArticlePage/TopicArticlePage'));
const LearningResourcePage = loadable(() =>
  import('../ArticlePage/LearningResourcePage/LearningResourcePage'),
);

const SubjectMatterPage = () => (
  <>
    <Routes>
      <Route path="topic-article/*" element={<PrivateRoute component={<TopicArticlePage />} />} />
      <Route
        path="learning-resource/*"
        element={<PrivateRoute component={<LearningResourcePage />} />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </>
);

export default SubjectMatterPage;
