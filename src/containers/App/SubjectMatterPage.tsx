/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Route, Routes } from "react-router-dom";
import { ArticleRedirect } from "../ArticlePage/ArticleRedirect";
import CreateFrontpageArticle from "../ArticlePage/FrontpageArticlePage/CreateFrontpageArticle";
import { EditFrontpageArticlePage } from "../ArticlePage/FrontpageArticlePage/EditFrontpageArticle";
import { GenericArticleRedirect } from "../ArticlePage/GenericArticleRedirect";
import CreateLearningResource from "../ArticlePage/LearningResourcePage/CreateLearningResource";
import { EditLearningResourcePage } from "../ArticlePage/LearningResourcePage/EditLearningResource";
import CreateTopicArticle from "../ArticlePage/TopicArticlePage/CreateTopicArticle";
import { EditTopicArticlePage } from "../ArticlePage/TopicArticlePage/EditTopicArticle";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

const SubjectMatterPage = () => (
  <Routes>
    <Route path="topic-article">
      <Route path="new" element={<PrivateRoute component={<CreateTopicArticle />} />} />
      <Route path=":id/edit" element={<PrivateRoute component={<ArticleRedirect />} />}>
        <Route index element={<PrivateRoute component={<EditTopicArticlePage />} />} />
        <Route path=":selectedLanguage" element={<PrivateRoute component={<EditTopicArticlePage />} />} />
      </Route>
    </Route>
    <Route path="learning-resource">
      <Route path="new" element={<PrivateRoute component={<CreateLearningResource />} />} />
      <Route path=":id/edit" element={<PrivateRoute component={<ArticleRedirect />} />}>
        <Route index element={<PrivateRoute component={<EditLearningResourcePage />} />} />
        <Route path=":selectedLanguage" element={<PrivateRoute component={<EditLearningResourcePage />} />} />
      </Route>
    </Route>
    <Route path="frontpage-article">
      <Route path="new" element={<PrivateRoute component={<CreateFrontpageArticle />} />} />
      <Route path=":id/edit" element={<PrivateRoute component={<ArticleRedirect />} />}>
        <Route index element={<PrivateRoute component={<EditFrontpageArticlePage />} />} />
        <Route path=":selectedLanguage" element={<PrivateRoute component={<EditFrontpageArticlePage />} />} />
      </Route>
    </Route>
    <Route path="article/:id" element={<PrivateRoute component={<GenericArticleRedirect />} />} />
  </Routes>
);

export default SubjectMatterPage;
