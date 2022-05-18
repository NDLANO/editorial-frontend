/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import loadable from '@loadable/component';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import { useDraft } from '../../modules/draft/draftQueries';
import { toEditArticle } from '../../util/routeHelpers';
import Spinner from '../../components/Spinner';
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
      <Route path="article/:id" element={<PrivateRoute component={<GenericArticleRedirect />} />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </>
);

const GenericArticleRedirect = () => {
  const parsedId = Number(useParams<'id'>().id);
  const { data: article, error, isLoading } = useDraft({ id: parsedId }, { enabled: !!parsedId });
  if (isLoading) return <Spinner />;
  if (error || !article || !parsedId) return <NotFoundPage />;

  const replaceUrl = toEditArticle(article.id, article.articleType);
  return <Navigate replace to={replaceUrl} />;
};

export default SubjectMatterPage;
